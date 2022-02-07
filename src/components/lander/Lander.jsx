import { Segment } from "semantic-ui-react";
import { useDispatch } from 'react-redux'
import { ADAPTER_ACTIONS } from 'redux/actions';

export function Lander() {

    const dispatch = useDispatch()

    return (

        <div>
            
            <Segment className="text-left">

                <div className="absolute top-2 right-4"/>

                <div className="text-2xl font-bold">
                    Hello World
                    <div className="text-sm text-gray-500">
                        MadNetJS
                    </div>
                </div>
            </Segment>

            <Segment className="text-left">
                <div className="text-big font-bold cursor-pointer" onClick={() => dispatch(ADAPTER_ACTIONS.initMadNet())}>
                    Init connection
                </div>
            </Segment>

        </div>

    )

}