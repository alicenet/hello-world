import React, { useContext } from 'react';
import { Button, Header, Segment, Icon } from 'semantic-ui-react';
import styles from '../quickstart.module.css';
import { MadContext } from '../../context/MadWalletContext';
import { GenerateBurnerAccount } from '../../components/wallet/Forms/GenerateBurnerAccount';

export function GenerateWallet({ nextStep }) {

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