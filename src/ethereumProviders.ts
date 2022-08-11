import { SafeEventEmitterProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const YOUR_INFURA_ID = "f392fa8f8e5448b690169441ea7d43e6";

export default class EthereumProvider {
    private ethereumPrivateKeyProvider: EthereumPrivateKeyProvider;
    private privKey: string;
    /*
    privKey: any secp512k1 private key.
    */
    constructor(privKey: string) {
        this.ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
            config: {
                chainConfig: {
                    chainId: "0x4",
                    rpcTarget: `https://rinkeby.infura.io/v3/${YOUR_INFURA_ID}`,
                    displayName: "rinkeby",
                    blockExplorer: "https://rinkeby.etherscan.io/",
                    ticker: "ETH",
                    tickerName: "Ethereum",
                },
            },
        });

        this.privKey = privKey;
    }

    async connect(): Promise<SafeEventEmitterProvider | null> {
        await this.ethereumPrivateKeyProvider.setupProvider(this.privKey);
        /*
        pass user's private key here.
        after calling setupProvider, we can use
        this.ethereumPrivateKeyProvider._providerProxy as a eip1193 provider
        */
        return this.ethereumPrivateKeyProvider.provider;
    };
}