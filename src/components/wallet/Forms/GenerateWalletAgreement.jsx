import React from "react";
import { Message, Checkbox, Header, List } from 'semantic-ui-react';
import { MadContext } from "../../../context/MadWalletContext";

/**
 * @component
 * @prop { Boolean } tickState - State variable from useState hook -- Is the checkbox ticked?
 * @prop { Function } setTickState - setTickState function from a useState hook 
 * @returns {React.Component}
 */
export function GenerateWalletAgreement({ tickState, setTickState }) {

    const colorProp = tickState ? { color: "green" } : {};
    const wallets = React.useContext(MadContext).state.accounts;
    
    if (wallets.length > 0) {
        return ""
    }

    return (
        <Message warning size="small" {...colorProp}>
            Ticking the checkbox means you consent and are aware of the following terms: <br /> <br />

            <List bulleted>
                <List.Item>
                    For my safety, I will not try to use the generated wallet outside of this demo and I acknowledge it is stored insecurely for demo purposes only <br />
                </List.Item>
                <List.Item>
                    I acknowledge and authorize that any demo wallet and demo progress will be stored as a temporary cookies on my computer for this session.<br />
                </List.Item>
            </List>

            Please note that we do not use cookies for any other purpose on this application other than to ease the user experience.

            <br /><br />

            <Checkbox label="I Agree" checked={tickState} onClick={(e, data) => { setTickState(data.checked); console.log(data.checked) }} />

            <Header as="h5" style={{ marginTop: "1rem" }}>
                {tickState ? "Thanks! -- You're ready to generate a test wallet" : "Please agree to the above terms"}
            </Header>

        </Message>
    )

}