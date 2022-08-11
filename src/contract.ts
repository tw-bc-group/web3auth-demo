import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import ERC721ABI from "./abi.json"

const AVL_ADDRESS: string = "0xa37664d42D11F2645D9949148eDa6bBb9d45eacB";

interface NFT {
  tokenId: number;
  imageUrl: string;
}

export default class EthereumContract {
  private provider: SafeEventEmitterProvider;
  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  async ownerOf() {
    const web3 = new Web3(this.provider as any);
    const avalonToken = new web3.eth.Contract(ERC721ABI as AbiItem[], AVL_ADDRESS);
    const owner = await avalonToken.methods.ownerOf(0).call();
    return owner;
  }

  async tokenURI() {
    const web3 = new Web3(this.provider as any);
    const avalonToken = new web3.eth.Contract(ERC721ABI as AbiItem[], AVL_ADDRESS);
    const url = await avalonToken.methods.tokenURI(0).call();
    return url;
  }

  async balanceOf(): Promise<number> {
    const web3 = new Web3(this.provider as any);
    const accounts = await web3.eth.getAccounts();
    const avalonToken = new web3.eth.Contract(ERC721ABI as AbiItem[], AVL_ADDRESS);
    const numberOfNFTs = await avalonToken.methods.balanceOf(accounts[0]).call();
    return numberOfNFTs;
  }

  async getAllNFTs(): Promise<number[]> {
    const web3 = new Web3(this.provider as any);
    const accounts = await web3.eth.getAccounts();
    const avalonToken = new web3.eth.Contract(ERC721ABI as AbiItem[], AVL_ADDRESS);
    const balance = await this.balanceOf();
    const range = (n: number) => Array.from({ length: n }, (value, key) => key)
    const nfts = await Promise.all(range(balance).map(index => avalonToken.methods.tokenOfOwnerByIndex(accounts[0], index).call()));
    return nfts;
  }

  ipfsToHttps(uri: string): string {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  async getFullNFTs(): Promise<NFT[]> {
    const web3 = new Web3(this.provider as any);
    const avalonToken = new web3.eth.Contract(ERC721ABI as AbiItem[], AVL_ADDRESS);
    const nfts = await this.getAllNFTs();
    const tokenURIs = await Promise.all(
      nfts.map(
        tokenId => (avalonToken.methods.tokenURI(tokenId).call() as Promise<string>)
          .then(uri => fetch(this.ipfsToHttps(uri)))
          .then(data => data.json())));
    return tokenURIs.map((e, i) => { return { tokenId: nfts[i], imageUrl: this.ipfsToHttps(e.image) } });
  }
}
