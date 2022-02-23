import { TRANSACTION_ACTION_TYPES } from 'redux/constants';
import { ADAPTER_ACTIONS } from 'redux/actions';
import utils from 'utils';

/**
 * Adds a data/value store -- Additionally dispatches parse for default fee payer request
 * @param { Object } transaction - A data/value store
 * @returns null
 */
export function addStore(transaction) {
    return async function (dispatch) {
        dispatch({ type: TRANSACTION_ACTION_TYPES.ADD_TO_LIST, payload: transaction });
        dispatch(parseDefaultFeePayer());
        dispatch(parseAndUpdateFees());
    }
}

/**
 * Edits a data/value store -- Additionally dispatches parse for default fee payer request
 * @param { Object } transaction - A data/value store
 * @returns null
 */
export function editStore(transaction) {
    return async function (dispatch) {
        dispatch({ type: TRANSACTION_ACTION_TYPES.UPDATE_FROM_LIST, payload: transaction });
        dispatch(parseDefaultFeePayer());
    }
}

/**
 * Removes an item from the list
 * @param { int } index - Index of the element
 * @returns null
 */
export function removeItem(index) {
    return async function (dispatch) {
        dispatch({ type: TRANSACTION_ACTION_TYPES.REMOVE_FROM_LIST, payload: index });
        dispatch(parseAndUpdateFees());
    }
}

/**
 * Parses txList and sets the default fee payer to position 0 of the list if it exists unless over_ride is set 
 * -- Generally called after changes to the transaction list have been made.
 */
export function parseDefaultFeePayer() {
    return async function (dispatch, getState) {
        
        const state = getState();
        const transactionList = state.transaction.list;
        const over_ride = state.transaction.feePayer.over_ride;
        
        // If the over_ride is set ( Manual Fee Payer Wallet Has Been Selected ), do not update through the parseDefaultFeePayer
        if (over_ride) { return }
        // Don't update the default if none exist
        if (transactionList.length === 0) {
            //  Called without a populated transaction list in the transaction reducer. This shouldn't happen!
            return
        }
        
        // Else, update to the first entry position 
        const wallets = state.wallet.wallets;
        const firstEntry = transactionList[0];
        
        // Grab the wallet to set as the fee payer and dispatch it -- This should always exist and is failsafed by the above length constraint on transactionList
        const walletToSet = wallets.filter(wallet => wallet === firstEntry.from)?.[0];
        
        dispatch(setFeePayer(walletToSet));
    }
}

/**
 * Set the wallet object of the fee payer
 * @param { Object } wallet - Redux wallet state object
 * @param { Boolean } userOverride - Sets the override flag so that parseDefaultFeePayer() does not update the fee when called
 */
export function setFeePayer(wallet, over_ride = false) {
    return async function (dispatch) {
        dispatch({ type: TRANSACTION_ACTION_TYPES.SET_FEE_PAYER, payload: { wallet: wallet, over_ride: over_ride } });
    }
}

/**
 * Parse and update any passed fees to human readable state in the reducer -- Additionally calculates any fee changes when called
 * -- Should be called when making adjustments to transaction.list or priotization fee changes
 * @param { Object } rpcFees 
 * @property { BigIntHexString } rpcFees.atomicSwapFee - Atomic Swap fee from RPC.getFees()
 * @property { BigIntHexString } rpcFees.dataStoreFee - Data Store Fee from RPC.getFees()
 * @property { BigIntHexString } rpcFees.valueStoreFee - Value Store Fee from RPC.getFees()
 * @property { BigIntHexString } rpcFees.minTxFee - Min TX Fee from RPC.getFees()
 * @property { Integer } rpcFees.prioritizationFee - Prioritization fee to use if any -- Will use existing state if available for calculation
 */
