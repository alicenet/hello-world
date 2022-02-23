import { Segment, Tab } from 'semantic-ui-react';
import { AddEditValueStore, AddEditDataStore, TransactionsList } from './Forms';

export function Transactions() {

    const panes = [
        { menuItem: 'Transactions', render: () => <Tab.Pane><TransactionsList/></Tab.Pane> },
        { menuItem: 'Value Store', render: () => <Tab.Pane><AddEditValueStore/></Tab.Pane> },
        { menuItem: 'Data Store', render: () => <Tab.Pane><AddEditDataStore/></Tab.Pane> },
      ];

    return (
            <Segment className="text-left">
                <Tab panes={panes} className="w-full"/>
            </Segment>
    )

}