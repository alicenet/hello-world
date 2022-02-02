import { Container } from 'semantic-ui-react';

export function PageWrap({ children }) {

    return (

        <Container className="flex grow justify-center items-center">

            {children}

        </Container>

    )

}