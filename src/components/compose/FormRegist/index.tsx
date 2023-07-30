import { useContext, useEffect, useState } from 'react'
import langContext from '../../provider/LangProvider/LangContext'
import AppInput from '../../base/AppInput'
import AppButton from '../../base/AppButton/AppButton'
import { KIND } from 'baseui/button'
import { useStyletron } from 'baseui'
import solas from '../../../service/solas'
import useVerify from '../../../hooks/verify'
import DialogsContext from '../../provider/DialogProvider/DialogsContext'
import UserContext from '../../provider/UserProvider/UserContext'
import './RegistForm.less'

export interface RegistFormProps {
    onConfirm: (domain: string) => any
}

function RegistForm (props: RegistFormProps) {
    const { user, setUser } = useContext(UserContext)
    const { lang } = useContext(langContext)
    const [css] = useStyletron()
    const domainEndEnhancer = import.meta.env.VITE_SOLAS_DOMAIN
    const { verifyDomain } = useVerify()
    const { openDomainConfirmDialog, showLoading, showToast } = useContext(DialogsContext)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'1'|'2'>('1')

    const [domain, setDomain] = useState('')
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [nickname, setNickname] = useState('')

    const showConfirm = () => {
        if (!domain) return
        const props = {
            title: lang['Regist_Dialog_Title'],
            confirmLabel: lang['Regist_Dialog_Create'],
            cancelLabel: lang['Regist_Dialog_ModifyIt'],
            onConfirm: async (close: any) => { close(); await createProfile() },
            content: () => <div className='confirm-domain'><span>{domain}{domainEndEnhancer}</span></div>
        }

        openDomainConfirmDialog(props)
    }

    const createProfile = async () => {
        if (!user.authToken) return
        const unload = showLoading()
        setLoading(true)
        try {
            const create = await solas.regist({
                domain: domain + domainEndEnhancer,
                username: domain,
                email: user.email || undefined,
                address: user.wallet || undefined,
                auth_token: user.authToken
            })

            const newProfile = await solas.getProfile({
                username: domain,
            })

            unload()
            setUser({
                domain: newProfile!.domain,
                userName: newProfile!.username,
            })

            console.log('------------create profile ------------')
            console.log('create', create)
            setLoading(false)
            showToast('Create Success')
        } catch (e: any) {
            unload()
            console.log('[createProfile]: ', e)
            setLoading(false)
            showToast(e.message || 'Create profile fail')
        }
    }

    useEffect(() => {
        if (!nickname) {
            setError('')
            return
        }

        const valid = verifyUsername(nickname)
        setError(valid ? '' : 'Invalid nickname' )
    }, [nickname])

    const handleNext = async () => {
        setStep('2')
    }

    const verifyUsername = (username: string) => {
        const regex = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        return regex.test(username) && username.length < 32
    }

    return <>
        <div className={'skip-btn'}>跳过</div>
        { step === '1' &&
            <>
                <div className='title'>{ lang['Regist_Step_One_Title'] }</div>
                <div className='des' dangerouslySetInnerHTML={ { __html: lang['Regist_Step_One_Des'] } }></div>
                <AppInput
                    clearable={ true }
                    errorMsg={ error }
                    value={ nickname }
                    readOnly = { loading }
                    onChange={ (e) => { setNickname(e.target.value.toLowerCase().trim()) } }
                    placeholder={ lang['Regist_Step_One_Placeholder'] } />
                <div className={css({ marginTop: '34px' })}>
                    <AppButton
                        onClick={ () => { handleNext() } }
                        kind={ KIND.primary }
                        isLoading={ loading }>
                        { lang['Regist_Step_Next'] }
                    </AppButton>
                </div>
            </>
        }

        { step === '2' &&
            <>
                { user.email ?
                    <>
                        <div className='title'>{ lang['Regist_Step_Two_Address_Title'] }</div>
                        <div className='des' dangerouslySetInnerHTML={ { __html: lang['Regist_Step_Two_Address_Des'] } }></div>
                        <AppInput
                            clearable={ true }
                            errorMsg={ error }
                            value={ address }
                            readOnly = { loading }
                            onChange={ (e) => { setAddress(e.target.value.toLowerCase().trim()) } }
                            placeholder={ lang['Regist_Step_Two_Address_Placeholder'] } />
                        <div className={css({ marginTop: '34px' })}>
                            <AppButton
                                onClick={ async () => { await showConfirm() } }
                                kind={ KIND.primary }
                                isLoading={ loading }>
                                { lang['Regist_Confirm'] }
                            </AppButton>
                        </div>
                    </>
                    : <>
                        <div className='title'>{ lang['Regist_Step_Two_Email_Title'] }</div>
                        <div className='des' dangerouslySetInnerHTML={ { __html: lang['Regist_Step_Two_Email_Des'] } }></div>
                        <AppInput
                            clearable={ true }
                            errorMsg={ error }
                            value={ email }
                            readOnly = { loading }
                            onChange={ (e) => { setEmail(e.target.value.toLowerCase().trim()) } }
                            placeholder={ lang['Regist_Step_Two_Email_Placeholder'] } />
                        <div className={css({ marginTop: '34px' })}>
                            <AppButton
                                onClick={ async () => { await showConfirm() } }
                                kind={ KIND.primary }
                                isLoading={ loading }>
                                { lang['Regist_Confirm'] }
                            </AppButton>
                        </div>
                    </>
                }
            </>
        }
    </>
}

export default RegistForm
