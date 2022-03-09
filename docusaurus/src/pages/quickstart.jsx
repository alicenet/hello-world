import React, { useState, useContext, useEffect } from 'react';
import { Button, Grid, Header, Segment, Step, Container, Icon, Message } from 'semantic-ui-react';
import Layout from '@theme/Layout';
import styles from './quickstart.module.css';
import { fundAddress } from '../api/api';

import { MadContext, MadProvider, updateBalance } from '../context/MadWalletContext';
import { GenerateBurnerAccount } from '../components/wallet/Forms/GenerateBurnerAccount';
import { AddValueForm, AddDataStoreForm } from '../components/transaction';
import { useMadNetAdapter } from '../adapter/MadNetAdapter';

const Playground = () => {

    const [step, setStep] = useState(0);
    const gotoStep = (stepNum) => { setStep(stepNum); }
    const nextStep = () => { setStep(s => s + 1); }
    const ctx = useContext(MadContext);

    const { wallets, tokenBalances } = { wallets: ctx.state.accounts, tokenBalances: ctx.state.tokenBalances }

    const hasWalletSetup = wallets.length > 0;
    const hasSufficientBalance = tokenBalances[wallets[0]] && tokenBalances[wallets[0]] > 2000;
    const [hasSentValueTx, setHasSentValueTx] = useState(false);

    const getStepContent = (props) => {
        switch (step) {
            case 0: return <GettingStarted {...props} />;
            case 1: return <GenerateWallet {...props} />;
            case 2: return <FundWallet {...props} />;
            case 3: return <SendValue {...props} hasSentValueTx={hasSentValueTx} markHasSentValue={() => setHasSentValueTx(true)}/>;
            case 4: return <StoreData {...props} />;
        }
    }

    return (
        <Container>

            <div>

                <Step.Group attached="top">

                    <Step active={step == 0} completed={false} onClick={() => gotoStep(0)}>
                        <Step.Content>
                            <Step.Title>Getting Started</Step.Title>
                            <Step.Description>What exactly is "Alice"?</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 1} completed={false} onClick={() => gotoStep(1)}>
                        <Step.Content>
                            <Step.Title>Create A Wallet</Step.Title>
                            <Step.Description>You're going to need one!</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 2} completed={false} disabled={!hasWalletSetup} onClick={() => gotoStep(2)}>
                        <Step.Content>
                            <Step.Title>Get some BOBB</Step.Title>
                            <Step.Description>Time to fund your wallet</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 3} completed={false} disabled={!hasSufficientBalance} onClick={() => gotoStep(3)}>
                        <Step.Content>
                            <Step.Title>Send Value</Step.Title>
                            <Step.Description>Send some MadBytes</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 4} completed={false} disabled={!hasSentValueTx} onClick={() => gotoStep(4)}>
                        <Icon name="database" />
                        <Step.Content>
                            <Step.Title>Store Data</Step.Title>
                            <Step.Description>Write data on chain</Step.Description>
                        </Step.Content>
                    </Step>

                </Step.Group>

                <Segment attached >
                    {getStepContent({ nextStep: nextStep })}
                </Segment>

            </div>

        </Container>
    )

}

function GettingStarted({ nextStep }) {
    return (
        <div>
            <Header sub content="ALICE.NET is. . ." /> <br />
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            <b /> <br />
            <div className={styles.buttonWrap}>
                <Button small color="green" onClick={nextStep} content="Continue"
                    labelPosition="right" icon="arrow right" floated='right' />
            </div>
        </div>
    )
}

function GenerateWallet({ nextStep }) {

    const wallets = useContext(MadContext).state.accounts;

    return (
        <div>
            <Header content="Generate a demo wallet" /> <br />
            For this example, we are going to generate a temporary wallet to use for demonstration purposes. <br />
            When you use our Wallet or aliceJS, you can load your own keys. <br /> <br />
            Go ahead and click the green button below to generate a wallet and see its public address. <br />
            <b /> <br />
            <div style={{ marginTop: "1rem" }}>
                <GenerateBurnerAccount disabled={wallets.length > 0} color="blue" content={wallets.length > 0 ? "Already Generated!" : "Generate Wallet"} />
            </div>
            <Segment secondary basic style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "auto" }}>
                <Icon size="small" name={wallets.length === 0 ? "gem outline" : "gem"} />
                <span style={{ marginRight: "1rem" }}>Wallet Address: </span>
                {wallets.length === 0 ? <div style={{ width: "310px", textAlign: "left" }}> Not Generated </div> :
                    <div style={{ fontWeight: "800" }}>
                        {[wallets[0]]}
                    </div>
                }
            </Segment>
            <div className={styles.buttonWrap}>
                <Button small color={wallets.length === 0 ? "orange" : "green"} onClick={nextStep} disabled={wallets.length === 0}
                    content={wallets.length > 0 ? "Continue" : "Generate a wallet first"}
                    labelPosition="right" icon={wallets.length === 0 ? "x" : "arrow right"} floated='right' />
            </div>
        </div>
    )
}

