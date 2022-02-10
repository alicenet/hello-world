import { Segment, Tab } from 'semantic-ui-react';
import { GenerateKeystoreForm, GenerateBurnerAccount, ImportPrivateKeyForm } from './Forms';
import { WalletList } from './WalletList';

export function Wallet() {

    const panes = [
        { menuItem: 'Generate Keystore', render: () => <Tab.Pane><GenerateKeystoreForm hideTitle defaultPassword="testing" /></Tab.Pane> },
        { menuItem: 'Import private key', render: () => <Tab.Pane><div className="flex justify-center"><ImportPrivateKeyForm hideTitle/></div></Tab.Pane> },
        { menuItem: 'Generate Burner', render: () => <Tab.Pane><GenerateBurnerAccount/></Tab.Pane> },
        { menuItem: 'Wallets', render: () => <Tab.Pane><WalletList/></Tab.Pane> },
      ];

    return (
            <Segment className="text-left w-3/4">
                <Tab panes={panes} className="w-full"/>
            </Segment>
    )

}