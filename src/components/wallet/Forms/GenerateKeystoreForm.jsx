import React, { useState, useRef } from 'react'
import { useFormState } from 'components/hooks';
import { Button, Checkbox, Form, Header, Icon, Popup } from 'semantic-ui-react';
import utils from 'utils';

/**
 * @prop { Function (keystore<JSON>, password<String>) => {...} } submitFunction -- Additional function to call after pressing "Load This Keystore" -- Most likely a redux action or history push, etc
 * @prop { Boolean } inline -- Compact the form into a single line?
 * @prop { String } defaultPassword --Default password to use? ( Mainly for debugging )
 * @prop { Boolean } showPassword -- Show the password in plain text?
 * @prop { String } customTitle -- Use a custom form title?
 * @prop { String } hideTitle -- Hide the title?
 */
export function GenerateKeystoreForm(
    {
        cancelText,
        cancelFunction,
        submitText,
        submitFunction,
        inline,
        defaultPassword = "",
        customTitle = "Generate Keystore",
        hideTitle
    }
) {
    const { curveTypes } = utils.wallet;
    const [formState, formSetter, onSubmit] = useFormState([
        { name: 'password', type: 'password', value: defaultPassword, isRequired: true },
        { name: 'verifiedPassword', display: 'Verify Password', type: 'verified-password', isRequired: true },
        { name: 'walletName', type: 'string', isRequired: true },
    ]);
    const [showPassword, setShowPassword] = useState(false);
    const [keystoreDL, setKeystoreDL] = useState(false);
    const [curveType, setCurveType] = useState(curveTypes.SECP256K1);
    const toggleCurveType = () => setCurveType(s => (s === curveTypes.SECP256K1 ? curveTypes.BARRETO_NAEHRIG : curveTypes.SECP256K1));

    const downloadRef = useRef();

    const loadKeystore = () => {
        let fr = new FileReader();
        fr.readAsText(keystoreDL.data)
        fr.onload = (res) => {
            let ksJSON = JSON.parse(res.target.result);
            if (submitFunction) {
                submitFunction(ksJSON, formState.password.value, formState.walletName.value);
            }
        }
    }

    const generateWallet = async () => {
        let newStoreBlob = await utils.wallet.generateKeystore(true, formState.password.value, curveType);
        setKeystoreDL({
            filename: "MadWallet_" + Date.now() + ".json",
            data: newStoreBlob
        });
        downloadRef.current.href = URL.createObjectURL(newStoreBlob);
    }

    const setFilename = async () => {
        setKeystoreDL(s => ({
            filename: "a",
            ...s
        }));
    }

    ////////////////////
    // Inline Version // -- Deprecated -- DEBUG Menu only
    ////////////////////
    if (inline) {
        return (
            <Form size="mini" onSubmit={e => e.preventDefault()}>

                {!hideTitle && <Header as="h4">{customTitle}</Header>}

                <Form.Input
                        label={
                            <>
                                <label className="inline text-left">Wallet Name</label>
                                <Popup
                                    size="mini"
                                    position="right center"
                                    trigger={
                                        <Icon name="question circle" className="ml-1" />
                                    }
                                    content="How this wallet will be referenced"
                                />
                            </>
                        }
                        type="text" value={formState.walletName.value}
                        onChange={e => formSetter.setWalletName(e.target.value)}
                        error={!!formState.walletName.error && { content: formState.walletName.error }}
                    />

                <Form.Group widths="equal">

                    <Form.Input
                        label={
                            <label className="flex justify-between">
                                Password
                                <Checkbox
                                    checked={curveType === curveTypes.BARRETO_NAEHRIG}
                                    onChange={toggleCurveType}
                                    label={<label className={"labelCheckbox"}>Use BN Curve</label>}
                                    className="flex justify-center items-center text-xs uppercase font-bold relative -top-0"
                                />
                            </label>
                        }
                        type={showPassword ? "text" : "password"} value={formState.password.value}
                        onChange={e => formSetter.setPassword(e.target.value)}
                        action={{ content: "Generate", size: "mini", onClick: generateWallet, icon: "refresh" }}
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
                                    content="Load"
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

            </Form>
        )
    }

    /////////////////////
    // Column Version //
    ////////////////////
    return (<>

        <Form size="mini" className="w-96 mb-12 mini-error-form text-left">

            {!hideTitle && <Header as="h4">{customTitle}</Header>}

            <Form.Input
                label={
                    <>
                        <label className="inline text-left">Wallet Name</label>
                        <Popup
                            size="mini"
                            position="right center"
                            offset={"4,2"}
                            trigger={
                                <Icon name="question circle" className="ml-1" />
                            }
                            content="How this wallet will be referenced"
                        />
                    </>
                }
                type="text" value={formState.walletName.value}
                onChange={e => formSetter.setWalletName(e.target.value)}
                error={!!formState.walletName.error && { content: formState.walletName.error }}
            />

            <Form.Input
                size="small"
                label="Keystore Password"
                icon={<Icon name={showPassword ? "eye" : "eye slash"} onClick={() => setShowPassword(s => !s)} link/>}
                type={showPassword ? "string" : "password"} value={formState.password.value}
                onChange={e => formSetter.setPassword(e.target.value)}
                error={!!formState.password.error && { content: formState.password.error }}
            />

            <Form.Input
                size="small"
                label={
                    <label className="flex justify-between">
                        Verify Keystore Password
                        <Checkbox
                            checked={curveType === curveTypes.BARRETO_NAEHRIG}
                            onChange={toggleCurveType}
                            label={
                                <>
                                    <label className={"labelCheckbox"}>Use BN Curve</label>
                                    <Popup
                                        size="mini"
                                        position="right center"
                                        offset={"0,2"}
                                        trigger={<Icon name="question circle" className="ml-1 mb-1.5" style={{ marginRight: "-.035rem" }}/>}
                                        content="Force the address generation by BN Curve. This will be detected if it is in the keystore"
                                    />
                                </>
                            }
                            className="flex justify-center items-center text-xs uppercase font-bold relative -top-0"
                        />
                    </label>
                }
                type={showPassword ? "string" : "password"} value={formState.verifiedPassword.value}
                onChange={e => formSetter.setVerifiedPassword(e.target.value)}
                action={{ content: "Generate", size: "mini", onClick: () => onSubmit(generateWallet), icon: "refresh", className: "w-28" }}
                error={!!formState.verifiedPassword.error && { content: formState.verifiedPassword.error }}
            />

            <Form.Input
                label="Keystore Download"
                disabled={!keystoreDL}
                value={keystoreDL.filename}
                action={{
                    content: "Download",
                    icon: "download",
                    size: "mini",
                    ref: downloadRef,
                    href: keystoreDL ? URL.createObjectURL(keystoreDL.data) : "",
                    download: keystoreDL.filename,
                    className: "w-28",
                }}
            />

            <Form.Button fluid size="small" disabled={!keystoreDL} color="green" basic content={submitText} onClick={loadKeystore} icon="thumbs up"/>
            <Form.Button fluid size="small" basic content={cancelText} color="orange" onClick={cancelFunction} icon="x"/>

        </Form>

    </>)

}