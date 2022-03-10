import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import styles from '../quickstart.module.css';

export function GettingStarted({ nextStep }) {
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