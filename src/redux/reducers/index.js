import { combineReducers } from 'redux';
import applicationReducer from './application';
import adapterReducer from './adapters';

export default combineReducers({
    app: applicationReducer,
    adapter: adapterReducer,
})