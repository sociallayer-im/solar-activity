import { styled, useStyletron } from 'baseui'

const Logo = styled('a', ({ $theme }) => ({
    width: '102px',
    height: '32px'
}))

function PageLogo () {
    const [css] = useStyletron()
    const imgStyle = {
        width: '102px',
        height: '32px',
        display: 'block'
    }

    return (<Logo href='/'>
            <img className={css(imgStyle)} src="/images/logo.svg" alt=""/>
        </Logo>)
}

export default PageLogo
