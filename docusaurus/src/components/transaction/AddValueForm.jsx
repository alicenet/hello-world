import React, { useContext } from 'react';
import { Button, Form, Grid, Header, Icon } from 'semantic-ui-react';
import BigInt from 'big-integer';
import { useFormState } from '../../hooks';
import madNetAdapter from '../../adapter/MadNetAdapter';
import { MadContext } from '../../context/MadWalletContext';

export function AddValueForm({ onSendValue }) {

    const state = useContext(MadContext).state;

    const wallets = state.accounts;
    const fees = state.fees;

    const [formState, formSetter, onSubmit] = useFormState([
        { name: 'From', display: 'From address', type: 'address', isRequired: true, value: wallets[0] },
        { name: 'To', display: 'To address', type: 'address', isRequired: true, value: '01527b9166b4e323384a536996e84f572bab62a0' },
        { name: 'Value', type: 'int', isRequired: true, value: '100' },
    ]);

    const handleSubmit = async () => {
        onSendValue();
        /*dispatch(TRANSACTION_ACTIONS.addStore({
            from: formState.From.value,
            to: formState.To.value,
            value: formState.Value.value,
            type: utils.transaction.transactionTypes.VALUE_STORE,
        }));*/
    };

    const printableFee = BigInt(fees.valueStoreFee).toString();


    return (
            <div style={{ margin: '1rem 3rem' }}>
                <Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "auto" }}>
                    <Header as="h4">
                        Base Fee Per Value Store: {printableFee} MadByte{fees.valueStoreFee > 1 ? "s" : ""}
                    </Header>
                    <Grid.Row>
                        <Form.Input
                            id='Value'
                            label='Value'
                            required
                            value={formState.Value.value}
                            onChange={e => formSetter.setValue(e.target.value)}
                            error={!!formState.Value.error && { content: formState.Value.error }}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Button
                            icon={<Icon name="currency"/>}
                            className="m-0"
                            content={"Add Value Store"}
                            basic
                            color="teal"
                            onClick={() => onSubmit(handleSubmit)}
                        />
                    </Grid.Row>

                    <Grid.Row><b>from:</b> {formState.From.value} <b>balance:</b> {state.tokenBalances[wallets[0]]}</Grid.Row>
                    <Grid.Row><b>to:</b> {formState.To.value} <b>balance:</b> {state.tokenBalances[wallets[0]]}</Grid.Row>
                </Grid>
            </div>
        )
}