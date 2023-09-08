import {ReactNode, useContext, useEffect, useState} from 'react'
import {useAccount, useDisconnect, useSigner} from 'wagmi'
import UserContext from './UserContext'
import DialogsContext from '../DialogProvider/DialogsContext'
import * as AuthStorage from '../../../utils/authStorage'
import solas, {Group} from '../../../service/solas'
import { useNavigate } from 'react-router-dom'
import useEvent, {EVENT} from '../../../hooks/globalEvent'

import solaExtensionLogin from '../../../service/ExtensionLogin'
import {setAuth} from "../../../utils/authStorage";

export interface User {
    id: number | null,
    userName: string | null,
    avatar: string | null,
    domain: string | null,
    email: string | null,
    wallet: string | null,
    twitter: string | null,
    authToken: string | null,
    nickname: string | null,
}

export interface UserContext {
    user: User
    setUser: (data: Partial<Record<keyof User, any>>) => any
    logOut: () => any
}

export interface UserProviderProps {
    children: ReactNode
}

const emptyUser: User = {
    id: 0,
    userName: null,
    avatar: null,
    domain: null,
    email: null,
    wallet: null,
    twitter: null,
    authToken: null,
    nickname: null,
}

function UserProvider (props: UserProviderProps) {
    const [userInfo, setUserInfo] = useState<User>(emptyUser)
    const { address, isConnecting, isDisconnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { data } = useSigner()
    const { showToast, clean, showLoading } = useContext(DialogsContext)
    const navigate = useNavigate()
    const [newProfile, _] = useEvent(EVENT.profileUpdate)

    const setUser = (data: Partial<Record<keyof User, any>>) => {
        const copyUserInfo = { ...userInfo , ...data }
        setUserInfo(copyUserInfo)
    }


    const setProfile = async (props: { authToken: string, address?: string | undefined, email?: string | undefined }) => {
        const unloading = showLoading()
        try {
            const profileInfo = await solas.getProfile(props)
            console.log('Profile: ', profileInfo)
            setUser({
                wallet: profileInfo?.address,
                id: profileInfo?.id! || null,
                twitter: profileInfo?.twitter || null,
                domain: profileInfo?.domain || null,
                userName: profileInfo?.domain ? profileInfo?.domain.split('.')[0]: null,
                email:  profileInfo?.email || null,
                avatar: profileInfo?.image_url || null,
                authToken: props.authToken,
                nickname: profileInfo?.nickname || null
            })

            if (!profileInfo || !profileInfo.domain) {
                // 如果当前页面是’/login‘说明是邮箱登录，fallback已经在点击邮箱登录按钮的时候设置了:
                // src/components/dialogs/ConnectWalletDialog/ConnectWalletDialog.tsx  42行

                if (!window.location.href.includes('/login')) {
                    window.localStorage.setItem('fallback', window.location.href)
                }
                clean()
                setTimeout(() => {
                    navigate('/regist')
                },100)
                return
            }

            // if (window.location.pathname === '/') {
            //     navigate(`/profile/${profileInfo.username}`)
            // }

            // Float Extension Login
            solaExtensionLogin.login(profileInfo.id.toString(), profileInfo.domain,props.authToken, profileInfo.image_url || '')
           unloading()
        } catch (e: any) {
            console.error('login fail [setProfile]: ', e)
            showToast('Login fail', 3000)
            unloading()
            logOut()
        }
    }

    const logOut = () => {
        disconnect()

        if (userInfo.wallet) {
            AuthStorage.burnAuth(userInfo.wallet)
        }

        if (userInfo.email) {
            AuthStorage.burnAuth(userInfo.email)
        }

        AuthStorage.setLastLoginType(null)
        window.localStorage.removeItem('isSolarLogin')
        window.localStorage.removeItem('wagmi.wallet')
        window.localStorage.removeItem('wagmi.store')
        window.localStorage.removeItem('wagmi.cache')
        window.localStorage.removeItem('wagmi.connected')
        setUserInfo(emptyUser)
    }

    const emailLogin = async () => {
        const loginType = AuthStorage.getLastLoginType()
        if (!loginType) return
        if (loginType !== 'email') return

        console.log('Login ...')
        console.log('Login type: ', loginType)

        const emailAuthInfo = AuthStorage.getEmailAuth()
        if (!emailAuthInfo) return

        const authToken = emailAuthInfo.authToken
        const email = emailAuthInfo.email
        console.log('Login email: ', email)
        console.log('Storage token: ', authToken)
        await setProfile({ email, authToken })
        setAuth(email, authToken)
    }

    const walletLogin = async () => {
        const loginType = AuthStorage.getLastLoginType()
        if (!loginType) return
        if (loginType !== 'wallet') return

        const isSolarLogin = window.localStorage.getItem('isSolarLogin') === 'true'
        if (isSolarLogin) {
            return
        }

        if (!address) {
            logOut()
            return
        }

        if (!data) return

        console.log('Login ...')
        console.log('Login type: ', loginType)
        console.log('Login wallet: ', address)

        let authToken = AuthStorage.getAuth()?.authToken
        let historyAddr = AuthStorage.getAuth()?.account
        console.log('login authtoken: ===================================', authToken)
        if (!authToken || historyAddr !== address) {
            const unloading = showLoading()
            try {
                authToken = await solas.login(data)
                console.log('New token: ', authToken)
            } catch (e) {
                console.error('Login fail', e)
                showToast('Login fail', 3000)
                logOut()
                return
            } finally {
                unloading()
            }
        }

        console.log('Storage token: ', authToken)

        await setProfile({ address: address, authToken: authToken })
        setAuth(address, authToken)
    }

    const login = async () => {
        console.log('======================login=======================')
        const loginType = AuthStorage.getLastLoginType()
        if (!loginType) return

        console.log('Login ...')
        console.log('Login type: ', loginType)

        let auth = AuthStorage.getAuth()
        if (!auth) {
            console.log('======================no auth=======================')
            return
        }

        const authToken = auth.authToken
        const account = auth.account

        console.log('Login account: ', account)
        console.log('Storage token: ', authToken)

        if (loginType === 'wallet') {
            await setProfile({ address: account, authToken })
        } else if (loginType === 'email') {
            await setProfile({ email: account, authToken })
        }
    }

    useEffect(() => {
        login()
    }, [])

    useEffect(() => {
        walletLogin()
    }, [data, address])

    // update profile from event
    useEffect(() => {
        if (newProfile && (newProfile.id === userInfo.id || (!userInfo.domain && userInfo.id))) {
            setUser({...userInfo,
                domain: newProfile.domain,
                userName: newProfile.domain ? newProfile.domain.split('.')[0]: null,
                nickname: newProfile.nickname,
                avatar: newProfile.image_url
            })
        }
    }, [newProfile])

    return (
        <UserContext.Provider value={{ user: userInfo, setUser, logOut, emailLogin, walletLogin, setProfile}}>
            { props.children }
        </UserContext.Provider>
    )
}

export default UserProvider
