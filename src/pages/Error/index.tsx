import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Empty from '../../components/base/Empty'
import './Error.less'
import AppButton, { BTN_KIND } from '../../components/base/AppButton/AppButton'

function ErrorPage() {
    const navigate = useNavigate()

    return (
        <Layout>
            <div className='error-page'>
                <Empty text={'Page not found~'}></Empty>
                <AppButton kind={BTN_KIND.primary} onClick={ () => {navigate('/') } }>Back to Home</AppButton>
            </div>
        </Layout>
    )
}

export default ErrorPage
