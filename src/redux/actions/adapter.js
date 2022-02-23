import madNetAdapter from 'adapters/madAdapter';
import utils from 'utils';
import { TRANSACTION_ACTIONS } from 'redux/actions';
import { TRANSACTION_ACTION_TYPES } from 'redux/constants';

const SECP256K1 = 1;

/**
 * If madNetAdapter is not in a connected state attempt to connect
 * @param { Object } initConfig - Init config passthrough for the madNetAdapter __init function
 * @returns
 */
export const initMadNet = (initConfig) => {
    return async (dispatch, getState) => {
        let connected = await madNetAdapter.__init(initConfig);
        if (connected.error) {
            return { error: connected.error };
        }
        return true;
    }
}


/**
 * Prep TX Objects into MadNetAdapter state -- Requires a forwarded dispatch state
 * @param { Object } state - Forwarded dispatch -- getState() state
 */
const _prepTxObjectsToMadNetAdapter = async (state) => {

    let txReducerTxs = state.transaction.list;
    let preppedTxObjs = []; // Convert to proper tx format for madNetAdapter

    txReducerTxs.forEach((tx) => {
        if (tx.type === utils.transaction.transactionTypes.DATA_STORE) {
            preppedTxObjs.push(
                utils.transaction.createDataStoreObject(tx.from, tx.key, tx.value, tx.duration)
            );
        }
        else if (tx.type === utils.transaction.transactionTypes.VALUE_STORE) {
            preppedTxObjs.push(
                utils.transaction.createValueStoreObject(tx.from, tx.to, tx.value, tx.bnCurve)
            );
        }
        else {
            throw new Error("sendTransactionReducerTXs received incorrect txType of type: ", tx.type);
        }
    });

    // Add each tx to the txOutList of the madNetAdapter
    preppedTxObjs.forEach(tx => {
        madNetAdapter.addTxOut(tx);
    });

    return true;
}

/**
 * Creates a fake TX using madWallet instance, estimates fees, and immediately clears it for the next estimate or real transaction
 * @returns { Object || Boolean } - Successful fee estimate will return an object with fees or false for any failure in estimation
 */
export const createAndClearFakeTxForFeeEstimates = () => {
    return async (dispatch, getState) => {

        
        const state = getState();

        // If feePayer doesn't exist or no TXs, we are not in a state to estimate fees yet
        if (!state.transaction.feePayer.wallet || state.transaction.list.length === 0) {
            return false;
        }
        
        await _prepTxObjectsToMadNetAdapter(state);
        
        // Create the fee input
        let feePayerWallet = state.transaction.feePayer.wallet;
        let txFee = state.transaction.fees.txFee;

        await madNetAdapter.wallet().Transaction.createTxFee(feePayerWallet, SECP256K1, txFee);
        
        await madNetAdapter.createTx();
        let estimateFees = await madNetAdapter.getEstimatedFees();
        
        // After fees have been estimated clear the tx state from the adapter and the wallet
        await madNetAdapter.wallet().Transaction._reset();
        madNetAdapter.clearTXouts();
        
        return estimateFees;
    }
}

/**
 * Aggregate the TXs from the transaction reduce into the madNetAdapter state and send the grouped tx
 */
export const sendTransactionReducerTXs = () => {
    return async (dispatch, getState) => {

        const state = getState();
        await _prepTxObjectsToMadNetAdapter(state);

        // Create the fee input
        let feePayerWallet = state.transaction.feePayer.wallet;
        let txFee = state.transaction.fees.txFee;

        await madNetAdapter.wallet().Transaction.createTxFee(feePayerWallet, SECP256K1, txFee);

        // First create the transaction
        let create = await madNetAdapter.createTx();
        if (create.error) {
            return { error: "Unable to create transaction: " + String(create.error) }
        }
        // If OK, send it
        let tx = await madNetAdapter.sendTx();

        // Set latest tx to lastSentAndMinedTx in transaction reducer
        dispatch(TRANSACTION_ACTIONS.setLastSentAndMinedTx(tx));
        // Reset last received lastSentTxHash for next cycle
        dispatch({ type: TRANSACTION_ACTION_TYPES.SET_LAST_SENT_TX_HASH, payload: "" });
        // Reset TxFeePayer for next cycles
        dispatch(TRANSACTION_ACTIONS.clearFeePayer());
        // Remove any user input or store fees from fee state
        dispatch(TRANSACTION_ACTIONS.resetFeeState());

        return tx;
    }
}

