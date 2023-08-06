import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import {Event, Participants, queryEventDetail} from "../../../../service/solas";
import './CardEvent.less'
import useTime from "../../../../hooks/formatTime";
import langContext from "../../../provider/LangProvider/LangContext";
import userContext from "../../../provider/UserProvider/UserContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';

export interface CardEventProps {
    event: Event,
    fixed?: boolean,
    participants?: Participants[]
}

function CardEvent({fixed=true, ...props}: CardEventProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [eventDetail, setEventDetail] = useState(props.event)
    const formatTime = useTime()
    const {lang} = useContext(langContext)
    const [isCreated, setIsCreated] = useState(false)
    const {user} = useContext(userContext)

    const hasRegistered = props.participants?.find(item => item.event.id === props.event.id)

    const now = new Date().getTime()
    const endTime = new Date(eventDetail.ending_time!).getTime()
    const isExpired = endTime < now

    useEffect(() => {
        if (user.id) {
            setIsCreated(props.event.owner_id === user.id)
        }
    }, [user.id])

    const gotoDetail = () => {
        navigate(`/event/${props.event.id}`)
    }

    const hasMarker = isExpired || !!hasRegistered || isCreated

    useEffect(() => {
        if (!props.event.event_site) {
            const event = queryEventDetail({id: props.event.id})
                .then(res => {
                    setEventDetail(res)
                })
        }
    }, [])

    return (<div className={'event-card'} onClick={e => {
        gotoDetail()
    }}>
        {(fixed || hasMarker && !fixed) &&
            <div className={'markers'}>
                {isExpired && <div className={'marker expired'}>{lang['Activity_Detail_Expired']}</div>}
                {!!hasRegistered && <div className={'marker registered'}>{lang['Activity_State_Registered']}</div>}
                {isCreated && <div className={'marker created'}>{lang['Activity_Detail_Created']}</div>}
            </div>
        }

        <div className={(fixed || hasMarker && !fixed) ? 'info marker': 'info'}>
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
            <div className={(fixed || hasMarker && !fixed) ? 'post marker': 'post'}>
                <LazyLoadImage
                    src={props.event.cover}
                    alt={''}
                />
            </div>
        </div>
    </div>)
}

export default CardEvent
