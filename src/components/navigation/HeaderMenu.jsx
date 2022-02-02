import { Menu } from "semantic-ui-react";
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as AppLogo } from 'assets/Logo.svg';
import ToggleDebugModeButton from "components/buttons/ToggleDebugModeButton";

export function HeaderMenu() {

    const MiddleMenu = () => {

        const location = useLocation();
        const isActive = path => (location.pathname === path)

        return (
            <Menu secondary pointing className="space-x-8 flex items-center" stackable >
                <Menu.Item as={Link} to="/" content="Home" active={isActive('/')}/>
                <Menu.Item as={Link} to="/about" content="About" active={isActive('/about')} />
                <Menu.Item as={Link} to="/app" content="App" active={isActive('/app')} />
            </Menu>
        )
    }

    const Logo = () => {
        return (
            <div className="w-20">
                <AppLogo />
            </div>
        )
    }

    return (

        <div className="flex justify-between items-center w-full px-6 bg-gray-100/50">

            <div className="hidden md:block flex items-center">
                <Logo />
            </div>

            <div className="flex items-center">
                <MiddleMenu />
            </div>

            <div className="flex items-center">
                <ToggleDebugModeButton />
            </div>

        </div>

    )

}