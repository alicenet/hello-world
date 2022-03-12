import React from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import styles from '../quickstart.module.css';
import { Link } from '@docusaurus/router';

export function GettingStarted({ nextStep }) {
    return (
        <div>
            <Link className={styles.inDepthLink} to="/docs/intro">
                <Icon name="external" size="small" />
            </Link>
            <Header sub content="Purpose" /> <br />
            This application is for demonstrating the ability to read and write data to AliceNet through CRUD operations ( Create, Read, Update, Delete). <br /> <br />

            After finishing the quickstart steps, you can jump into the sandbox to use the funded wallet to perform CRUD operations
            against the testnetwork for experimentation. <br /> <br />

            Each step will provide a link in the <strong>top right corner</strong> with the &nbsp; <Icon name="external" size="small" /> icon to link to the underlying
            <Link to="/docs/in-depth"> In Depth</Link> page about each specific step.

            <br /><br />

            The <Link to="/docs/in-depth">In Depth</Link> page will describe in detail what is happening on the underlying API, AliceNetJs, with some supporting examples.
            <b /> <br />
            <div className={styles.buttonWrap}>
                <Button color="green" onClick={nextStep} content="Continue"
                    labelPosition="right" icon="arrow right" floated='right' />
            </div>
        </div>
    )
}