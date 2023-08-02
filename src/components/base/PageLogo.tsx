import { styled, useStyletron } from 'baseui'

const Logo = styled('a', ({ $theme }) => ({
    width: '102px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: $theme.colors.contentPrimary,
}))

function PageLogo () {
    const [css] = useStyletron()
    const imgStyle = {
        width: '102px',
        height: '32px',
        display: 'block',
        marginRight: '8px',
    }

    return (<Logo href='/'>
            <img className={css(imgStyle)} src="/images/logo.svg" alt=""/>
            <div>Event</div>
        </Logo>)
}

export default PageLogo
