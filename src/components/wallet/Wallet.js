import { useState } from 'react';
import { Segment, Tab, Form } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { GenerateKeystoreForm, GenerateBurnerAccount, ImportPrivateKeyForm } from './Forms';

export function Wallet() {

    const dispatch = useDispatch();

    const [newWalletName, setNewWalletName] = useState("test_wallet");

    const panes = [
        { menuItem: 'Generate Keystore', render: () => <Tab.Pane><GenerateKeystoreTabContent/></Tab.Pane> },
        { menuItem: 'Import private key', render: () => <Tab.Pane><div className="flex justify-center"><ImportPrivateKeyForm/></div></Tab.Pane> },
        { menuItem: 'Generate Burner', render: () => <Tab.Pane><GenerateBurnerAccount/></Tab.Pane> },
      ];
    
    const GenerateKeystoreTabContent = () => 
        <>
            <GenerateKeystoreForm hideTitle inline defaultPassword="testing" showPassword loadKeystoreCB={addWalletFromKeystore} />
            <Form size="mini">
                <Form.Input label="Name for Above Generated Wallet ( Saved As the wallet name on 'Load' )" size="mini" value={newWalletName} onChange={e => setNewWalletName(e.target.value)} />
            </Form>
        </>;

    const addWalletFromKeystore = async (keystoreJson, password) => {
        //await dispatch(VAULT_ACTIONS.addExternalWalletToState(keystoreJson, password, newWalletName));
    }

    return (
            
            <Segment className="text-left w-3/4">
                <Tab panes={panes} className="w-full"/>
            </Segment>

    )

}