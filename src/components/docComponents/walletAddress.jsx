import React from 'react';
import { MadContext } from '../../context/MadWalletContext'

export function WalletAddress() {
    const ctx = React.useContext(MadContext);
    console.log(ctx);
    return ctx.accounts.length > 0 ? ctx.accounts[0] : "No address found.";
}