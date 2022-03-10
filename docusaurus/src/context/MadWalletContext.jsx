import React from 'react';

export const defaultState = {
    connected: false,
    busy: false,
    error: false,
    accounts: [],
    tokenBalances: {}, // K:V where K is address and v is tokenBalance
    tokensSent: false,
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

export const addAddressToAccounts = (context, address) => {
    context.setState(s => ({ ...s, accounts: [...s.accounts, address], tokenBalances: { ...s.tokenBalances, [address]: 0 }}));
}

export const updateBalance = (context, address, overrideAmt) => { // override for testing only
    // TODO: Fetch and set balance in context for an address
    let updateAmt = 0;
    context.setState(s => ({ ...s, tokenBalances: { ...s.tokenBalances, [address]: overrideAmt ? overrideAmt : updateAmt } }));
}

export const updateTokensSentStatus = (context, status) => {
    context.setState(s => ({ ...s, tokensSent: status}));
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
