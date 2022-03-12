import React, { useState } from 'react'
import { useFormState } from 'components/hooks';
import { Form, Header, Message } from 'semantic-ui-react';
import utils from 'utils';
import madAdapter from 'adapters/madAdapter';
import { WALLET_ACTIONS } from 'redux/actions';
import { useDispatch } from 'react-redux';

export function ImportPrivateKeyForm({ hideTitle }) {

    const [formState, formSetter] = useFormState([
        { name: 'privateKey', display: 'Private Key', type: 'string', isRequired: true, },
    ]);

    const [error, setError] = useState(false);
    const [ks, setKS] = useState(null);
    const [success] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const verifyPrivKey = async () => {
        try {
            setLoading(true);
            const generatedKS = await utils.wallet.generateKeystoreFromPrivK(formState.privateKey.value, "");
            setKS(generatedKS);
            setError(false);
            setLoading(false);
            await madAdapter.getMadNetWalletInstance().Account.addAccount(formState.privateKey.value);
            const newAddress = madAdapter.getMadNetWalletInstance().Account.accounts[madAdapter.getMadNetWalletInstance().Account.accounts.length-1].address;
            dispatch(WALLET_ACTIONS.addWallet(newAddress));
        } catch (ex) {
            setLoading(false);
            setError(ex.message);
        }
    }

    return (

        <Form error={error} size="mini" className="max-w-md w-72 text-left">

            {!hideTitle && (
                <Header as="h4" textAlign="center">Load A Keystore</Header>
            )}

            <Form.Input
                type="text"
                onChange={(e) => formSetter.setPrivateKey(e.target.value)}
                value={formState.privateKey.value}
                placeholder="0x..."
                label={
                    <label>
                        Private Key
                    </label>
                }
                error={!!formState.privateKey.error && { content: formState.privateKey.error }}
            />

            <Form.Button
                fluid
                size="small"
                basic
                loading={loading}
                onClick={() => verifyPrivKey()}
                color={error ? "red" : "green"}
                disabled={success}
                content={error ? "Try Again" : success ? "Success" : "Add Wallet"}
                icon={error ? "exclamation" : success ? "checkmark" : "plus"}
            />

            <Message error>{error}</Message>

            <div>{ks && !error && `Created account: ${JSON.parse(ks).address}`}</div>

        </Form>

    )

}
