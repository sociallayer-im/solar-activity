import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import {Event, Participants, queryEventDetail} from "../../../../service/solas";
import './CardEvent.less'
import useTime from "../../../../hooks/formatTime";
import langContext from "../../../provider/LangProvider/LangContext";

export interface CardEventProps {
    event: Event
    participants?: Participants[]
}
function CardEvent(props:CardEventProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [eventDetail, setEventDetail] = useState(props.event)
    const formatTime = useTime()
    const {lang} = useContext(langContext)

    const hasRegistered = props.participants?.find(item => item.event.id === props.event.id)

    const gotoDetail = () => {
        navigate(`/event/${props.event.id}`)
    }

    useEffect(() => {
        if (!props.event.event_site) {
            const event = queryEventDetail({id: props.event.id})
                .then(res => {
                    setEventDetail(res)
                })
        }
    }, [])

    return (<div className={'event-card'} onClick={e => {gotoDetail()}}>
        <div className={'markers'}>
            {!!hasRegistered && <div className={'marker'}>{lang['Activity_State_Registered']}</div>}
        </div>
        <div className={'info'}>
            <div className={'left'}>
                <div className={'title'}>{eventDetail.title}</div>

                {!!eventDetail.start_time &&
                    <div className={'detail'}>
                        <i className={'icon-calendar'}/>
                        <span>{formatTime(eventDetail.start_time)}</span>
                    </div>
                }

                {!!eventDetail.location &&
                    <div className={'detail'}>
                        <i className={'icon-Outline'}/>
                        <span>{eventDetail.location}</span>
                    </div>
                }

                {!!eventDetail.event_site &&
                    <div className={'detail'}>
                        <i className={'icon-Outline'}/>
                        <span>{eventDetail.event_site.title}</span>
                    </div>
                }

                {!!eventDetail.online_location &&
                    <div className={'detail'}>
                        <i className={'icon-link'}/>
                        <span>{eventDetail.online_location}</span>
                    </div>
                }

            </div>
            <div className={'post'}>
                <img src={props.event.cover} alt={''}/>
            </div>
        </div>
    </div>)
}

export default CardEvent
