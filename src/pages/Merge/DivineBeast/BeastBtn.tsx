import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useEffect, useState} from 'react'

export interface BeastBtnProps {
    children?: React.ReactNode
    background?: string
    loading?: boolean,
    onClick?: (e: any) => any
}

function BeastBtn(props: BeastBtnProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')

    const background = props.background || '#529E9C'

    useEffect(() => {

    }, [])

    return (<div className={'beast-btn'} style={{background: background}} onClick={e => {
        !props.loading && props.onClick && props.onClick(e)
    }
    }>
        <div className={'content'} style={{background: background}}>
            {!props.loading ? props.children : '合成中...'}
        </div>
    </div>)
}

export default BeastBtn
