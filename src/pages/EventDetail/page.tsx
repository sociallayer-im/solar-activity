import {Link, useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import {
    Badge,
    cancelEvent,
    Event,
    getProfile,
    Group,
    joinEvent,
    Participants,
    Profile,
    ProfileSimple,
    queryBadgeDetail,
    queryEventDetail,
    queryMyEvent,
    unJoinEvent
} from "../../service/solas";
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
    const [participants, setParticipants] = useState<ProfileSimple[]>([])
    const [guests, setGuests] = useState<ProfileSimple[]>([])
    const [badge, setBadge] = useState<Badge | null>(null)


    async function fetchData() {
        if (eventId) {
            const res = await queryEventDetail({id: Number(eventId)})
            setEvent(res)
            setParticipants(res.participants?.filter(item => item.status !== 'cancel')
                .map((item: Participants) => item.profile) || [])
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

            if (res?.badge_id) {
                const badge = await queryBadgeDetail({id: res.badge_id})
                setBadge(badge)
            }

            if (res.participants) {
                const guests = res.participants.filter((item: Participants) => item.role === 'guest')
                setGuests(guests.map((item: Participants) => item.profile))
            }
        } else {
            navigate('/error')
        }
    }

    async function checkJoined() {
        if (hoster && user.authToken) {
            const res = await queryMyEvent({auth_token: user.authToken || ''})
            const joined = res.find((item: Participants) => item.event.id === event?.id && item.status !== 'cancel' && item.role !== 'guest')
            setIsJoined(!!joined)
        }
    }

    useEffect(() => {
        fetchData()
    }, [eventId])

    useEffect(() => {
        setIsHoster(hoster?.id === user.id || hoster?.group_owner_id === user.id)
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

    const goToProfile = (username: string, isGroup?: boolean) => {
        const homeUrl = import.meta.env.VITE_SOLAS_HOME
        window.open(`${homeUrl}/${isGroup ? 'group' : 'profile'}/${username}`, '_blank')
    }

    const handleJoin = async () => {
        const unload = showLoading()
        try {
            const join = await joinEvent({id: Number(eventId), auth_token: user.authToken || ''})
            unload()
            showToast('Join success')
            setIsJoined(true)
            fetchData()
        } catch (e: any) {
            console.error(e)
            unload()
            showToast(e.message)
        }
    }

    const handleUnJoin = async () => {
        const unload = showLoading()
        try {
            const join = await unJoinEvent({id: Number(eventId), auth_token: user.authToken || ''})
            unload()
            showToast('Canceled')
            setIsJoined(false)
            fetchData()
        } catch (e: any) {
            console.error(e)
            unload()
            showToast(e.message)
        }
    }

    const handleHostCheckIn = async () => {
        navigate(`/checkin/${event!.id}`)
    }

    const handleUserCheckIn = async () => {
        navigate(`/checkin/${event!.id}`)
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
                        {(event.event_site || event.location) &&
                            <div className={'detail-item'}>
                                <i className={'icon-Outline'}/>
                                <div>{
                                    event.event_site
                                        ? event.event_site.title
                                        : event.location
                                }</div>
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
                                <div className={'host-item'}
                                     onClick={e => {!!hoster.username && goToProfile(hoster.username, hoster.is_group || undefined)}}>
                                    <img src={hoster.image_url || defaultAvatar(hoster.id)} alt=""/>
                                    <div>
                                        <div className={'host-name'}>{hoster.nickname || hoster.username}</div>
                                        <div>{lang['Activity_Form_Hoster']}</div>
                                    </div>
                                </div>
                                {!!guests && !!guests.length &&
                                    <>
                                        {
                                            guests.map((item: ProfileSimple) => {
                                                return <div className={'host-item'} key={item.domain}
                                                            onClick={e => {goToProfile(item.domain!.split('.')[0])}}>
                                                    <img src={item.image_url || defaultAvatar(item.id)} alt=""/>
                                                    <div>
                                                        <div className={'host-name'}>{item.domain?.split('.')[0]}</div>
                                                        <div>{lang['Activity_Form_Guest']}</div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </>
                                }
                            </div>
                            {
                                !!badge && <div className={'center'}>
                                    <div className={'event-badge'}>
                                        <div>{lang['Activity_Detail_Badge']}</div>
                                        <img src={badge.image_url} alt=""/>
                                    </div>
                                </div>
                            }

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
                                     }}>{lang['Activity_Participants']}({participants.length})
                                </div>
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
                                        {!!event.min_participant &&
                                            <div
                                                className={'min-participants-alert'}>{lang['Activity_Detail_min_participants_Alert']([event.min_participant])}</div>
                                        }
                                        {!!hoster &&
                                            <AddressList
                                                onClick={e => {goToProfile(e.split('.')[0])}}
                                                data={participants as Profile[]}/>
                                        }
                                    </div>
                                </div>}
                        </div>

                        <div className={'event-action'}>
                            <div className={'center'}>
                                {canceled &&
                                    <AppButton disabled>{lang['Activity_Detail_Btn_has_Cancel']}</AppButton>
                                }

                                {isHoster && !canceled && notStart &&
                                    <AppButton onClick={e => {
                                        cancel()
                                    }}>{lang['Activity_Detail_Btn_Cancel']}</AppButton>
                                }

                                {isHoster && !canceled &&
                                    <AppButton onClick={gotoModify}>{lang['Activity_Detail_Btn_Modify']}</AppButton>
                                }

                                {!isJoined && notStart && !canceled && !outOfDate && !isHoster &&
                                    <AppButton special onClick={e => {
                                        handleJoin()
                                    }}>{lang['Activity_Detail_Btn_Attend']}</AppButton>
                                }

                                {isJoined && notStart && !canceled &&
                                    <AppButton onClick={e => {
                                        handleUnJoin()
                                    }}>{lang['Activity_Detail_Btn_unjoin']}</AppButton>
                                }

                                {!isJoined && inProgress && !isHoster && !canceled &&
                                    <AppButton disabled>{lang['Activity_Detail_Btn_Attend']}</AppButton>
                                }

                                {outOfDate && !canceled &&
                                    <AppButton disabled>{lang['Activity_Detail_Btn_End']}</AppButton>
                                }


                                {!canceled && isHoster && inProgress &&
                                    <AppButton
                                        special
                                        onClick={e => {
                                            handleHostCheckIn()
                                        }}>{lang['Activity_Detail_Btn_Checkin']}</AppButton>
                                }

                                {!canceled && isJoined && inProgress &&
                                    <>
                                        {(event.location || event.event_site) &&
                                            <AppButton
                                                onClick={e => {
                                                    handleUserCheckIn()
                                                }}
                                                special>{lang['Activity_Detail_Btn_Checkin']}</AppButton>
                                        }
                                        {!!event.online_location && <AppButton
                                            onClick={e => {
                                                window.open(event.online_location!, '_blank')
                                            }}
                                            special>{lang['Activity_Detail_Btn_AttendOnline']}</AppButton>
                                        }
                                    </>
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
