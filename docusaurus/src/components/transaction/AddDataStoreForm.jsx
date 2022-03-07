import React, { useState, useContext } from 'react';
import { Button, Form, Grid, Icon } from 'semantic-ui-react';
import { useFormState } from '../../hooks';
import { MadContext, updateBalance, addAddressToAccounts } from '../../context/MadWalletContext';
import { useMadNetAdapter } from '../../adapter/MadNetAdapter';
import utils from '../../utils';

const DEFAULT_VALUE = 'lorem ipsum';
const DEFAULT_KEY = 'test-index';
const DURATION = '1';
const DATA_STORE = 1;
const CURVE_TYPE = 1;
const MAX_UTXOS = 255;

export function AddDataStoreForm() {

    const madAdapterContext = useContext(MadContext);
    const madNetAdapter = useMadNetAdapter(madAdapterContext);
    const state = madAdapterContext.state;
    const wallets = state.accounts;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [storedData, setStoredData] = useState('');

    const [formState, formSetter] = useFormState([
        { name: 'From', display: 'From address', type: 'address', isRequired: true, value: wallets[0] },
        { name: 'Duration', type: 'integer', isRequired: true, value: DURATION },
        { name: 'Key', type: 'string', isRequired: true, value: DEFAULT_KEY },
        { name: 'Value', type: 'string', isRequired: true, value: DEFAULT_VALUE },
    ]);

    const handleSubmit = async () => {
        try {
            setSuccess(false);
            setLoading(true);

            const tx = {
                from: formState.From.value,
                key: formState.Key.value,
                value: formState.Value.value,
                duration: formState.Duration.value,
                type: DATA_STORE,
            }
            await madNetAdapter.createAndsendTx(tx);
            await madNetAdapter.monitorPending();

            let [balanceFrom] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(formState.From.value);

            updateBalance(madAdapterContext, formState.From.value, balanceFrom);

            setSuccess(true);
            setLoading(false);
        } catch(exception) {
            console.log(exception)
            setLoading(false);
            setError(exception);
        }
        
    };

    const handleReadData = async () => {
        try {
            setLoading(true);
            let UTXOIDS = await madNetAdapter.getMadNetWalletInstance().Rpc.getDataStoreUTXOIDs(wallets[0], CURVE_TYPE, MAX_UTXOS, undefined)         
            let DStores = await madNetAdapter.getMadNetWalletInstance().Rpc.getUTXOsByIds([UTXOIDS[0].UTXOID]);
            let dStores = DStores[0];
            // Extract data from stores
            dStores = await madNetAdapter.parseDsLinkers(dStores);
            const valueFinal = utils.hash.hexToUtf8Str(dStores[0].value);
            setStoredData(valueFinal);
            setLoading(false);
        }catch (exception) {
            console.log(exception)
            setLoading(false);
            setError(exception);
        }
    }

    

    return (
        <div>

            <div style={{ marginBottom: '5px' }}>

                <Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "auto" }}>
                    
                    <Grid.Row>
                        <div style={{ margin: 'auto' }}>
                            <b>From:&nbsp;</b> {formState.From.value} <b>&nbsp;Balance:&nbsp;</b> {state.tokenBalances[formState.From.value]}
                        </div>
                    </Grid.Row>

                    <Grid.Row columns={2}>

                        <Grid.Column>

                            <Form.Input
                                id='Key'
                                label={<div>Key:</div>}
                                required
                                value={formState.Key.value}
                                onChange={e => formSetter.setKey(e.target.value)}
                                error={!!formState.Key.error && { content: formState.Key.error }}
                                style={{ width: '100%' }}
                            />

                        </Grid.Column>

                        <Grid.Column>

                            <Form.Input
                                id='Value'
                                label={<div>Value:</div>}
                                required
                                value={formState.Value.value}
                                onChange={e => formSetter.setValue(e.target.value)}
                                error={!!formState.Value.error && { content: formState.Value.error }}
                                style={{ width: '100%' }}
                            />

                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>

            <div>
                {success && 
                    <Button
                        icon={<Icon name='chart bar' />}
                        content={"Read value at index"}
                        basic
                        color="green"
                        onClick={handleReadData}
                        loading={loading}
                    />
                }
                <Button
                    icon={<Icon name='chart bar' />}
                    content={"Write value at index"}
                    basic
                    color="teal"
                    onClick={handleSubmit}
                    loading={loading}
                />

            </div>

            {storedData && <div><b>Read Value Output:</b> {storedData}</div>}

            <div>{success && <div>Data Store added</div>}</div>

            <div>
                {error && 'There was a problem during the transaction'}
            </div>

        </div>
    )
}