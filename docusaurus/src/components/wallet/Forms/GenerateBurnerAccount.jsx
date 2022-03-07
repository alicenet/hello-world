import React from 'react';
import { Button } from 'semantic-ui-react';
import { MadContext, addAddressToAccounts } from '../../../context/MadWalletContext';
import { useMadNetAdapter } from '../../../adapter/MadNetAdapter';

/**
 * Generate a tempory account for application use
 * @returns 
 */
export function GenerateBurnerAccount({ color, content, disabled }) {

    const madAdapterContext = React.useContext(MadContext);
    const madNetAdapter = useMadNetAdapter(madAdapterContext);

    const createBurnerAccount = async () => {
        let pRaw = new Date().valueOf();
        let hash = await madNetAdapter.getMadNetWalletInstance().Utils.hash("0x" + pRaw.toString());
        await madNetAdapter.getMadNetWalletInstance().Account.addAccount(hash);
        const newAddress = madNetAdapter.getMadNetWalletInstance().Account.accounts[madNetAdapter.getMadNetWalletInstance().Account.accounts.length - 1].address;
        addAddressToAccounts(madAdapterContext, newAddress);
    }

    return <div>
        <Button color={color} disabled={disabled} content={content ? content : "Generate Burner Wallet"} size="small" basic onClick={createBurnerAccount} />
    </div>

}