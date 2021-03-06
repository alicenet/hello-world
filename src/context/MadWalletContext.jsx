import React from 'react';
import madNetAdapter from '../adapter/MadNetAdapter';

export const defaultState = {
    state: {
        connected: false,
        busy: false,
        error: false,
        accounts: [],
        tokenBalances: {}, // K:V where K is address and v is tokenBalance
        tokensSent: false,
        latestSentValueTx: "",
        latestStoredDataTx: "",
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
}

export const MadContext = React.createContext(defaultState);

export const addAddressToAccounts = (context, address) => {
    context.setState(s => ({ state: { ...s.state, accounts: [...s.state.accounts, address], tokenBalances: { ...s.state.tokenBalances, [address]: 0 } } }));
}

export const updateBalance = async (context, address) => {
    let [balance] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(address);
    context.setState(s => ({ state: { ...s.state, tokenBalances: { ...s.state.tokenBalances, [address]: balance } }}));
}

export const updateTokensSentStatus = (context, status) => {
    context.setState(s => ({ state: { ...s.state, tokensSent: status } }));
}

export const updateLatestSentValueTx = (context, txHash) => {
    context.setState(s => ({ state: { ...s.state, latestSentValueTx: txHash } }));
}

export const updateLatestStoredDataTx = (context, txHash) => {
    context.setState(s => ({ state: { ...s.state, latestStoredDataTx: txHash } }));
}

export const checkForCookieWallet = async (context, cookies) => {
    if (cookies['aliceNetDemo-raw-root']) {
        if (cookies['aliceNetDemo-has-sent-value'] && cookies['aliceNetDemo-has-sent-value'] === 'true' ) {
            updateTokensSentStatus(context, true);
        } else {
            updateTokensSentStatus(context, false);
        }
        let walletInstance = madNetAdapter.getMadNetWalletInstance();
        if (!walletInstance) { return }
        if (walletInstance.Account.accounts.length === 0) { // Only add if not added yet -- Should only ever be one here.
            let pRaw = cookies['aliceNetDemo-raw-root']
            let hash = await walletInstance.Utils.hash("0x" + pRaw.toString());
            await walletInstance.Account.addAccount(hash, 1);
            let loadedAddress = await walletInstance.Account.accounts[madNetAdapter.getMadNetWalletInstance().Account.accounts.length - 1].address;
            addAddressToAccounts(context, loadedAddress);
            await updateBalance(context, loadedAddress);
        } 
        else if (walletInstance.Account.accounts.length > 0 && context.state.accounts == 0) { // Reload to state -- Covers mdx/doc context switch 
            let loadedAddress = await walletInstance.Account.accounts[madNetAdapter.getMadNetWalletInstance().Account.accounts.length - 1].address;
            addAddressToAccounts(context, loadedAddress);
            await updateBalance(context, loadedAddress);
        }
    } else { return }
}

/**
 * Provide MadAdapter context where needed
 */
export function MadProvider({ children }) {

    const [state, setState] = React.useState(defaultState);

    return (
        <MadContext.Provider value={{ ...state, setState: setState }}>
            {children}
        </MadContext.Provider>
    )

}
