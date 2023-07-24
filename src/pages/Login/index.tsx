import Layout from '../../components/Layout/Layout'
import './Login.less'
import EmailLoginForm from '../../components/compose/FormEmailLogin'
import CodeInputForm from '../../components/compose/FormCodeInput'
import LangContext from '../../components/provider/LangProvider/LangContext'
import {useContext, useEffect, useState} from 'react'
import solas, { EmailLoginRes } from '../../service/solas'
import UserContext from '../../components/provider/UserProvider/UserContext'
import { setAuth } from '../../utils/authStorage'
import { useNavigate } from 'react-router-dom'
import usePageHeight from '../../hooks/pageHeight'

function Login () {
    const { lang } = useContext(LangContext)
    const [loginEmail, setLoginEmail] = useState('')
    const { setUser, user, emailLogin } = useContext(UserContext)
    const navigate = useNavigate()
    const { heightWithoutNav } = usePageHeight()

    const setEmailAuth = async (loginRes: EmailLoginRes) => {
        window.localStorage.setItem('lastLoginType', 'email')
        setAuth(loginRes.email, loginRes.auth_token)

        await emailLogin()
    }

    useEffect(() => {
        if (user.domain) {
            const fallBack = window.localStorage.getItem('fallback')

            if (fallBack) {
                const path = fallBack.replace(window.location.origin, '')
                window.localStorage.removeItem('fallback')
                navigate(path)
            } else {
                navigate(`/profile/${user.userName}`)
            }
        }
    }, [user.domain])

    return <Layout>
        <div className='login-page'>
            <div className='login-page-bg'></div>
            <div className='login-page-wrapper' style={{height: `${heightWithoutNav}px`}}>
                { !loginEmail ?
                    <div className='login-page-content' >
                        <div className='title'>{ lang['Login_Title'] }</div>
                        <div className='des'>{ lang['Login_alert'] }</div>
                        <EmailLoginForm onConfirm={(email) => { setLoginEmail(email)} } />
                    </div>
                    :
                    <div className='login-page-content' >
                        <div className='title'>{ lang['Login_input_Code_title'] }</div>
                        <div className='des'>{ lang['Login_input_Code_des']([loginEmail]) }</div>
                        <CodeInputForm loginEmail={ loginEmail } onConfirm={(loginRes) => { setEmailAuth(loginRes) } } />
                    </div>
                }
            </div>
        </div>
    </Layout>
}

export default Login
