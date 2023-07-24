import { useContext, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import './Regist.less'
import langContext from '../../components/provider/LangProvider/LangContext'
import RegistForm from '../../components/compose/FormRegist'
import DialogsContext from '../../components/provider/DialogProvider/DialogsContext'
import PageBack from '../../components/base/PageBack'
import UserContext from "../../components/provider/UserProvider/UserContext";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router-dom";

function ComponentName () {
    const { lang } = useContext(langContext)
    const { clean } = useContext(DialogsContext)
    const { user, logOut } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // 如果用户已经注册过域名，将会跳转到用户的profile页面
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

    useEffect(() => {
        clean('regist')


    }, [])

    // 如果用户已经登录，离开注册域名页面，将会被强制登出
    useEffect(() => {
        if (user.authToken && !user.domain && location.pathname !== '/regist') {
            logOut()
        }
    },[location.pathname])

    return (
        <Layout>
            <div className='regist-page'>
                <div className='regist-page-bg'></div>
                <div className='regist-page-wrapper'>
                    <div className='regist-page-back'><PageBack /></div>
                    <div className='regist-page-content' >
                        <div className='title'>{ lang['Regist_Title'] }</div>
                        <div className='des' dangerouslySetInnerHTML={ { __html: lang['Domain_Rule'] } }></div>
                        <RegistForm onConfirm={(domain) => {}}></RegistForm>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ComponentName
