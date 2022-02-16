import { ADAPTER_ACTION_TYPES } from 'redux/constants';

//  Any user editable and savable configurations are loaded here
export const initialAdapterState = {
    madNetAdapter: {
        connected: false,
        busy: false,
        error: false,
        transactions: {
            txOuts: [],
            pendingtx: false,
            pendingLocked: false,
            changeAddress: { "address": "", "bnCurve": false },
        },
        blocks: {
            list: [],
            started: false,
            locked: false,
            id: false,
            mbAttempts: false,
        },
        fees: {},
    }
}

/* Modal Reducer */
export default function adapterReducer(state = initialAdapterState, action) {

    switch (action.type) {

        case ADAPTER_ACTION_TYPES.SET_MADNET_CONNECTED:
            return Object.assign({}, state, {
                madNetAdapter: { ...state.madNetAdapter, connected: action.payload }
            });

        case ADAPTER_ACTION_TYPES.SET_MADNET_ERROR:
            return Object.assign({}, state, {
                madNetAdapter: { ...state.madNetAdapter, error: action.payload }
            });

        // On disconnect set initial adapter state
        case ADAPTER_ACTION_TYPES.SET_DISCONNECTED:
            return Object.assign({}, initialAdapterState);

        case ADAPTER_ACTION_TYPES.SET_MADNET_BUSY:
            return Object.assign({}, state, {
                madNetAdapter: { ...state.madNetAdapter, busy: action.payload }
            });

        /**
         * A payload dependant state setter action for the madNetAdapter state 
         * --  Supports upto object depth of 3
         * Requires payload.keyChain and payload.value
         */
        case ADAPTER_ACTION_TYPES.SET_MADNET_KEYCHAIN_VALUE:
            let keyDepth = action.payload.keyChain.length;
            let keyTargets = action.payload.keyChain;
            let newAdapterState = { ...state.madNetAdapter };
            if (keyDepth === 1) {
                newAdapterState[keyTargets[0]] = action.payload.value;
            } else if (keyDepth === 2) {
                // Create none existent object if needed
                if (!newAdapterState[keyTargets[0]]) {
                    newAdapterState[keyTargets[0]] = {};
                }
                newAdapterState[keyTargets[0]][keyTargets[1]] = action.payload.value;
            } else if (keyDepth === 3) {
                newAdapterState[keyTargets[0]][keyTargets[1]][keyTargets[2]] = action.payload.value;
            } else { // Fallback to prev state
                console.log("Falling back to previous state during SET_MADNET_KEYCHAIN_VALUE, verify keyChain accessors and value set on payload correctly.")
                newAdapterState = { ...state.madNetAdapter }
            }
            return Object.assign({}, state, {
                madNetAdapter: newAdapterState,
            });

        default:
            return state;

    }

}