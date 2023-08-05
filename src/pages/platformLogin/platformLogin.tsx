import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect} from 'react'
import './PlatformLogin.less'
import { Spinner } from "baseui/spinner";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import {useSearchParams, } from "react-router-dom";
import userContext from "../../components/provider/UserProvider/UserContext";

function platformLogin() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const { showToast, clean, showLoading, openConnectWalletDialog } = useContext(DialogsContext)
    const [searchParams] = useSearchParams()
    const {user, setProfile} = useContext(userContext)

    useEffect(() => {
        async function login() {
            const authToken = searchParams.get('auth')
            const account = searchParams.get('account')
            const loginType = searchParams.get('logintype')

            console.log('auth token', authToken)
            console.log('account', account)
            console.log('loginType', loginType)

            alert(authToken)
            alert(account)
            alert(loginType)

            if (!authToken || !account || !loginType) {
                navigate('/error')
            }

            window.localStorage.setItem('lastLoginType', loginType!)
            window.localStorage.setItem('wa', JSON.stringify([[account, authToken]]))
            if (loginType=== 'email') {
                await setProfile({authToken: authToken!, email: account!})
            } else {
                await setProfile({authToken: authToken!, address: account!})
            }

            const loginFallback = window.localStorage.getItem('loginFallback')
            if (loginFallback) {
                window.localStorage.removeItem('loginFallback')
                window.location.href = loginFallback
            } else {
                navigate('/')
            }
        }

        login()
    }, [])

    return (<div className={'platform-login-page'}>
        <img src="/images/logo.svg" alt="" width={200}/>
        <Spinner $size={30} $color={'#6cd7b2'} $borderWidth={4} />
        <div className={'text'}>Login...</div>
    </div>)
}

export default platformLogin
