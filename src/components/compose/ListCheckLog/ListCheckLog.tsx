import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState, useRef} from 'react'
import {eventCheckIn, CheckLog, getEventCheckLog} from "../../../service/solas";
import './ListCheckLog.less'
import usePicture from "../../../hooks/pictrue";
import LangContext from "../../provider/LangProvider/LangContext";
import UserContext from "../../provider/UserProvider/UserContext";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import useFormatTime from "../../../hooks/formatTime";
import useScrollToLoad from "../../../hooks/scrollToLoad";

interface ListCheckinUserProps {
    eventId: number
}

function ListCheckLog(props: ListCheckinUserProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [logs, setLogs] = useState<CheckLog[]>([])
    const {defaultAvatar} = usePicture()
    const {lang} = useContext(LangContext)
    const formatTime = useFormatTime()

    const getLogs = async (page: number) => {
        return await getEventCheckLog({event_id: props.eventId!, page: page})
    }


    const goToProfile = (username: string) => {
        const homeUrl = import.meta.env.VITE_SOLAS_HOME
        window.location.href = `${homeUrl}/profile/${username}`
    }

    const {list, ref} = useScrollToLoad({
        queryFunction: getLogs,
        immediate: true,
    })

    return (<div className={'checklog-user-list'}>
        {
            list.map((item, index) => {
                return <div className={'user-list-item'} key={index} onClick={e => {goToProfile(item.profile.domain?.split('.')[0]!)}}>
                    <div className={'left'}>
                        <img src={item.profile.image_url || defaultAvatar(item.profile.id)} alt="" />
                        {item.profile.domain?.split('.')[0]}
                    </div>
                    <div className={'right'}>
                        {formatTime(item.created_at)}
                        {' 打卡成功'}
                    </div>
                </div>
            })
        }
        <div ref={ref} style={{height: '12px'}}></div>
    </div>)
}

export default ListCheckLog
