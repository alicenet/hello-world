import React from 'react';
import ReactDOM from 'react-dom';
// App Entry
import App from './App';
// Style
import 'semantic-ui-css/semantic.min.css'
import './style/index.css';

/* Redux Store */
import store from "redux/store/store.js";
import { Provider } from "react-redux";

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);