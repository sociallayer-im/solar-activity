import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import {Event, Participants} from "../../../../service/solas";
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
    const [a, seta] = useState('')
    const formatTime = useTime()
    const {lang} = useContext(langContext)

    const hasRegistered = props.participants?.find(item => item.event.id === props.event.id)

    const gotoDetail = () => {
        window.open(`/event/${props.event.id}`, '_blank')
    }

    return (<div className={'event-card'} onClick={e => {gotoDetail()}}>
        <div className={'markers'}>
            {!!hasRegistered && <div className={'marker'}>{lang['Activity_State_Registered']}</div>}
        </div>
        <div className={'info'}>
            <div className={'left'}>
                <div className={'title'}>{props.event.title}</div>

                {!!props.event.start_time &&
                    <div className={'detail'}>
                        <i className={'icon-calendar'}/>
                        <span>{formatTime(props.event.start_time)}</span>
                    </div>
                }

                {!!props.event.location &&
                    <div className={'detail'}>
                        <i className={'icon-Outline'}/>
                        <span>{props.event.location}</span>
                    </div>
                }

                {!!props.event.event_site &&
                    <div className={'detail'}>
                        <i className={'icon-Outline'}/>
                        <span>{props.event.event_site.title}</span>
                    </div>
                }

                {!!props.event.online_location &&
                    <div className={'detail'}>
                        <i className={'icon-link'}/>
                        <span>{props.event.online_location}</span>
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
