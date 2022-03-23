import MadWallet from 'madnetjs';
import { defaultState } from '../context/MadWalletContext';

//TODO add to env because no CRA
const REACT_APP__ETHEREUM_PROVIDER="http://catmad.duckdns.org:20001/"
const REACT_APP__MAD_NET_PROVIDER="http://catmad.duckdns.org:20000/v1/"
const REACT_APP__REGISTRY_CONTRACT_ADDRESS="0x0b1f9c2b7bed6db83295c7b5158e3806d67ec"

const SECP256K1 = 1;
const VALUE_STORE = 2;
const DATA_STORE = 1;

export const initialConfigurationState = {
    ethereum_provider: REACT_APP__ETHEREUM_PROVIDER, // Ethereum RPC endpoint
    mad_net_provider: REACT_APP__MAD_NET_PROVIDER, // MadNet API endpoint
    registry_contract_address: REACT_APP__REGISTRY_CONTRACT_ADDRESS, // Contract address for Registry Contract
    advanced_settings: false,
}

let madWallet = new MadWallet(false, initialConfigurationState.mad_net_provider);

class MadNetAdapter {

    constructor() {
        
        this.wallet = () => madWallet; // Get latest madWallet for any actions needing it.
        this.provider = initialConfigurationState.mad_net_provider;
        
        this.context = null;

        this.connected = this._handleContextValue(["connected"]);
        this.failed = this._handleContextValue(["error"]);
        this.MaxDataStoreSize = 2097152;
        this.BaseDatasizeConst = 376;

        // Transaction panel
        this.txOuts = this._handleContextValue(["transactions", "txOuts"]);
        this.changeAddress = this._handleContextValue(["transactions", "changeAddress"]);
        this.pendingTx = this._handleContextValue(["transactions", "pendingTx"]);
        this.pendingTxStatus = this._handleContextValue(["transactions", "pendingTxStatus"]);
        this.pendingLocked = this._handleContextValue(["transactions", "pendingLocked"]);

        // Block explorer panel
        this.blocks = this._handleContextValue(["blocks", "list"]);
        this.blockStatus = this._handleContextValue(["blocks", "status"]);
        this.blocksStarted = this._handleContextValue(["blocks", "started"]);
        this.currentBlock = this._handleContextValue(["blocks", "current"]);
        this.blocksLocked = this._handleContextValue(["blocks", "locked"]);
        this.blocksMaxLen = 10
        this.blocksIdTimeout = false;
        this.mbAttempts = 0;

        // Tx explorer panel
        this.transactionHash = this._handleContextValue(["txExplore", "txHash"]);
        this.transaction = this._handleContextValue(["txExplore", "tx"]);
        this.transactionHeight = this._handleContextValue(["txExplore", "txHeight"]);

        // DataStore explorer panel
        this.dsRedirected = this._handleContextValue(["dataExplore", "redirected"]);
        // Set default searchOpts
        this.dsSearchOpts = this._handleContextValue(["dataExplore", "searchOpts"]);
        this.dsSearchOpts.set({ "address": "", "offset": "", "bnCurve": false });
        // Set default dataStores
        this.dsDataStores = this._handleContextValue(["dataExplore", "dataStores"]);
        this.dsDataStores.set([]);
        // Set default activePage
        this.dsActivePage = this._handleContextValue(["dataExplore", "activePage"]);
        this.dsActivePage.set([]);
        // Set default dsView
        this.dsView = this._handleContextValue(["dataExplore", "dsView"]);
        this.dsView.set([]);

        // Set fees 
        this.fees = this._handleContextValue(["fees"]);
        this.fees.set({});

        this.errors = {};

        this.__init();

    }

    /**
     * Updates the current state handlers with a new context reference
     */
    updateContext(reactMadNetContext) {
        this.context = reactMadNetContext;
    }

    getMadNetWalletInstance() {
        return this.wallet();
    }

    /**
     * Initiate the madNet Adapter and verify a connection is possible
     */
    async __init(config = {}) {
        try {
            await this.wallet().Rpc.setProvider(this.provider)
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
            console.error(ex);
            return ({ error: ex })
        }
    }

    /**
     * Returns mad wallet balance and utxoids for respective address and curve
     * @param address - Wallet address to look up the balance for
     * @param curve - Address curve to use
     */
    async _getMadNetWalletBalanceAndUTXOs(address) {
        let madWallet = this.wallet();
        try {
            let [utxoids, balance] = await madWallet.Rpc.getValueStoreUTXOIDs(address, SECP256K1);
            balance = String(parseInt(balance, 16));
            return [balance, utxoids];
        } catch (ex) {
            return [{ error: ex }, null]
        }
    }

    async createAndsendTx(tx) {
        if(!tx) return

        await this.wallet().Transaction.createTxFee(tx.from, SECP256K1);

        if(tx.type === VALUE_STORE) {
            await this.wallet().Transaction.createValueStore(tx.from, tx.value, tx.to, SECP256K1);
        } else if (tx.type === DATA_STORE) {
            await this.wallet().Transaction.createDataStore(tx.from, tx.key, tx.duration, tx.value);
        }
        await this.sendTx();
    }

    async sendTx() {
        try {
            
            const pendingTransaction = await this.wallet().Transaction.sendTx();
            await this.wallet().Transaction._reset();

            return await this.monitorPending(pendingTransaction);
        } catch(exception) {
            await this.sleep(2000);
            this.sendTx();
        }
        
    }

    // Monitor the pending transaction the was sent
    async monitorPending(tx) {
        try {
            let txDetails = await this.wallet().Rpc.getMinedTransaction(tx);
            // Success TX Mine
            return { "txDetails": txDetails.Tx, "txHash": tx, "msg": "Mined: " + this.trimTxHash(tx) };
        } catch (ex) {
            console.log(ex)
            await this.sleep(2000);
            this.monitorPending(tx);
        }
    }

    trimTxHash(txHash) {
        try {
            return "0x" + txHash.substring(0, 6) + "..." + txHash.substring(txHash.length - 6);
        } catch (ex) {
            throw String(ex);
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Return a getter/setter for a specific state value keyChain -- Object depth of max 3 supported
     * @prop {Array} keyChain - An array of nested keys to access the desired value
     * */
    _handleContextValue(keyChain) {
        let depth = keyChain.length;
        let getter = () => {
            let state = this.context ? this.context.state : defaultState;
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
        let setter = this.context ? (value) => {
            let setState = this.context.setState;
            if (depth === 1) {
                setState(state => ({
                    ...state, [keyChain[0]]: value,
                }));
            }
            else if (depth === 2) {
                setState(state => ({
                    ...state,
                    [keyChain[0]]: {...state[keyChain[0]]},
                    [keyChain[0][keyChain[1]]]: value,
                }));
            }
        } : () => {
            console.warn("No context, no setter for ", keyChain)
        }; // If no context exists, don't provide setters
        return { get: getter, set: setter };
    }
}

let madNetAdapter = new MadNetAdapter();

/**
 * Get and update the global madNetAdapter with the corresponding context state before returning it for use
 * @param {*} context 
 * @returns 
 */
export const useMadNetAdapter = (context) => {
    madNetAdapter.updateContext(context);
    return madNetAdapter;
}

export default madNetAdapter;