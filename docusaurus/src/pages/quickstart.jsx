import React, { useState, useContext } from 'react';
import { Grid, Header, Segment, Step, Container, Icon } from 'semantic-ui-react';
import Layout from '@theme/Layout';
import { MadContext, MadProvider } from '../context/MadWalletContext';
import { GettingStarted, GenerateWallet, FundWallet, SendValue } from './quickstart-steps';

const Playground = () => {

    const [step, setStep] = useState(0);
    const gotoStep = (stepNum) => { setStep(stepNum); }
    const nextStep = () => { setStep(s => s + 1); }
    const ctx = useContext(MadContext);

    const { wallets, tokenBalances, tokensSent } = { wallets: ctx.state.accounts, tokenBalances: ctx.state.tokenBalances, tokensSent: ctx.state.tokensSent }

    const hasWalletSetup = wallets.length > 0;
    const hasSufficientBalance = tokenBalances[wallets[0]] && tokenBalances[wallets[0]] > 2000;

    const getStepContent = (props) => {
        switch (step) {
            case 0: return <GettingStarted {...props} />;
            case 1: return <GenerateWallet {...props} />;
            case 2: return <FundWallet {...props} />;
            case 3: return <SendValue {...props} />;
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

                    <Step active={step == 4} completed={false} disabled={!tokensSent} onClick={() => gotoStep(4)}>
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

