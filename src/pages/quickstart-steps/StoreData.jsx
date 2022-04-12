import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import { AddDataStoreForm } from '../../components/transaction';
import Link from '@docusaurus/Link';
import styles from '../quickstart.module.css';

export default function StoreData() {

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
        <div style={{ textAlign: "left" }}>
            <Link className={styles.inDepthLink} to="/docs/ui-in-depth/store-data" target="_blank">
                <Icon name="external" size="small" />
            </Link>
            DataStores are an integral part of AliceNet and provide a way to write data to the block chain. <br /> <br />
            Here are some things to know about DataStores:
            <List bulleted items={
                [
                    'Storing data costs tokens depending on the data size and storage length',
                    'Storage length is measured in epochs',
                    'Epochs are equal to 1024 blocks',
                    'A block takes roughly 6 seconds to mine, this means 1 epoch lasts about 100 minutes',
                    'Index is the location where the data is stores',
                    'Value is the actual value of the data'
                ]
            } />
            You can think of DataStores as single column database entries, but they do a have a size limit of <strong>(TBD!)</strong> <br />
            Try <i>writing a value</i> first at an index, and <i>then reading it</i> below.
            <div style={{ marginTop: "1rem" }}>
                <AddDataStoreForm />
            </div>

            <div className={styles.buttonWrap} style={{ justifyContent: "space-between" }}>
                <Link to="https://testnet.mnexplore.com/tx?txHash=" target="_blank">
                    Latest Tx hash: {'txHash'}
                </Link>
            </div>
        </div>
    )
}