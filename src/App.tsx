import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import {
  CHAIN_NAMESPACES,
  ADAPTER_EVENTS,
  CONNECTED_EVENT_DATA,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import RPC from "./evm";
import Contract from "./contract";
import EthereumWallet from "./ethereumProviders";
import "./App.css";

const clientId =
  "BJS4ZaruUuCQ0DaXpQSYgX9upCp3DzgBBD5V7E1n2ufGqE8yzf26wg0AjhRZ3qW0we3j_P6XVtBYKVxcDERkeoM"; // get from https://dashboard.web3auth.io

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          uiConfig: {
            appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
            theme: "dark",
            loginMethodsOrder: ["github", "facebook", "google"],
          },
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x4",
            rpcTarget:
              "https://rinkeby.infura.io/v3/f392fa8f8e5448b690169441ea7d43e6", // This is the testnetwork RPC we have added
          },
          authMode: "WALLET",
          enableLogging: true,
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();

        web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
          console.log("Yeah!, you are successfully logged in", data);
        });
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const loginByEthereumPrivkey = async () => {
    const pK = (await privKey()) as string;
    const ethereum = new EthereumWallet(pK);
    const ethereumProvider = await ethereum.connect();
    setProvider(ethereumProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const signTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signTransaction();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signAndSendTransaction();
    uiConsole(result);
  };

  const exportPrivkey = async () => {
    uiConsole(await privKey());
  };

  const privKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return "";
    }
    const privateKey = await provider.request({ method: "eth_private_key" });
    return privateKey;
  };

  const getOwnerOfToken = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const contract = new Contract(provider);
    const owner = await contract.ownerOf();
    uiConsole(owner);
  };

  const retrieveTokenImage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const contract = new Contract(provider);
    const tokenUri = await contract.tokenURI();
    uiConsole(tokenUri);
  };

  const getNumberOfNFTs = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const contract = new Contract(provider);
    const numberOfNFTs = await contract.balanceOf();
    uiConsole(numberOfNFTs);
  };

  const getAllNFTs = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const contract = new Contract(provider);
    const nfts = await contract.getAllNFTs();
    uiConsole(nfts);
  };

  const getFullNFTs = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const contract = new Contract(provider);
    const nfts = await contract.getFullNFTs();
    uiConsole(nfts);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      <button onClick={signMessage} className="card">
        Sign Message
      </button>
      <button onClick={signTransaction} className="card">
        Sign Transaction
      </button>

      <button onClick={exportPrivkey} className="card">
        Export Private Key
      </button>

      <button onClick={getOwnerOfToken} className="card">
        Get Owner of The First Token
      </button>

      <button onClick={retrieveTokenImage} className="card">
        Get the token image
      </button>
      <button onClick={getNumberOfNFTs} className="card">
        Get the number of NFTs
      </button>
      <button onClick={getAllNFTs} className="card">
        Get all NFTs
      </button>
      <button onClick={getFullNFTs} className="card">
        Get Full NFTs with imageUrl
      </button>
      <button onClick={loginByEthereumPrivkey} className="card">
        login by etheurem private key
      </button>

      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth
        </a>
        & ReactJS Example
      </h1>

      <div className="grid">{provider ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/Web3Auth/tree/master/examples/react-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
