import MadWallet from 'madnetjs';
import store from 'redux/store/store';
import { ADAPTER_ACTION_TYPES } from 'redux/constants';

export const initialConfigurationState = {
    ethereum_provider: process.env.REACT_APP__ETHEREUM_PROVIDER, // Ethereum RPC endpoint
    mad_net_chainID: process.env.REACT_APP__MAD_NET_CHAINID, // Chain ID to use on MadNet
    mad_net_provider: process.env.REACT_APP__MAD_NET_PROVIDER, // MadNet API endpoint
    registry_contract_address: process.env.REACT_APP__REGISTRY_CONTRACT_ADDRESS, // Contract address for Registry Contract
    advanced_settings: false,
}

let madWallet = new MadWallet();

class MadNetAdapter {

    constructor() {
        
        this.wallet = () => madWallet; // Get latest madWallet for any actions needing it.
        this.provider = () => initialConfigurationState.mad_net_provider;
        this.chainID = () => initialConfigurationState.mad_net_chainID;

        this.subscribed = false;
        this.isInitializing = false; // Is the instance currently initializing? -- Used to prevent repeat initializations

        this.lastNotedConfig = {
            mad_net_chainID: false,
            mad_net_provider: false,
        }

        // Error cache -- Cache first errors so that on retries the correct error is relayed to the user
        this.errors = {};

        this.connected = this._handleReduxStateValue(["connected"]);
        this.failed = this._handleReduxStateValue(["error"]);
        this.MaxDataStoreSize = 2097152;
        this.BaseDatasizeConst = 376;

        // Transaction panel
        this.txOuts = this._handleReduxStateValue(["transactions", "txOuts"]);
        this.changeAddress = this._handleReduxStateValue(["transactions", "changeAddress"]);
        this.pendingTx = this._handleReduxStateValue(["transactions", "pendingTx"]);
        this.pendingTxStatus = this._handleReduxStateValue(["transactions", "pendingTxStatus"]);
        this.pendingLocked = this._handleReduxStateValue(["transactions", "pendingLocked"]);

        // Block explorer panel
        this.blocks = this._handleReduxStateValue(["blocks", "list"]);
        this.blockStatus = this._handleReduxStateValue(["blocks", "status"]);
        this.blocksMaxLen = 10
        this.blocksStarted = this._handleReduxStateValue(["blocks", "started"]);
        this.currentBlock = this._handleReduxStateValue(["blocks", "current"]);
        this.blocksLocked = this._handleReduxStateValue(["blocks", "locked"]);
        this.blocksIdTimeout = false;
        this.mbAttempts = 0;

        // Tx explorer panel
        this.transactionHash = this._handleReduxStateValue(["txExplore", "txHash"]);
        this.transaction = this._handleReduxStateValue(["txExplore", "tx"]);
        this.transactionHeight = this._handleReduxStateValue(["txExplore", "txHeight"]);

        // DataStore explorer panel
        this.dsRedirected = this._handleReduxStateValue(["dataExplore", "redirected"]);
        // Set default searchOpts
        this.dsSearchOpts = this._handleReduxStateValue(["dataExplore", "searchOpts"]);
        this.dsSearchOpts.set({ "address": "", "offset": "", "bnCurve": false });
        // Set default dataStores
        this.dsDataStores = this._handleReduxStateValue(["dataExplore", "dataStores"]);
        this.dsDataStores.set([]);
        // Set default activePage
        this.dsActivePage = this._handleReduxStateValue(["dataExplore", "activePage"]);
        this.dsActivePage.set([]);
        // Set default dsView
        this.dsView = this._handleReduxStateValue(["dataExplore", "dsView"]);
        this.dsView.set([]);

        // Set fees 
        this.fees = this._handleReduxStateValue(["fees"]);
        this.fees.set({});

    }

    getMadNetWalletInstance() {
        return this.wallet();
    }

    _updateLastNotedConfig(mad_net_chainID = this.chainID(), mad_net_provider = this.provider()) {
        this.lastNotedConfig = {
            mad_net_chainID: mad_net_chainID,
            mad_net_provider: mad_net_provider,
        }
    }

    /**
     * Initiate the madNet Adapter and verify a connection is possible
     */
    async __init(config = {}) {
        try {
            this._updateLastNotedConfig();
            await this.wallet().Rpc.setProvider(this.provider())
            this.connected.set(true);
            this.failed.set(false);
            // Attempt to get fees -- RPC will throw if unfetchable
            let fees = await this.wallet().Rpc.getFees();
            // Re-assign to internal camelCase keys
            this.fees.set({
                atomicSwapFee: fees.AtomicSwapFee,
                dataStoreFee: fees.DataStoreFee,
                minTxFee: fees.MinTxFee,
                valueStoreFee: fees.ValueStoreFee
            });
            return { success: true }
        } catch (ex) {
            this.failed.set(ex.message);
            return ({ error: ex })
        }
    }

    /**
     * Return a getter/setter for a specific redux state value keyChain -- Object depth of max 3 supported
     * @prop {Array} keyChain - An array of nested keys to access the desired value
     * */
    _handleReduxStateValue(keyChain) {
        let depth = keyChain.length;
        let getter = () => {
            let state = store.getState().adapter.madNetAdapter;
            if (depth === 1) {
                return state[keyChain[0]]
            }
            else if (depth === 2) {
                return state[keyChain[0]][keyChain[1]]
            }
            else if (depth === 3) {
                return state[keyChain[0]][keyChain[1]][keyChain[2]]
            }
        };
        let setter = (value) => {
            store.dispatch({
                type: ADAPTER_ACTION_TYPES.SET_MADNET_KEYCHAIN_VALUE, payload: {
                    keyChain: keyChain, value: value
                }
            })
        };
        return { get: getter, set: setter };
    }


}

const madNetAdapter = new MadNetAdapter();

export default madNetAdapter;