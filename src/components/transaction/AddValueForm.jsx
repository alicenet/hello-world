import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Grid, Message, Table, TableHeaderCell } from 'semantic-ui-react';
import { useFormState } from '../../hooks';
import { MadContext, updateBalance, updateTxExplore } from '../../context/MadWalletContext';
import { useMadNetAdapter } from '../../adapter/MadNetAdapter';
import { useCookies } from 'react-cookie';

const DESTINATION_WALLET = '01527b9166b4e323384a536996e84f572bab62a0';
const DEFAULT_VALUE = '100';
const VALUE_STORE = 2;

export function AddValueForm({ onSendValue }) {

    const ctx = useContext(MadContext);

    const madAdapterContext = useContext(MadContext);
    const madNetAdapter = useMadNetAdapter(madAdapterContext);
    const state = madAdapterContext.state;
    const wallets = state.accounts;
    const tokensSent = state.tokensSent;
    const [, setCookie] = useCookies();

    const [formState, formSetter] = useFormState([
        { name: 'From', display: 'From address', type: 'address', isRequired: true, value: wallets[0] },
        { name: 'To', display: 'To address', type: 'address', isRequired: true, value: DESTINATION_WALLET },
        { name: 'Value', type: 'int', isRequired: true, value: DEFAULT_VALUE },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateBalances = async () => {
        let [balanceFrom] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(formState.From.value);
        let [balanceTo] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(DESTINATION_WALLET);
        updateBalance(madAdapterContext, formState.From.value, balanceFrom);
        updateBalance(madAdapterContext, DESTINATION_WALLET, balanceTo);
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');
            const tx = {
                from: formState.From.value,
                to: formState.To.value,
                value: formState.Value.value,
                type: VALUE_STORE,
            }
            const txHash = await madNetAdapter.createAndsendTx(tx);
            console.log(txHash);

            setTimeout(async () => {
                // Give the network a few seconds to catch up after the success
                await updateBalances();
                updateTxExplore(ctx, { txHash });
                onSendValue();
                setLoading(false);
                setCookie('aliceNetDemo-has-sent-value', true);
            }, 5000);
        } catch (exception) {
            setLoading(false);
            setError(exception);
        }
    };

    useEffect(() => {
        const loadBalances = async () => {
            let [balanceTo] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(DESTINATION_WALLET);
            updateBalance(madAdapterContext, DESTINATION_WALLET, balanceTo);

            if (!formState.From.value) return;
            let [balanceFrom] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(formState.From.value);
            updateBalance(madAdapterContext, formState.From.value, balanceFrom);

        }
        loadBalances();
    }, [])

    return (
        <div style={{ margin: '1rem 3rem' }}>
            <Grid textAlign="left">

                <Grid.Row>
                    <Grid.Column>
                        <Form.Input
                            id='Value'
                            disabled
                            action={
                                <Button
                                    icon={tokensSent ? "thumbs up" : "currency"}
                                    content={tokensSent ? "Value Sent! (Send Again?)" : "Send Value"}
                                    basic
                                    color="teal"
                                    onClick={(e) => handleSubmit(e)}
                                    loading={loading}
                                />
                            }
                            required
                            value={formState.Value.value}
                            onChange={e => formSetter.setValue(e.target.value)}
                            error={!!formState.Value.error && { content: formState.Value.error }}
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}>
                        <p style={{ fontSize: "11px" }}>
                            You may notice a deduction on the from account greater than the amount, this is due to the associated Transaction Fees<br />
                            They are generally quite low for value transactions and should be around ~5-6 tokens at the moment.
                        </p>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <TableHeaderCell>From (Balance)</TableHeaderCell>
                                    <TableHeaderCell>To (Balance)</TableHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{formState.From.value} ({state.tokenBalances[formState.From.value]})</Table.Cell>
                                    <Table.Cell>{formState.To.value} ({state.tokenBalances[DESTINATION_WALLET]})</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <div style={{ fontSize: "11px" }}>
                            Remember! All actions on AliceNet require a transaction. <br/> 
                            Whether you are sending a value with ValueStore like in this example, or a DataStore in the next example. <br/>
                            <b>Both are technically transactions.</b>
                        </div>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column width={16}>
                        {error && <Message error>There was a problem during the transaction</Message>}
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        </div>
    )
}