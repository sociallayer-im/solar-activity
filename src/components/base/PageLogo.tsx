import { styled, useStyletron } from 'baseui'
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import HomePageSwitcher from "../compose/HomePageSwitcher/HomePageSwitcher";

const Logo = styled('div', ({ $theme }) => ({
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: $theme.colors.contentPrimary,
    flexDirection: 'row',
}))

function PageLogo () {
    const [css] = useStyletron()
    const imgStyle = {
        width: '32px',
        height: '32px',
        display: 'block',
        marginRight: '8px',
    }

    const svgStyle = {
        minWidth: '39px',
    }

    const splitStyle = {
        minWidth: '1px',
        height: '12px',
        backgroundColor: '#999',
        marginRight: '8px',
    }

    const home = import.meta.env.VITE_SOLAS_HOME
    const navigate = useNavigate()
    return (<Logo>
            <Link to={'/'}><img className={css(imgStyle)} src="/images/header_logo.svg" alt=""/></Link>
            <HomePageSwitcher />
    </Logo>)
}

export default PageLogo
