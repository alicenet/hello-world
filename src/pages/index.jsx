import React, { useState, useContext } from 'react';
import { Grid, Header, Segment, Step, Container, Icon } from 'semantic-ui-react';
import Layout from '@theme/Layout';
import { MadContext, MadProvider, checkForCookieWallet } from '../context/MadWalletContext';
import GettingStarted from './quickstart-steps/GettingStarted';
import GenerateWallet from './quickstart-steps/GenerateWallet';
import FundWallet from './quickstart-steps/FundWallet';
import SendValue from './quickstart-steps/SendValue'
import StoreData from './quickstart-steps/StoreData'

import 'semantic-ui-css/semantic.min.css'
import { useCookies } from 'react-cookie';
import BrowserOnly from '@docusaurus/BrowserOnly';

const QuickStart = () => {

    const [step, setStep] = useState(0);
    const gotoStep = (stepNum) => { setStep(stepNum); }
    const nextStep = () => { setStep(s => s + 1); }
    const ctx = useContext(MadContext);

    const [cookies] = useCookies()

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

    // Try to load wallet if possible
    React.useEffect(() => {
        checkForCookieWallet(ctx, cookies);
    }, [step])

    console.log(Container)

    return (
        <Container>

            <div>

                <Step.Group attached="top">

                    <Step active={step == 0} completed={false} onClick={() => gotoStep(0)}>
                        <Step.Content>
                            <Step.Title>Getting Started</Step.Title>
                            <Step.Description>What is this for?</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 1} completed={false} onClick={() => gotoStep(1)}>
                        <Step.Content>
                            <Step.Title>Create A Test Wallet</Step.Title>
                            <Step.Description>Required to hold tokens</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 2} completed={false} disabled={!hasWalletSetup} onClick={() => gotoStep(2)}>
                        <Step.Content>
                            <Step.Title>Get some tokens</Step.Title>
                            <Step.Description>CRUD requires tokens</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 3} completed={false} disabled={!hasSufficientBalance} onClick={() => gotoStep(3)}>
                        <Step.Content>
                            <Step.Title>Send Value</Step.Title>
                            <Step.Description>Send some tokens</Step.Description>
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

        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => {
                return (
                    <Layout>
                        <div className="page-wrap">
                            <Grid textAlign="center">
                                <Grid.Column width={16}>
                                    <Header as="h2" content="AliceNet CRUD Quickstart" />
                                </Grid.Column>
                                <Grid.Column width={16}>
                                    <MadProvider>
                                        <QuickStart />
                                    </MadProvider>
                                </Grid.Column>
                            </Grid>
                        </div>
                    </Layout>
                )
            }}
        </BrowserOnly>
    )

}

