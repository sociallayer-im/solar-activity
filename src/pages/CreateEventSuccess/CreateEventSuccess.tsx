import {Link, useNavigate, useParams} from 'react-router-dom'
import {useContext, useEffect, useRef, useState} from 'react'
import './CreateEventSuccess.less'
import Layout from "../../components/Layout/Layout";
import {Event, queryEventDetail} from "../../service/solas";
import LangContext from "../../components/provider/LangProvider/LangContext";
import useTime from "../../hooks/formatTime";
import QRcode from "../../components/base/QRcode";
import AppButton from "../../components/base/AppButton/AppButton";
import saveCard from "../../utils/html2png";
import copy from "../../utils/copy";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import EventHomeContext from "../../components/provider/EventHomeProvider/EventHomeContext";
import useGetMeetingName from "../../hooks/getMeetingName";


function CreateEventSuccess() {
    const navigate = useNavigate()
    const [event, setEvent] = useState<Event | null>(null)
    const {eventId} = useParams()
    const {lang} = useContext(LangContext)
    const formatTime = useTime()
    const card = useRef<any>()
    const {showToast} = useContext(DialogsContext)
    const {availableList, setEventGroup} = useContext(EventHomeContext)
    const {getMeetingName} = useGetMeetingName()

    useEffect(() => {
        async function fetchData() {
            if (eventId) {
                const res = await queryEventDetail({id: Number(eventId)})
                setEvent(res)
            } else {
                navigate('/error')
            }
        }

        fetchData()
    }, [eventId])

    useEffect(() => {
        if (event && availableList.length) {
            const eventGroup = availableList.find(i => i.id === event.group_id)
            if (eventGroup) {
                setEventGroup(eventGroup)
            }
        }
    }, [event, availableList])

    const isMobile = () => {
        return !!window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    }

    const downloadCard = () => {
        if (card.current || event) {
            const height = card.current.offsetHeight
            saveCard(card.current, event?.title || '', [335, height])
        }
    }

    const copyLink = () => {
        const link = `${window.location.origin}/event/${event?.id}`
        copy(link)
        showToast(lang['Dialog_Copy_Title'])
    }

    return (<Layout>
        <div className={'create-event-success-page'}>
            <Link className={'done'} to={`/event/${eventId}`}>Done</Link>
            <div className={'title'}>{lang['IssueFinish_Title']}</div>
            {event &&
                <>
                    <div className={'event-share-card'} ref={card}>
                        <img src={event.cover} className={'cover'} alt=""/>
                        <div className={'name'}>{event.title}</div>
                        {event.start_time &&
                            <div className={'time'}>
                                <i className={'icon-calendar'}/>
                                <div className={'start-time'}>{formatTime(event.start_time)}</div>
                                {
                                    event.ending_time &&
                                    <>
                                        <span>--</span>
                                        <div className={'end-time'}> {formatTime(event.ending_time)}</div>
                                    </>
                                }
                            </div>
                        }

                        {
                            event.event_site && <div className={'time'}>
                                <i className={'icon-Outline'}/>
                                <div>{event.event_site.title}</div>
                            </div>
                        }

                        {
                            event.location && <div className={'time'}>
                                <i className={'icon-Outline'}/>
                                <div>{event.location}{event.location_details? `(${JSON.parse(event.location_details).name})` : ''}</div>
                            </div>
                        }

                        {
                            event.online_location && <div className={'time'}>
                                <i className={'icon-link'}/>
                                <div>{getMeetingName(event.online_location)}</div>
                            </div>
                        }

                        <div className={'card-footer'}>
                            <div className={'left'}>
                                <div>{lang['Card_Event_Success_1']} <br/>{lang['Card_Event_Success_2']}</div>
                                <img src="/images/logo.svg" alt=""/>
                            </div>
                            <QRcode size={[63, 63]} text={'https://' + window.location.host + `/event/${eventId}`}/>
                        </div>
                    </div>
                    { !isMobile() &&
                        <div className={'center'}>
                            <AppButton special onClick={e => {downloadCard()}}>{lang['Save_Card']}</AppButton>
                        </div> }
                    <div className={'center'}>
                        <AppButton onClick={e => {copyLink()}}>{lang['IssueFinish_CopyLink']}</AppButton>
                    </div>
                </>
            }
        </div>
    </Layout>)
}

export default CreateEventSuccess
