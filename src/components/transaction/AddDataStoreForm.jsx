import React, { useState, useContext } from 'react';
import { Button, Form, Grid, Icon, Message } from 'semantic-ui-react';
import { useFormState } from '../../hooks';
import { MadContext, updateBalance } from '../../context/MadWalletContext';
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

    const [loadingWrite, setLoadingWrite] = useState(false);
    const [loadingRead, setLoadingRead] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [storedData, setStoredData] = useState('');

    const [successButtonContent, setSuccessButtonContent] = useState(<> <Icon name='chart bar' />&nbsp;Write value at index</>);

    const [formState, formSetter] = useFormState([
        { name: 'From', display: 'From address', type: 'address', isRequired: true, value: wallets[0] },
        { name: 'Duration', type: 'integer', isRequired: true, value: DURATION },
        { name: 'Key', type: 'string', isRequired: true, value: DEFAULT_KEY },
        { name: 'Value', type: 'string', isRequired: true, value: DEFAULT_VALUE },
    ]);

    const handleSubmitWrite = async () => {
        try {
            setSuccess(false);
            setLoadingWrite(true);
            setError('');

            const tx = {
                from: formState.From.value,
                key: formState.Key.value,
                value: formState.Value.value,
                duration: formState.Duration.value,
                type: DATA_STORE,
            }
            await madNetAdapter.createAndsendTx(tx);

            setTimeout(async () => {
                // Give the network a few seconds to catch up after the success
                let [balanceFrom] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(formState.From.value);

                updateBalance(madAdapterContext, formState.From.value, balanceFrom);

                setSuccessButtonContent(<><Icon name='thumbs up' color='teal'/>&nbsp;Success</>);

                setTimeout(() => {
                    setSuccessButtonContent(<> <Icon name='chart bar'/>&nbsp;Write value at index</>);
                }, 2000);

                setSuccess(true);
                setLoadingWrite(false);
            }, 3000);

            
        } catch(exception) {
            console.log(exception)
            setLoadingWrite(false);
            setError(exception);
        }
        
    };

    const handleReadData = async () => {
        try {
            setError('');
            setLoadingRead(true);

            let UTXOIDS = await madNetAdapter.getMadNetWalletInstance().Rpc.getDataStoreUTXOIDs(wallets[0], CURVE_TYPE, MAX_UTXOS, undefined)  
            let storedData = await madNetAdapter.getMadNetWalletInstance().Rpc.getDataStoreByIndex(wallets[0], CURVE_TYPE, UTXOIDS[0].index);
            setStoredData(utils.hash.hexToUtf8Str(storedData.DSLinker.DSPreImage.RawData));
            setLoadingRead(false);
            
        }catch (exception) {
            console.log(exception)
            setLoadingRead(false);
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

                    <Grid.Row columns={4}>

                        <Grid.Column>

                            <Form.Input
                                id='Key'
                                label={<div>Index:</div>}
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

                    
                    <Grid.Row columns={4}>

                        <Grid.Column>
                            <Button
                                icon={<Icon name='search' />}
                                content={"Read value at index"}
                                basic
                                color="green"
                                onClick={handleReadData}
                                loading={loadingRead}
                                disabled={!success || loadingWrite}
                                style={{ width: '100%' }}
                            />
                        </Grid.Column>

                        <Grid.Column>
                            <Button
                                content={successButtonContent}
                                basic
                                color="teal"
                                onClick={handleSubmitWrite}
                                loading={loadingWrite}
                                style={{ width: '100%' }}
                                disabled={loadingRead}
                            />
                        </Grid.Column>

                    </Grid.Row>

                    <Grid.Row columns={1}>

                        <Grid.Column>
                            <Form.Input
                                id='Value'
                                required
                                placeholder='Read value output'
                                value={storedData}
                                disabled
                                style={{ width: '50%' }}
                            />
                        </Grid.Column>

                    </Grid.Row>

                </Grid>

            </div>

            <div>{error && <Message error>There was a problem during the transaction</Message>}</div>

        </div>
    )
}