import { Segment } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';

export function Lander() {
    const navigate = useNavigate();

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
                <div className="text-big font-bold cursor-pointer" onClick={() => navigate('/wallet')}>
                    Add account
                </div>
            </Segment>

        </div>

    )

}