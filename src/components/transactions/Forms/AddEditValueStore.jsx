import React, { useMemo, useState } from 'react';
import { Button, Form, Grid, Header, Icon } from 'semantic-ui-react';
import { useFormState } from 'components/hooks';
import { useDispatch, useSelector } from 'react-redux';
import has from 'lodash/has';
import madNetAdapter from 'adapters/madAdapter';
import BigInt from 'big-integer';
import utils from 'utils';
import { TRANSACTION_ACTIONS } from 'redux/actions';

export function AddEditValueStore() {

    const [success, setSuccess] = useState(false);

    const dispatch = useDispatch();
    const [valueStore, setValueStore] = useState({ from: '', to: '', value: ''});

    const { wallets } = useSelector(state => ({
        wallets: state.wallet.wallets,
    }));

    const fees = madNetAdapter.fees.get();

    const [formState, formSetter, onSubmit] = useFormState([
        { name: 'From', display: 'From address', type: 'address', isRequired: true, value: valueStore.from },
        { name: 'To', display: 'To address', type: 'address', isRequired: true, value: valueStore.to },
        { name: 'Value', type: 'int', isRequired: true, value: valueStore.value },
    ]);

    const isEditing = has(valueStore, 'index');

    const walletOptions = useMemo(() => wallets.map(wallet => {
        return {
            text: wallet,
            value: wallet
        };
    }) || [], [wallets]);

    const handleSubmit = async () => {
        setSuccess(false);
        if (isEditing) {
            dispatch(TRANSACTION_ACTIONS.editStore({
                ...valueStore,
                from: formState.From.value,
                to: formState.To.value,
                value: formState.Value.value
            }));
        } else {
            dispatch(TRANSACTION_ACTIONS.addStore({
                from: formState.From.value,
                to: formState.To.value,
                value: formState.Value.value,
                type: utils.transaction.transactionTypes.VALUE_STORE,
            }));
        }
        setSuccess(true);
    };

    const printableFee = BigInt(fees.valueStoreFee).toString();

    return (
        <div>

            <div className="text-center">

                <Header as="h4" className="uppercase" color="purple">{`${isEditing ? 'Edit' : 'Add'} Value Store`}
                    <Header.Subheader className="text-xs">Base Fee Per Value Store: {printableFee} MadByte{fees.valueStoreFee > 1 ? "s" : ""}</Header.Subheader>
                 </Header>

            </div>

            <div className="mb-5">

                <Form size="small" className="text-sm mini-error-form" onSubmit={() => onSubmit(handleSubmit)}>

                    <Grid className="m-0 content-evenly gap-2">

                        <Grid.Row columns={1} className="p-0">

                            <Grid.Column>

                                <Form.Select
                                    required
                                    id='From'
                                    label='From'
                                    options={walletOptions}
                                    selection
                                    closeOnChange
                                    value={formState.From.value}
                                    onChange={(e, { value }) => formSetter.setFrom(value)}
                                    error={!!formState.From.error && { content: formState.From.error }}
                                />

                            </Grid.Column>

                        </Grid.Row>

                        <Grid.Row columns={2} className="p-0 justify-around">

                            <Grid.Column width="16">

                                <Form.Input
                                    id="To"
                                    label="To"
                                    value={formState.To.value}
                                    onChange={e => formSetter.setTo(e.target.value)}
                                    error={!!formState.To.error && { content: formState.To.error }}
                                />

                            </Grid.Column>

                        </Grid.Row>

                        <Grid.Row columns={1} className="p-0">

                            <Grid.Column>

                                <Form.Input
                                    id='Value'
                                    label='Value'
                                    required
                                    value={formState.Value.value}
                                    onChange={e => formSetter.setValue(e.target.value)}
                                    error={!!formState.Value.error && { content: formState.Value.error }}
                                />

                            </Grid.Column>

                        </Grid.Row>

                    </Grid>
                </Form>

            </div>

            <div className="flex justify-around mb-5">
                <Button
                    icon={<Icon name="currency"/>}
                    className="m-0"
                    content={`${isEditing ? 'Edit' : 'Add'} Value Store`}
                    basic
                    color="teal"
                    onClick={() => onSubmit(handleSubmit)}
                />
            </div>
            <div className="flex justify-around text-teal-400">{success && <div>Value added</div>}</div>

        </div>
    )
}