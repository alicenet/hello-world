import React, { useMemo, useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Icon } from 'semantic-ui-react';
import { useFormState } from 'components/hooks';
import { useDispatch, useSelector } from 'react-redux';
import has from 'lodash/has';
import utils from 'utils';
import madNetAdapter from 'adapters/madAdapter';
import BigInt from 'big-integer';
import { TRANSACTION_ACTIONS } from 'redux/actions';

export function AddEditDataStore() {

    const [success, setSuccess] = useState(false);
    
    const { wallets } = useSelector(state => ({
        wallets: state.wallet.wallets
    }));

    const [calculatedFee, setCalculatedFee] = useState(0);
    const [error, setError] = useState('');
    const [dataStore, setDataStore] = useState({ from: '', to: '', value: '', duration: ''});

    const fees = madNetAdapter.fees.get();

    const dispatch = useDispatch();

    const walletOptions = useMemo(() => wallets.map(wallet => {
        return {
            text: wallet,
            value: wallet
        };
    }) || [], [wallets]);

    const [formState, formSetter, onSubmit] = useFormState([
        { name: 'From', display: 'From address', type: 'address', isRequired: true, value: dataStore.from },
        { name: 'Duration', type: 'integer', isRequired: true, value: dataStore.duration },
        { name: 'Key', type: 'string', isRequired: true, value: dataStore.key },
        { name: 'Value', type: 'string', isRequired: true, value: dataStore.value },
    ]);

    const isEditing = has(dataStore, 'index');

    const handleSubmit = async () => {
        setSuccess(false);

        if (isEditing) {
            dispatch(TRANSACTION_ACTIONS.editStore({
                ...dataStore,
                from: formState.From.value,
                key: formState.Key.value,
                value: formState.Value.value,
                duration: formState.Duration.value,
            }));
        } else {
            dispatch(TRANSACTION_ACTIONS.addStore({
                from: formState.From.value,
                key: formState.Key.value,
                value: formState.Value.value,
                duration: formState.Duration.value,
                type: utils.transaction.transactionTypes.DATA_STORE,
            }));
        }
        setSuccess(true);
    };

    useEffect(() => {
        const calculateFee = async () => {
            try{
                setError('');
                if(formState.Duration.value && formState.Value.value){
                    let madWallet = madNetAdapter.getMadNetWalletInstance();
                    const dataStoreFee = await madWallet.Utils.calculateFee(fees.dataStoreFee, formState.Duration.value);
                    let rawValue = Buffer(formState.Value.value).toString('hex');
                    const depositFee = await madWallet.Utils.calculateDeposit(rawValue, formState.Duration.value);
                    const totalStoreCost = BigInt(dataStoreFee) + BigInt(depositFee);
                    setCalculatedFee(totalStoreCost);
                }
            }catch(error){
                console.log(error)
                setError('Could not calculate cost, please check your inputs')
                setCalculatedFee(0);
            }
        }
        calculateFee();

    },[fees, formState.Duration.value, formState.Value.value]);

    const totalStoreCostLabel = calculatedFee ? `${calculatedFee}` : '0';

    const printableFee = BigInt(fees.dataStoreFee).toString();

    return (
        <div>

            <div className="text-center">

                <Header as="h4" className="uppercase" color="purple">{`${isEditing ? 'Edit' : 'Add'} Data Store`}
                    <Header.Subheader className="text-xs">Fee Per Data Store: {printableFee} {utils.string.pluralStringCheck("MadByte", fees.dataStoreFee > 1)}</Header.Subheader>
                </Header>

            </div>

            <div className="mb-5">

                <Form size="small" className="text-sm mini-error-form" onSubmit={() => onSubmit(handleSubmit)}>

                    <Grid className="m-0 content-evenly gap-2">

                        <Grid.Row columns={2} className="p-0">

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

                            <Grid.Column>

                                <Form.Input
                                    id='Duration'
                                    label='Duration'
                                    required
                                    value={formState.Duration.value}
                                    onChange={e => formSetter.setDuration(e.target.value)}
                                    error={!!formState.Duration.error && { content: formState.Duration.error }}
                                />

                            </Grid.Column>

                        </Grid.Row>

                        <Grid.Row columns={2} className="p-0">

                            <Grid.Column>

                                <Form.Input
                                    id='Key'
                                    label='Key'
                                    required
                                    value={formState.Key.value}
                                    onChange={e => formSetter.setKey(e.target.value)}
                                    error={!!formState.Key.error && { content: formState.Key.error }}
                                />

                            </Grid.Column>

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

            <div className="flex justify-around">

                <Button
                    icon={<Icon name='chart bar' />}
                    className="m-0"
                    content={"Add Datastore for " + totalStoreCostLabel + " MadBytes"}
                    basic
                    color="teal"
                    onClick={() => onSubmit(handleSubmit)}
                />

            </div>

            <div className="flex justify-around text-teal-400">{success && <div>Data Store added</div>}</div>

            <div className="flex flex-column justify-center items-center text-sm text-red-500">
                {error}
            </div>

        </div>
    )
}