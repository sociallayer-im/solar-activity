import { useContext, useState } from 'react'
import langContext from '../../provider/LangProvider/LangContext'
import AppInput from '../../base/AppInput'
import AppButton from '../../base/AppButton/AppButton'
import { KIND } from 'baseui/button'
import { useStyletron } from 'baseui'
import solas from '../../../service/solas'
import DialogsContext from '../../provider/DialogProvider/DialogsContext'

export interface EmailLoginFormProps {
    onConfirm: (email: string) => any
}

function EmailLoginForm (props: EmailLoginFormProps) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const { lang } = useContext(langContext)
    const { showLoading, showToast } = useContext(DialogsContext)
    const [css] = useStyletron()

    const verifyAndSetEmail = (value: string) => {
        setError(value && value.match(/^\w+\.*\w+@+\w+\.\w+$/i) ? '' : 'Invalid email address')
        setEmail(value)
    }

    const sendEmail  = async () => {
        const unload = showLoading()
        try {
            const requestEmailLoginCode = await solas.requestEmailCode(email)
            props.onConfirm(email)
            unload()
        } catch (e: any) {
            unload()
            console.log('[sendEmail]: ', e)
            showToast(e.message || 'Send email fail')
        }
    }

    return <>
        <AppInput
            clearable={ true }
            errorMsg={ error }
            value={email}
            onChange={ (e) => { verifyAndSetEmail(e.target.value) } }
            placeholder={ lang['Login_Placeholder'] }></AppInput>
        <div className={css({ marginTop: '34px' })}>
            <AppButton
                onClick={ sendEmail }
                kind={ KIND.primary }>
                { lang['Login_continue'] }
            </AppButton>
        </div>
    </>
}

export default EmailLoginForm
