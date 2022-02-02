import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { APPLICATION_ACTIONS } from 'redux/actions';

export default function ToggleDebugModeButton() {

    const { debugMode } = useSelector(state => ({ debugMode: state.app.debugMode }))
    const dispatch = useDispatch();

    const toggle = () => {
        dispatch(APPLICATION_ACTIONS.setDebugMode(!debugMode))
    }

    return (
        <Button size="small" basic
            content={"DebugMode: " + debugMode}
            onClick={toggle}
        />
    )

}