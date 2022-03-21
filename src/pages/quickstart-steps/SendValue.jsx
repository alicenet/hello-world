import React, { useContext } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import styles from '../quickstart.module.css';
import { MadContext, updateTokensSentStatus } from '../../context/MadWalletContext';
import { AddValueForm } from '../../components/transaction';
import Link from '@docusaurus/Link';

export default function SendValue({ nextStep }) {

    // This form should have a prefill input with amoung '100' to send a value store transaction to
    // the following address: 01527b9166b4e323384a536996e84f572bab62a0
    // Additionally we should show the address and balance of both wallets participating in this transaction

    // const ctx = useContext(MadContext);
    // TODO Remove this after..
    const ctx = { state: useContext(MadContext) };

    const { tokensSent } = ctx.state;

    const onSendValue = () => {
        updateTokensSentStatus(ctx, true);
    }

    return (
        <div style={{ textAlign: "left" }}>
            <Link className={styles.inDepthLink} to="/docs/ui-in-depth/send-value" target="_blank">
                <Icon name="external" size="small" />
            </Link>
            Sending value isn't a CRUD action, though it will let us make sure everything is working correctly and demonstrate a basic transaction with AliceNet. <br /><br />
            For this example we'll send 100 tokens to a pre-determined address below. <br /> <br />
            <div style={{ marginTop: "1rem" }}>
                <AddValueForm onSendValue={onSendValue} />
            </div>
            <div className={styles.buttonWrap}>
                <Button color={tokensSent ? "green" : "orange"} onClick={nextStep} disabled={!tokensSent}
                    content={tokensSent ? "Continue" : "Send some tokens first"}
                    labelPosition="right" icon={!tokensSent ? "x" : "arrow right"} floated='right' />
            </div>
        </div>
    )

}