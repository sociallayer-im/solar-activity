import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect, ReactDOM, ReactNode} from 'react'

function Panel(props: {title: string | ReactNode, children?: ReactNode}) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')

    useEffect(() => {

    }, [])

    return (<div className={'merge-panel'}>
        <div className={'panel-top'}>
            <div className={'title-text'}>{props.title}</div>
        </div>
        <div className={'panel-center'}>{props.children}</div>
        <div className={'panel-bottom'}></div>
    </div>)
}

export default Panel
