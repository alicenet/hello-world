import React from 'react';
import { Header } from 'semantic-ui-react';
import { AddDataStoreForm } from '../../components/transaction';

export function StoreData() {

    /**
     * This form is going to be for storing and reading a piece of data
     * Give the user two horizontal inputs for index and value, we will only store it for 1 epoch so no duration
     * 
     * Make sure that a user takes the proper steps and is restricted down a pipeline to the following actions:
     * 
     * 1. User must send a data store TX
     * 2. After data stored, the user is prompted to read their data from the chain with "Read Value At Index"
     * - Keep read greyed out until a data store tx is made
     * 
     * See whiteboarding image from Adam for details
     */

    return (
        <div>
            <Header content="Data store transaction" /> <br />
            This form is going to be for storing and reading a piece of data. <br />
            After that, you will be able to read the data from the chain using the form with the "Read Value At Index" field <br />
            <div style={{ marginTop: "1rem" }}>
                <AddDataStoreForm/>
            </div>
        </div>
    )
}