export function parseAndUpdateFees(rpcFees) {
    return async function (dispatch, getState) {

        const state = getState();

        const madNetFees = rpcFees ? rpcFees : state.adapter.madNetAdapter.fees;
        const txList = state.transaction.list;

        // Convert RPC Fees to human-readable format for transaction reducer state
        Object.keys(madNetFees).forEach(key => {
            madNetFees[key] = parseInt(madNetFees[key], 16);
        })

        // Build fees from passed parameters or available state
        let fees = {
            atomicSwapFee: madNetFees.atomicSwapFee, // Hex Parsed Base Atomic Swap Fee from RPC.getFees()
            atomicSwapFees: 0, // Total Fees for all atomicSwap VOUTs in txList
            dataStoreFee: madNetFees.dataStoreFee, // Hex Parsed Base DataStore fee from RPC.getFees()
            dataStoreFees: 0, // Total Fees for all dataStore VOUTs in txList
            depositFees: 0, // Any fees surrounding deposits for data stores
            valueStoreFee: madNetFees.valueStoreFee, // Hex Parsed Base ValueStore from RPC.getFees()
            valueStoreFees: 0, // Total Fees for all valueStore VOUTs in txList
            minTxFee: madNetFees.minTxFee, // Parsed minimum tx fee
            prioritizationFee: state.transaction.fees.prioritizationFee, // Any additional priortization fee set by the user
            txFee: 0, // Prioritization + Minimum Fee
            totalFee: 0, // Total TX Fee ( All Store Fees + Min Fee + Prioritization )
            errors: [] // Errors in fee estimation
        }

        // Get estimate fees from madWalletFakeTx -- These fees resemble the fees per store and not deposit fees on DataStores
        // We can get the store fee per idx in the iteration below
        let estimateFees = await dispatch(ADAPTER_ACTIONS.createAndClearFakeTxForFeeEstimates());

        // If estimation has errors, parse them and set to state for UI digestion
        if (estimateFees.errors) {
            let feeErrors = estimateFees.errors;
            for (let i=0; i < feeErrors.length ; i++) {
                let error = feeErrors[i].error;
                if (error.msg === "Insufficient Funds") {
                    fees.errors.push(`${error.details.account.address} has insufficient funds`);
                }
            }
        }

        // If the txList > 0, we need to calculate any special/specific fees such as datastore deposit cost
        // Per store/vout fee will be called at the end
        let txTypesByIdx = []; // Note types by IDX for base fee calc below

        if (txList.length > 0) {
            // Add a fee for each instance of the respective tx type to the total type fees
            for (let i = 0; i < txList.length; i++) {
                let tx = txList[i];
                txTypesByIdx.push(tx.type);
            }
        }
        // Get base store fees if estimateFees was successful 
        // -- If not still allow RPC fees to be set to state
        if (!!estimateFees && !estimateFees.error) {
            for (let i = 0; i < estimateFees.costByVoutIdx.length; i++) {
                let fee = estimateFees.costByVoutIdx[i];
                let type = txTypesByIdx[i];
                // If Undefined it is most likely a valuestore added by the wallet to balance ins/outs for change or data store rewards

                switch (type) {
                    case utils.transaction.transactionTypes.DATA_STORE: fees.dataStoreFees += parseInt(fee); break;
                    case utils.transaction.transactionTypes.VALUE_STORE: fees.valueStoreFees += parseInt(fee); break;
                    case utils.transaction.transactionTypes.ATOMIC_SWAP_STORE: fees.atomicSwapFees += parseInt(fee); break;
                    // If Undefined it is most likely a valuestore added by the wallet to balance ins/outs for change or data store rewards
                    default: fees.valueStoreFees += parseInt(fee); break;
                }
            }
        }

        fees.txFee = fees.minTxFee + fees.prioritizationFee;
        fees.totalFee = fees.txFee + fees.valueStoreFees + fees.dataStoreFees + fees.atomicSwapFees;

        dispatch({ type: TRANSACTION_ACTION_TYPES.UPDATE_FEES_BY_TYPE, payload: fees })

    }

}

export function setLastSentAndMinedTx(tx) {
    return async function (dispatch) {
        dispatch({ type: TRANSACTION_ACTION_TYPES.SET_LAST_SENT_MINED_TX, payload: tx });
    }
}

/**
 * Clears the Fee Payer -- Generally called post tx send
 * @returns 
 */
export function clearFeePayer() {
    return async function (dispatch) {
        dispatch({ type: TRANSACTION_ACTION_TYPES.CLEAR_FEE_PAYER });
    }
}


export function resetFeeState() {
    return async function (dispatch, getState) {
        const state = getState();
        const madNetFees = state.adapter.madNetAdapter.fees;
        // Reset FEE state to existing fee state
        let fees = {
            atomicSwapFee: madNetFees.atomicSwapFee, // Hex Parsed Base Atomic Swap Fee from RPC.getFees()
            atomicSwapFees: 0, // Total Fees for all atomicSwap VOUTs in txList
            dataStoreFee: madNetFees.dataStoreFee, // Hex Parsed Base DataStore fee from RPC.getFees()
            dataStoreFees: 0, // Total Fees for all dataStore VOUTs in txList
            depositFees: 0, // Any fees surrounding deposits for data stores
            valueStoreFee: madNetFees.valueStoreFee, // Hex Parsed Base ValueStore from RPC.getFees()
            valueStoreFees: 0, // Total Fees for all valueStore VOUTs in txList
            minTxFee: madNetFees.minTxFee, // Parsed minimum tx fee
            prioritizationFee: 0, // Any additional priortization fee set by the user
            txFee: 0, // Prioritization + Minimum Fee
            totalFee: 0, // Total TX Fee ( All Store Fees + Min Fee + Prioritization )
        }
        fees.txFee = fees.minTxFee + fees.prioritizationFee;
        dispatch({ type: TRANSACTION_ACTION_TYPES.UPDATE_FEES_BY_TYPE, payload: fees })
    }
}
