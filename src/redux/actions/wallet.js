import { WALLET_ACTION_TYPES } from "redux/constants";

/**
 * Set the current state for debugMode
 * @param { String } wallet - Public address for the added wallet
 * @returns { Function } - Redux-Thunk function to call within dispatch
 */
 export const addWallet = wallet => {
    return dispatch => {
        dispatch({ type: WALLET_ACTION_TYPES.ADD_WALLET, payload: wallet })
    }
}

/**
 * Set the current state for debugMode
 * @param { String } wallet - Public address for the added wallet
 * @returns { Function } - Redux-Thunk function to call within dispatch
 */
export const removeWallet = wallet => {
    return dispatch => {
        dispatch({ type: WALLET_ACTION_TYPES.REMOVE_WALLET, payload: wallet })
    }
}
