import {useNavigate} from 'react-router-dom'
import {styled} from 'baseui'
import LangContext from '../provider/LangProvider/LangContext'
import {ReactNode, useContext, useEffect, useState} from 'react'
import {ArrowLeft} from 'baseui/icon'
import {PageBackContext} from '../provider/PageBackProvider'
import {useLocation} from "react-router-dom";

const Wrapper = styled('div', ({$theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '16px',
    position: 'relative'
}))

const BackBtn = styled('div', ({$theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#272928',
    fontSize: '14px',
    cursor: "pointer",
    userSelect: 'none'
}))

const Title = styled('div', ({$theme}) => ({
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    fontSize: '14px',
    fontWeight: '600'
}))

interface PageBackProp {
    to?: string
    title?: string,
    backBtnLabel?: string,
    menu?: () => ReactNode | string,
    onClose?: () => any
    historyReplace?: boolean
}

function PageBack(props: PageBackProp) {
    const navigate = useNavigate()
    const {lang} = useContext(LangContext)
    const {back, cleanCurrentHistory, history} = useContext(PageBackContext)
    const [hideBackBtn, setHideBackBtn] = useState(true)
    const location = useLocation()

    const handleBack = () => {
        if (props.to) {
            // 指定了to属性，就跳转到指定的页面,而且清除当前页面的历史记录，防止用户点击返回按钮返回到当前页面
            cleanCurrentHistory()
            props.historyReplace ? navigate(props.to, {replace: true}) : navigate(props.to)
        } else if (props.onClose) {
            props.onClose()
        } else {
            back()
        }
    }

    // 如果history长度为0，就隐藏返回按钮
    // 如果history长度为2，且history[0]为'/'，history[1]包含'/profile/'，就隐藏返回按钮
    // 如果history长度为1，且history[0]包含当前页面的path，就隐藏返回按钮
    useEffect(() => {
        const path = location.pathname
        const ifHidden = !history.length
            || (history.length === 2
                && history[0] === '/'
                && history[1].includes('/profile/')
            || (history.length === 1
                && history[0].includes(path))
        )
        setHideBackBtn(ifHidden)
    }, [history.length])

    return (
        <Wrapper>
            {hideBackBtn ?
                <div/>
                : <BackBtn onClick={handleBack}>
                    {!props.backBtnLabel && <ArrowLeft size={18}/>}
                    {props.backBtnLabel ? props.backBtnLabel : lang['Page_Back']}
                </BackBtn>
            }
            <Title>{props.title}</Title>
            {!!props.menu && props.menu()}
        </Wrapper>
    )
}

export default PageBack
