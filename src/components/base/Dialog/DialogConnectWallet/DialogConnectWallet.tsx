import {Connector, useAccount, useConnect, useSigner, useDisconnect } from 'wagmi'
import './DialogConnectWallet.less'
import {useContext, useEffect, useRef} from 'react'
import LangContext from '../../../provider/LangProvider/LangContext'
import { setLastLoginType } from '../../../../utils/authStorage'
import { useNavigate } from 'react-router-dom'
import DialogsContext from '../../../provider/DialogProvider/DialogsContext'
import UserContext from '../../../provider/UserProvider/UserContext'

interface DialogConnectWalletProps {
    handleClose: (...rest: any[]) => any
}

function DialogConnectWallet (props: DialogConnectWalletProps) {
    const unloading_1 = useRef<any>(null)
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect({
        onSettled: () => {
            if (unloading_1) {
                unloading_1.current?.()
                unloading_1.current = null
            }
        }
    })
    const { disconnect } = useDisconnect()
    const { lang } = useContext(LangContext)
    const { isDisconnected } = useAccount()
    const navigate = useNavigate()
    const { clean, showLoading } = useContext(DialogsContext)
    const { user } = useContext(UserContext)


    useEffect(() => {
        if (user.id) {
            props.handleClose()
        }
    }, [user.id])

    useEffect(() => {
        if (isLoading) {
            unloading_1.current = showLoading()
        } else {
            unloading_1.current?.()
            unloading_1.current = null
        }
    }, [isLoading])

    const handleConnectWallet = (connector: Connector) => {
        // test code to trace the error
        if (isLoading) {
            console.error('Connector is loading')
        }

        if (error) {
            console.error('connector error: ' + error)
        }

        if (!isDisconnected) {
            disconnect()
        }

        window.localStorage.removeItem('wagmi.cache')

       setTimeout(() => {
           setLastLoginType('wallet')
           connect({ connector })
       },500)
    }

    const handleConnectEmail = () => {
        window.localStorage.setItem('fallback', window.location.href)
        clean()
        navigate('/login')
    }

    const handlePhoneLogin = () => {
        window.localStorage.setItem('fallback', window.location.href)
        clean()
        navigate('/login-phone')
    }

    const loginWithSolar = () => {
        clean()
        const loginUrl = import.meta.env.VITE_SOLAS_HOME
        window.location.href = `${loginUrl}/platform/login?from=${window.location.protocol}//${window.location.host}/platform/login`
    }

    const arrowPhoneLogin = import.meta.env.VITE_ALLOW_PHONE_LOGIN === 'true'

    return (
        <div className='dialog-connect-wallet'>
            {connectors.map((connector) => (
                <div className={ (!connector.ready || isLoading)  ? 'connect-item disable': 'connect-item' }
                    key={connector.id}
                    onClick={() => handleConnectWallet(connector)}>
                    <img src={ `/images/${connector.name.toLowerCase()}.png` } alt={connector.name} />
                    <div className='connect-name'>{connector.name}</div>
                    <div className='connect-des'>
                        {connector.name === 'MetaMask' ? lang['Wallet_Intro_MetaMask'] : lang['Wallet_Intro_WalletConnect']}
                    </div>
                </div>
            ))}
            <div className='connect-item' onClick={ handleConnectEmail }>
                <img src="/images/email.svg" alt="email"/>
                <div className='connect-name'>Email</div>
                <div className='connect-des'>{ lang['Login_alert'] }</div>
            </div>
            { arrowPhoneLogin &&
                <div className='connect-item' onClick={ handlePhoneLogin }>
                    <img src="/images/phone_login.png" alt="email"/>
                    <div className='connect-name'>Phone</div>
                    <div className='connect-des'>{ lang['Login_Phone_Title'] }</div>
                </div>
            }
        </div>
    )
}

export default DialogConnectWallet
