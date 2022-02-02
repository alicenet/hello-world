import { combineReducers } from 'redux';
import applicationReducer from './application';

export default combineReducers({
    app: applicationReducer,
})