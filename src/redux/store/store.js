/** @module rdux_store */

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from 'redux/reducers';

/** The middleware application of redux-thunk */
const middleware = applyMiddleware(thunk);

/**
 * The redux store applied with thunk-middleware
 */
const store = createStore(rootReducer, composeWithDevTools(middleware));

export default store;