function FundWallet({ nextStep }) {

    const ctx = useContext(MadContext);
    const madNetAdapter = useMadNetAdapter(ctx);

    const [error, setError] = useState('');

    const { address, balance } = {
        address: ctx.state.accounts[0],
        balance: ctx.state.tokenBalances[ctx.state.accounts[0]]
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadBalance = async () => {
            let [balance] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(address);
            updateBalance(ctx, address, balance);
        }
        loadBalance();
    }, [])

    const callApiForFunding = async () => {
        setLoading(true);
        setError('');

        try {
            let res = await fundAddress(address);
            if (res.error) {
                setError(res.error);
            }
            let [balance] = await madNetAdapter._getMadNetWalletBalanceAndUTXOs(address);
            updateBalance(ctx, address, balance);

            setLoading(false);
        } catch(exception){
            setError(exception);
            setLoading(false);
        }
        
    }

    const BalanceForm = () => {
        return (
            <Segment basic>
                You're about to fund the following address:
                <br /><br />
                <strong>{address}</strong>
                <br /> <br />
                This can take up to a minute or two, so go ahead and press the button to get started.<br />
                Please wait for funding to finish.
                <br />
                <Button loading={loading} style={{ marginTop: "2rem" }} color="green" disabled={balance > 2000} size="small" basic
                    content={balance > 2000 ? "Already funded!" : "Fund Above Address"} onClick={callApiForFunding}
                />
                <div style={{ marginTop: "1rem", color: "grey" }}>
                    Current Balance: <strong>{balance} BOBB</strong>
                </div>
                <br />
                <div>{error && <Message error>There was a problem during the transaction</Message>}</div>
            </Segment>
        )
    }

    return (
        <div>
            <Header content="Fund generated address" /> <br />
            Before you can do anything, we need to get some BOBB tokens. <br />
            Luckily, for this demo we can do that easily by pressing the button below. <br /> <br />
            Outside of this demo, tokens would normally be swapped for on Ethereum. <br />
            <div style={{ marginTop: "1rem" }}>
                <BalanceForm />
            </div>
            <div className={styles.buttonWrap}>
                <Button small color={balance > 2000 ? "green" : "orange"} onClick={nextStep} disabled={!balance || balance < 2000}
                    content={balance > 2000 ? "Continue" : "Insufficient funds"}
                    labelPosition="right" icon={balance < 2000 ? "x" : "arrow right"} floated='right' />
            </div>
        </div>
    )

}

function SendValue({ nextStep, hasSentValueTx, markHasSentValue }) {

    // TODO: This form should have a prefill input with amoung '100' to send a value store transaction to
    // the following address: 01527b9166b4e323384a536996e84f572bab62a0
    // Additionally we should show the address and balance of both wallets participating in this transaction
    // See whiteboarding image from Adam

    const sendValue = () => {
        markHasSentValue();
    }

    return (
        <div>
            <Header content="Send Value" /> <br />
            Now that you have some tokens, lets get rid of some. <br />
            For this example we'll send 100 tokens to a pre-determined address <br />
            After the transaction we'll poll for the demo wallet's balance and the receiver's address<br /> <br />
            <div style={{ marginTop: "1rem" }}>
                <AddValueForm onSendValue={sendValue}/>
            </div>
            <div className={styles.buttonWrap}>
                <Button small color={hasSentValueTx ? "green" : "orange"} onClick={nextStep} disabled={!hasSentValueTx}
                    content={hasSentValueTx ? "Continue" : "Send some tokens first"}
                    labelPosition="right" icon={!hasSentValueTx ? "x" : "arrow right"} floated='right' />
            </div>
        </div>
    )

}

function StoreData() {

    /**
     * This form is going to be for storing and reading a piece of data
     * Give the user two horizontal inputs for index and value, we will only store it for 1 epoch so no duration
     * 
     * Make sure that a user takes the proper steps and is restricted down a pipeline to the following actions:
     * 
     * 1. User must send a data store TX
     * 2. After data stored, the user is prompted to read their data from the chain with "Read Value At Index"
     * - Keep read greyed out until a data store tx is made
     * 
     * See whiteboarding image from Adam for details
     */

    return (
        <div>
            <Header content="Data store transaction" /> <br />
            This form is going to be for storing and reading a piece of data. <br />
            After that, you will be able to read the data from the chain using the form with the "Read Value At Index" field <br />
            <div style={{ marginTop: "1rem" }}>
                <AddDataStoreForm/>
            </div>
        </div>
    )
}

export default function () {

    return (
        <Layout>
            <div className="page-wrap">
                <Grid textAlign="center">
                    <Grid.Column width={16}>
                        <Header as="h2" content="ALICE.NET Quickstart" />
                        For those who want to stop reading, and start exploring
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <MadProvider>
                            <Playground />
                        </MadProvider>
                    </Grid.Column>
                </Grid>
            </div>
        </Layout>
    )

}

