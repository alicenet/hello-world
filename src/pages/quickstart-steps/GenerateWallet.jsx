import React, { useContext } from 'react';
import { Button, Header, Segment, Icon, Message, Checkbox } from 'semantic-ui-react';
import styles from '../quickstart.module.css';
import { MadContext, checkForCookieWallet } from '../../context/MadWalletContext';
import { GenerateBurnerAccount } from '../../components/wallet/Forms/GenerateBurnerAccount';
import { Link } from '@docusaurus/router';
import { useCookies } from 'react-cookie'

export function GenerateWallet({ nextStep }) {

    const ctx = useContext(MadContext);
    const wallets = ctx.state.accounts;
    const cookies = useCookies();

    // Try to load wallet if we didn't yet.
    React.useEffect(() => {
        checkForCookieWallet(ctx, cookies);
    }, [])

    return (
        <div style={{textAlign:"left"}}>
            <Link className={styles.inDepthLink} to="/docs/ui-in-depth/create-a-wallet" target="_blank">
                <Icon name="external" size="small" />
            </Link>
            For this example, we are going to generate a temporary wallet to use for demonstration purposes. <br /> <br />
            When you use AliceNet Wallet or AliceNetJS, you can load your own private keys, but for this application we recommend using a new set. <br /> <br />
            Click the button below to generate a wallet and see its public address. <br />
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
            <div style={{ fontSize: "11px" }}>
                The above generated address will be used throughout this demo and in the sandbox panel
            </div>
            <div className={[styles.buttonWrap, styles.warningWrap].join(" ")}>
                <Button color={wallets.length === 0 ? "orange" : "green"} onClick={nextStep} disabled={wallets.length === 0}
                    content={wallets.length > 0 ? "Continue" : "Generate a wallet first"}
                    labelPosition="right" icon={wallets.length === 0 ? "x" : "arrow right"} floated='right' />
            </div>
        </div>
    )
}