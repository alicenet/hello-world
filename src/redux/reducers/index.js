import { combineReducers } from 'redux';
import applicationReducer from './application';
import adapterReducer from './adapter';
import walletReducer from './wallet';

export default combineReducers({
    app: applicationReducer,
    adapter: adapterReducer,
    wallet: walletReducer,
})