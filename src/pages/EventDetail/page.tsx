import {Link, useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import {Event, getProfile, Group, Participants, Profile, queryEventDetail, queryMyEvent, cancelEvent} from "../../service/solas";
import './EventDetail.less'
import LangContext from "../../components/provider/LangProvider/LangContext";
import useTime from "../../hooks/formatTime";
import EventLabels from "../../components/base/EventLabels/EventLabels";
import usePicture from "../../hooks/pictrue";
import ReasonText from "../../components/base/ReasonText/ReasonText";
import AddressList from "../../components/base/AddressList/AddressList";
import AppButton from "../../components/base/AppButton/AppButton";
import userContext from "../../components/provider/UserProvider/UserContext";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";

function EventDetail() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [event, setEvent] = useState<Event | null>(null)
    const [hoster, setHoster] = useState<Profile | null>(null)
    const {eventId} = useParams()
    const {lang} = useContext(LangContext)
    const formatTime = useTime()
    const {defaultAvatar} = usePicture()
    const {user} = useContext(userContext)
    const {showLoading, showToast} = useContext(DialogsContext)

    const [tab, setTab] = useState(1)
    const [isHoster, setIsHoster] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [canceled, setCanceled] = useState(false)
    const [outOfDate, setOutOfDate] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [notStart, setNotStart] = useState(false)

    useEffect(() => {
        async function fetchData() {
            if (eventId) {
                const res = await queryEventDetail({id: Number(eventId)})
                setEvent(res)
                setCanceled(res.status === 'cancel')

                const now = new Date().getTime()
                if (res.start_time && res.ending_time) {
                    const start = new Date(res.start_time).getTime()
                    const end = new Date(res.ending_time).getTime()
                    if (now < start) {
                        setNotStart(true)
                    }
                    if (now > start && now < end) {
                        setInProgress(true)
                    }
                    if (now > end) {
                        setOutOfDate(true)
                    }
                }

                if (res.start_time && !res.ending_time) {
                    const start = new Date(res.start_time).getTime()
                    if (now < start) {
                        setNotStart(true)
                    }
                    if (now > start) {
                        setInProgress(true)
                    }
                }

                let profile: Profile | Group | null
                if (res.host_info) {
                    const isDomain = res.host_info.indexOf('.') > -1
                    profile = await getProfile(isDomain ? {domain: res.host_info} : {id: Number(res.host_info)})
                    if (profile) {
                        setHoster(profile)
                    }
                } else {
                    profile = await getProfile({id: Number(res.owner_id)})
                    if (profile) {
                        setHoster(profile)
                    }
                }

            } else {
                navigate('/error')
            }
        }


        fetchData()
    }, [eventId])

    useEffect(() => {
        setIsHoster(hoster?.id === user.id || hoster?.group_owner_id === user.id)

        async function checkJoined() {
            if (hoster && user.authToken) {
                const res = await queryMyEvent({auth_token: user.authToken || ''})
                const joined = res.find((item: Participants) => item.event.id === event?.id)
                setIsJoined(!!joined)
            }
        }

        checkJoined()
    }, [hoster, user.id])

    const cancel = async () => {
        const unloading = showLoading()
        try {
            const cancel = await cancelEvent({id: Number(eventId), auth_token: user.authToken || ''})
            unloading()
            showToast('Cancel success')
            setCanceled(true)
        } catch (e) {
            unloading()
            console.error(e)
            showToast('Cancel failed')
        }
    }

    const gotoModify = () => {
        navigate(`/event/edit/${event?.id}`)
    }

    return (<Layout>
        {
            !!event &&
            <div className={'event-detail'}>
                <div className={'cover'}>
                    <img src={event.cover} alt=""/>
                </div>

                <div className={'detail'}>
                    <div className={'center'}>
                        <div className={'name'}>{event.title}</div>
                        {event.start_time &&
                            <div className={'detail-item'}>
                                <i className={'icon-calendar'}/>
                                <div>{formatTime(event.start_time)}</div>
                                {
                                    !!event.ending_time && <>
                                        <span>--</span>
                                        <div>{formatTime(event.ending_time)}</div>
                                    </>
                                }
                            </div>
                        }
                        {event.location &&
                            <div className={'detail-item'}>
                                <i className={'icon-Outline'}/>
                                <div>{event.location}</div>
                            </div>
                        }
                        {event.online_location &&
                            <Link className={'detail-item'} to={event.online_location} target={'_blank'}>
                                <i className={'icon-link'}/>
                                <div>{event.online_location}</div>
                            </Link>
                        }

                        {event.tags && !!event.tags.length &&
                            <div className={'label'}>
                                <EventLabels data={event.tags} value={event.tags} disabled/>
                            </div>
                        }
                    </div>

                    {!!hoster &&
                        <div className={'hoster'}>
                            <div className={'center'}>
                                <img src={hoster.image_url || defaultAvatar(hoster.id)} alt=""/>
                                <div>
                                    <div className={'host-name'}>{hoster.nickname || hoster.username}</div>
                                    <div>{lang['Activity_Form_Hoster']}</div>
                                </div>
                            </div>
                        </div>
                    }

                    <div className={'event-tab'}>
                        <div className={'tab-titles'}>
                            <div className={'center'}>
                                <div className={tab === 1 ? 'tab-title active' : 'tab-title'}
                                     onClick={e => {
                                         setTab(1)
                                     }}>{lang['Activity_Des']}</div>
                                <div className={tab === 2 ? 'tab-title active' : 'tab-title'}
                                     onClick={e => {
                                         setTab(2)
                                     }}>{lang['Activity_Participants']}</div>
                            </div>
                        </div>


                        <div className={'tab-contains'}>
                            {tab === 1 &&
                                <div className={'tab-contain'}>
                                    <div className={'center'}>
                                        <ReasonText className={'event-des'} text={event.content}/>
                                    </div>
                                </div>}
                            {tab === 2 &&
                                <div className={'tab-contain'}>
                                    <div className={'center'}>
                                        {!!hoster &&
                                            <AddressList data={[hoster, hoster]}/>
                                        }
                                    </div>
                                </div>}
                        </div>

                        <div className={'event-action'}>
                            <div className={'center'}>
                                {canceled &&
                                    <AppButton disabled>{lang['Activity_Detail_Btn_Canceled']}</AppButton>
                                }

                                {isHoster && !canceled &&
                                    <>
                                        <AppButton onClick={gotoModify}>{lang['Activity_Detail_Btn_Modify']}</AppButton>
                                        <AppButton  onClick={e => {cancel()}}>{lang['Activity_Detail_Btn_Cancel']}</AppButton>
                                    </>
                                }

                                { !isJoined && notStart && !canceled &&
                                    <AppButton>{lang['Activity_Detail_Btn_Attend']}</AppButton>
                                }

                                { isJoined && inProgress && !canceled &&
                                    <AppButton>{lang['Activity_Detail_Btn_Checkin']}</AppButton>
                                }

                                { !isJoined && inProgress && !isHoster && !canceled &&
                                    <AppButton disabled>{lang['Activity_Detail_Btn_Attend']}</AppButton>
                                }

                                { outOfDate && !canceled &&
                                    <AppButton disabled>{lang['Activity_Detail_Btn_End']}</AppButton>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </Layout>)
}

export default EventDetail
