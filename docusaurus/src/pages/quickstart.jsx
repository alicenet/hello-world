import React from 'react';
import { Button, Grid, Header, Segment, Step, Container, Icon } from 'semantic-ui-react';
import Layout from '@theme/Layout';
import styles from './quickstart.module.css';

import { MadContext, MadProvider } from '../context/MadWalletContext';
import { GenerateBurnerAccount } from '../components/wallet/Forms/GenerateBurnerAccount';

const Playground = () => {

    const [step, setStep] = React.useState(1);
    const gotoStep = (stepNum) => { setStep(stepNum); }
    const nextStep = () => { setStep(s => s + 1); }

    const hasWalletSetup = false;

    const getStepContent = (props) => {
        switch (step) {
            case 0: return <GettingStarted {...props} />;
            case 1: return <GenerateWallet {...props} />;
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

                    <Step active={step == 3} completed={false} disabled={!hasWalletSetup} onClick={() => gotoStep(3)}>
                        <Step.Content>
                            <Step.Title>Send Value</Step.Title>
                            <Step.Description>Send some MadBytes</Step.Description>
                        </Step.Content>
                    </Step>

                    <Step active={step == 4} completed={false} disabled={!hasWalletSetup} onClick={() => gotoStep(4)}>
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
                <Button small color="green" onClick={nextStep} content="Lets go!" floated='right' />
            </div>
        </div>
    )
}

function GenerateWallet({ nextStep }) {

    return (
        <div>
            <Header sub content="Generate a demo wallet" /> <br />
            For this example, we are going to generate a temporary wallet to use for demonstration purposes. <br />
            When you use our Wallet or aliceJS, you can load your own keys. <br /> <br />
            Go ahead and click the green button below to generate a wallet and see its public address. <br />
            <b /> <br />
            <div style={{ marginTop: "1rem" }}>
                <GenerateBurnerAccount color="blue" content="Generate Wallet" />
            </div>
            <div className={styles.buttonWrap}>
                <Button small color="green" onClick={nextStep} content="Nice, next step!" floated='right' />
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

