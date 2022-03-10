
import React, { useState, useContext, useEffect } from 'react';
import { Button, Header, Segment, Message } from 'semantic-ui-react';
import styles from '../quickstart.module.css';
import { fundAddress } from '../../api/api';
import { MadContext, updateBalance } from '../../context/MadWalletContext';
import { useMadNetAdapter } from '../../adapter/MadNetAdapter';

export function FundWallet({ nextStep }) {

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