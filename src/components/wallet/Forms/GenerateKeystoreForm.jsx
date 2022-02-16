import React, { useState, useRef } from 'react'
import { useFormState } from 'components/hooks';
import { Button, Form, Header } from 'semantic-ui-react';
import utils from 'utils';
import madAdapter from 'adapters/madAdapter';
import { WALLET_ACTIONS } from 'redux/actions';
import { useDispatch } from 'react-redux';

export function GenerateKeystoreForm(
    {
        defaultPassword = "",
        hideTitle,
        customTitle = "Generate Keystore"
    }
) {
    const [formState, formSetter] = useFormState([
        { name: 'password', type: 'password', value: defaultPassword, isRequired: true },
        { name: 'verifiedPassword', display: 'Verify Password', type: 'verified-password', isRequired: true },
    ]);

    const [keystoreDL, setKeystoreDL] = useState(false);

    const [loadingGenerating, setLoadingGenerating] = useState(false);
    const [loadingKeystoreLoad, setLoadingKeystoreLoad] = useState(false);
    const [address, setAddress] = useState('');

    const downloadRef = useRef();

    const dispatch = useDispatch();

    const loadKeystore = () => {
        setLoadingKeystoreLoad(true);
        try{
            let fr = new FileReader();
            fr.readAsText(keystoreDL.data)
            fr.onload = async (res) => {
                let ksJSON = JSON.parse(res.target.result);
                let ks = await utils.wallet.unlockKeystore(ksJSON, formState.password.value);
                await madAdapter.getMadNetWalletInstance().Account.addAccount(ks.privateKey);
                const newAddress = madAdapter.getMadNetWalletInstance().Account.accounts[madAdapter.getMadNetWalletInstance().Account.accounts.length-1].address;
                setAddress(newAddress);
                dispatch(WALLET_ACTIONS.addWallet(newAddress));
                setLoadingKeystoreLoad(false);
            }
        }catch(err){
            setLoadingKeystoreLoad(false);
        }
    }

    const generateWallet = async () => {
        setLoadingGenerating(true);
        try{
            let newStoreBlob = await utils.wallet.generateKeystore(true, formState.password.value);
            setLoadingGenerating(false);
            setKeystoreDL({
                filename: "MadWallet_" + Date.now() + ".json",
                data: newStoreBlob
            });
            downloadRef.current.href = URL.createObjectURL(newStoreBlob);
        }   catch(err){
            setLoadingGenerating(false)
        }
    }

    const setFilename = async () => {
        setKeystoreDL(s => ({
            filename: "a",
            ...s
        }));
    }

    return (
        <Form size="mini" onSubmit={e => e.preventDefault()}>

            {!hideTitle && <Header as="h4">{customTitle}</Header>}

            <Form.Group widths="equal">

                <Form.Input
                    label={
                        <label className="flex justify-between">
                            Password
                        </label>
                    }
                    type="password"
                    value={formState.password.value}
                    onChange={e => formSetter.setPassword(e.target.value)}
                    action={{ content: loadingGenerating ? "Loading" : "Generate", size: "mini", onClick: generateWallet, icon: "refresh" }}
                />

                <Form.Input
                    label="Keystore Download"
                    disabled={!keystoreDL}
                    value={keystoreDL.filename}
                    onChange={setFilename}
                    action={
                        <Button.Group size="mini">
                            <Button
                                content="Download"
                                icon="download"
                                size="mini"
                                color="purple"
                                basic ref={downloadRef}
                                href={keystoreDL ? URL.createObjectURL(keystoreDL.data) : ""} download={keystoreDL.filename}
                            />
                            <Button.Or text="or"/>
                            <Button
                                content={loadingKeystoreLoad ? "Loading..." : "Load"}
                                icon="arrow alternate circle right"
                                labelPosition="right"
                                color="green"
                                basic
                                onClick={loadKeystore}
                            />
                        </Button.Group>
                    }
                />

            </Form.Group>

            <div>{address ? `Created account: ${address}`: ''}</div>
        </Form>
    )

}