import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Lander, PageWrap, HeaderMenu, Footer } from 'components';

/**
 * Root application entry component.
 * @component
 * @example
 * ReactDOM.render( <App />, document.getElementById('roo
') );
 */
function App() {

    return (
        <Router>

            <HeaderMenu />

            <PageWrap>

                <Routes>

                    <Route path="/" element={<Lander />} />

                </Routes>

            </PageWrap>

            <Footer />

        </Router>
    );
}

export default App;
