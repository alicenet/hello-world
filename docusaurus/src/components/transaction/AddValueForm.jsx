import React, { useState, useContext, useEffect } from 'react';
import { Button, Form, Grid, Icon, Popup } from 'semantic-ui-react';
import { useFormState } from '../../hooks';
import { MadContext, updateBalance } from '../../context/MadWalletContext';
import { useMadNetAdapter } from '../../adapter/MadNetAdapter';

const DESTINATION_WALLET = '01527b9166b4e323384a536996e84f572bab62a0';
const DEFAULT_VALUE = '100';
const VALUE_STORE = 2;

export function AddValueForm({ onSendValue }) {

    const madAdapterContext = useContext(MadContext);
    const madNetAdapter = useMadNetAdapter(madAdapterContext);
    const state = madAdapterContext.state;
    const wallets = state.accounts;
    
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
            await madNetAdapter.createAndsendTx(tx);
            await madNetAdapter.monitorPending();
            onSendValue();
            await updateBalances();
            setLoading(false);
        }catch(exception){
            await updateBalances();
            setLoading(false);
            setError(exception);
        }
    };

    useEffect(() => {
        const loadBalances = async () => {
            let [balanceTo] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(DESTINATION_WALLET);
            updateBalance(madAdapterContext, formState.From.value, state.tokenBalances[formState.From.value]);
            updateBalance(madAdapterContext, DESTINATION_WALLET, balanceTo);
        }
        loadBalances();
    }, [])

    return (
            <div style={{ margin: '1rem 3rem' }}>
                <Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "auto" }}>
                    <Grid.Row>
                        <Form.Input
                            id='Value'
                            action={
                                <Popup
                                    trigger={<Button
                                        icon={<Icon name="currency"/>}
                                        content={"Send Value"}
                                        basic
                                        color="teal"
                                        onClick={(e) => handleSubmit(e)}
                                        loading={loading}
                                    />}
                                    size="mini"
                                    position="right center"
                                    content="You may notice a deduction on the from account greater than the amount, this is due to the associated Transaction Fees, they are generally quite low for value transactions and should be around ~5-6 tokens at the moment."
                                />
                               }
                            required
                            value={formState.Value.value}
                            onChange={e => formSetter.setValue(e.target.value)}
                            error={!!formState.Value.error && { content: formState.Value.error }}
                        />
                    </Grid.Row>
                    <Grid.Row><b>From:&nbsp;</b> {formState.From.value} <b>&nbsp;Balance:&nbsp;</b> {state.tokenBalances[formState.From.value]}</Grid.Row>
                    <Grid.Row><b>To:&nbsp;</b> {formState.To.value} <b>&nbsp;Balance:&nbsp;</b> {state.tokenBalances[DESTINATION_WALLET] || '0'}</Grid.Row>

                    <Grid.Row>{error && 'There was a problem during the transaction'}</Grid.Row>
                </Grid>
            </div>
        )
}