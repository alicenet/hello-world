import React from 'react';
import { Button } from 'semantic-ui-react';
import { MadContext, addAddressToAccounts } from '../../../context/MadWalletContext';
import { useMadNetAdapter } from '../../../adapter/MadNetAdapter';
import { GenerateWalletAgreement } from './GenerateWalletAgreement';
import { useCookies } from 'react-cookie';

/**
 * @component
 * @prop {string} color - Nested <Button> color
 * @prop {string} content - Nested <Button> content
 * @prop {boolean} disabled - Nested <Button> disabled?
 * Generate a tempory account for application use
 * @returns {React.Component}
 */
export function GenerateBurnerAccount({ color, content, disabled }) {

    const madAdapterContext = React.useContext(MadContext);
    const madNetAdapter = useMadNetAdapter(madAdapterContext);
    const [isAgreementChecked, setAgreementTick] = React.useState(false);
    const [, setCookie] = useCookies(); 

    /**
     * Use current date to generate a demo burner wallet and add to Accounts
     * Additionally set it to cookie state
     */
    const createBurnerAccount = async () => {
        let pRaw = new Date().valueOf();
        let hash = await madNetAdapter.getMadNetWalletInstance().Utils.hash("0x" + pRaw.toString());
        await madNetAdapter.getMadNetWalletInstance().Account.addAccount(hash);
        const newAddress = madNetAdapter.getMadNetWalletInstance().Account.accounts[madNetAdapter.getMadNetWalletInstance().Account.accounts.length - 1].address;
        setCookie('aliceNetDemo-raw-root', pRaw);
        addAddressToAccounts(madAdapterContext, newAddress);
    }

    return <div>
        <GenerateWalletAgreement tickState={isAgreementChecked} setTickState={setAgreementTick} />
        <Button color={color} disabled={disabled || !isAgreementChecked} content={content ? content : "Generate Burner Wallet"} size="small" basic onClick={createBurnerAccount} />
    </div>

}