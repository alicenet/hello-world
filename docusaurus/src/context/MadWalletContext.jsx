import React from 'react';

const defaultState = {
    connected: false,
    busy: false,
    error: false,
    config: {
        mad_net_chainID: false, // Not needed
        mad_net_provider: "", // Testnet from env
    },
    transactions: {
        txOuts: [],
        changeAddress: { "address": "", "bnCurve": false },
        pendingTx: "",
        pendingTxStatus: false,
        pendingLocked: false,
    },
    blocks: {
        list: [],
        status: "",
        started: false,
        current: "",
        locked: false,
    },
    txExplore: {
        txHash: "",
        tx: false,
        txHeight: 0,
    },
    dataExplore: {
        redirected: false,
        searchOpts: false,
        dataStores: [],
        activePage: [],
        dsView: []
    },
    fees: {},
}

export const MadContext = React.createContext(defaultState);

/**
 * Provide MadAdapter context where needed
 */
export function MadProvider({ children }) {

    const [state, setState] = React.useState(defaultState);

    return (
        <MadContext.Provider value={{ state: state, setState: setState }}>
            {children}
        </MadContext.Provider>
    )

}
