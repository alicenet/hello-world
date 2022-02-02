/** @module rdux_application_reducer */

import { APPLICATION_ACTION_TYPES } from "redux/constants";

const initialApplicationState = {
    debugMode: false,
};

export default function applicationReducer(state = initialApplicationState, action) {
    switch (action.type) {

        case APPLICATION_ACTION_TYPES.SET_DEBUG_MODE:
            return Object.assign({}, state, {
                debugMode: action.payload
            });

        default:
            return state;

    }
};