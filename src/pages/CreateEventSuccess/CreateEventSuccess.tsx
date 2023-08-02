import {useNavigate, useParams, Link} from 'react-router-dom'
import {useEffect, useState, useContext} from 'react'
import './CreateEventSuccess.less'
import Layout from "../../components/Layout/Layout";
import {Event, queryEventDetail} from "../../service/solas";
import LangContext from "../../components/provider/LangProvider/LangContext";
import useTime from "../../hooks/formatTime";
import QRcode from "../../components/base/QRcode";


function CreateEventSuccess() {
    const navigate = useNavigate()
    const [event, setEvent] = useState<Event | null>(null)
    const {eventId} = useParams()
    const {lang} = useContext(LangContext)
    const formatTime = useTime()

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

    return (<Layout>
        <div className={'create-event-success-page'}>
            <Link className={'done'} to={`/event/${eventId}`}>Done</Link>
            <div className={'title'}>{lang['Activity_Create_Success']}</div>
            { event && <div className={'event-share-card '} >
                <img src={event.cover} className={'cover'} alt=""/>
                <div className={'name'}>{event.title}</div>
                { event.start_time &&
                    <div className={'time'}>
                        <i className={'icon-calendar'} />
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
                    event.event_site &&  <div className={'time'}>
                        <i className={'icon-Outline'} />
                        <div>{event.event_site.title}</div>
                    </div>
                }

                {
                    event.online_location &&  <div className={'time'}>
                        <i className={'icon-link'} />
                        <div>{event.online_location}</div>
                    </div>
                }

                <div className={'card-footer'}>
                    <div className={'left'}>
                        <div>Scan the code <br />and attend the event </div>
                        <img src="/images/logo.svg" alt=""/>
                    </div>
                    <QRcode size={[63, 63]} text={window.location.host + `/event/${eventId}`}/>
                </div>
            </div>
            }
        </div>
    </Layout>)
}

export default CreateEventSuccess
