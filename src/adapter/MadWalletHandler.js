
/**
 * Used to instance state based on docusaurus config that is't availal outside of the component tree
 */
class MadNetWalletHandler {

    constructor() {
        this.wallet;
    }

    init(siteConfig) {
        this.wallet = new MadWallet(false, siteConfig.customFields.REACT_APP_MADNET_RPC_ENDPOINT);
    }

    getWallet() {
        return this.wallet;
    }

}

let madNetWalletHandler = new MadNetWalletHandler();
export default madNetWalletHandler;