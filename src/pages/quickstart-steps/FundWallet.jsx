
import React, { useState, useContext, useEffect } from 'react';
import { Button, Segment, Message, Icon } from 'semantic-ui-react';
import { get } from '../../api/api';
import { MadContext, updateBalance } from '../../context/MadWalletContext';
import Link from '@docusaurus/Link';
import styles from '../quickstart.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function FundWallet({ nextStep }) {

    const ctx = useContext(MadContext);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    let balanceInterval = React.useRef(null);

    const { address, balance } = {
        address: ctx.state.accounts[0],
        balance: ctx.state.tokenBalances[ctx.state.accounts[0]]
    };

    const [loading, setLoading] = useState(false);
    const { siteConfig } = useDocusaurusContext();

    useEffect(() => {
        const loadBalance = async () => {
            await updateBalance(ctx, address);
        }
        loadBalance();

        return () => {
            clearInterval(balanceInterval);
        }
    }, [balanceInterval])

    const callApiForFunding = async () => {
        setLoading(true);
        setError('');
        try {
            let res = await get(siteConfig.customFields.TEST_FUND_API + '/faucet/' + address);
            if (res.error) {
                setError(res.error);
            }
            balanceInterval = setInterval( () => updateBalance(ctx, address), 7500);
            setSuccess(true);
            setLoading(false);
        } catch (exception) {
            setError(exception);
            setLoading(false);
        }

    }

    const BalanceForm = () => {
        return (
            <Segment color={balance >= 2000 ? "green" : "yellow"}>
                You're about to fund the following address: <strong>{address}</strong>
                <br /> <br />
                This can take a few minutes, so go ahead and press the button to get started.<br /> <br />
                Please wait for funding to finish.
                <br />
                <Button loading={loading} style={{ marginTop: "2rem" }} color="green" disabled={balance >= 2000 || success} size="small" basic
                    content={balance >= 2000 ? "Already funded!" : "Fund Above Address"} onClick={callApiForFunding}
                />
                <div style={{ marginTop: "1rem", color: "grey" }}>
                    Current Balance: <strong>{balance} Tokens</strong>
                </div>
                <br />
                <div>{error && <Message error>There was a problem during the funding request {error.message}</Message>}</div>
                <div>{success && <Message success>Your funding request has been queued. It can take several minutes for your request to be processed.</Message>}</div>
            </Segment>
        )
    }

    return (
        <div style={{ textAlign: "left" }}>
            <Link className={styles.inDepthLink} to="/docs/ui-in-depth/fund-a-wallet" target="_blank">
                <Icon name="external" size="small" />
            </Link>
            Before you can perform CRUD actions, you need some tokens. <br />
            For this demo we can do that easily by pressing the button below. <br /> <br />
            Outside of this demo, tokens would normally be swapped for on Ethereum. <br /> <br />

            Don't forget, you can come back to this page to request more tokens if your balance falls below 2000.

            <div style={{ marginTop: "1rem" }}>
                <BalanceForm />
            </div>
            <div className={styles.buttonWrap}>
                <Button color={balance >= 2000 ? "green" : "orange"} onClick={nextStep} disabled={!balance || balance < 2000}
                    content={balance >= 2000 ? "Continue" : "Insufficient funds"}
                    labelPosition="right" icon={balance < 2000 ? "x" : "arrow right"} floated='right' />
            </div>
        </div>
    )

}
