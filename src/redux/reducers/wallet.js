import { WALLET_ACTION_TYPES } from "redux/constants";

const initialWalletState = {
    wallets: [],
};

export default function walletReducer(state = initialWalletState, action) {

    switch (action.type) {

        case WALLET_ACTION_TYPES.ADD_WALLET:
            return Object.assign({}, state, {
                wallets: [ ...state.wallets, action.payload ] 
            });

        case WALLET_ACTION_TYPES.REMOVE_WALLET:
            return Object.assign({}, state, {
                wallets: state.wallets.filter(w => w !== action.payload)
            });

        default:
            return state;

    }

}