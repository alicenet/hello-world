import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Lander, Wallet, Transactions, PageWrap, HeaderMenu, Footer } from 'components';
import { useDispatch } from 'react-redux';
import { ADAPTER_ACTIONS } from 'redux/actions';

/**
 * Root application entry component.
 * @component
 * @example
 * ReactDOM.render( <App />, document.getElementById('root') );
 */
function App() {
    
    const dispatch = useDispatch();

    dispatch(ADAPTER_ACTIONS.initMadNet());

    return (
        <Router>

            <HeaderMenu />

            <PageWrap>

                <Routes>

                    <Route path="/" element={<Lander />} />

                    <Route path="/wallet" element={<Wallet />} />

                    <Route path="/transactions" element={<Transactions />} />

                </Routes>

            </PageWrap>

            <Footer />

        </Router>
    );
}

export default App;
