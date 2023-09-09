import {Link, useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import {
    Badge,
    Event,
    getProfile,
    Group,
    joinEvent,
    Participants,
    Profile,
    ProfileSimple,
    punchIn,
    queryBadgeDetail,
    queryEventDetail,
    queryMyEvent,
    queryUserGroup
} from "../../service/solas";
import './EventDetail.less'
import LangContext from "../../components/provider/LangProvider/LangContext";
import useTime from "../../hooks/formatTime";
import EventLabels from "../../components/base/EventLabels/EventLabels";
import usePicture from "../../hooks/pictrue";
import ReasonText from "../../components/base/ReasonText/ReasonText";
import AppButton from "../../components/base/AppButton/AppButton";
import userContext from "../../components/provider/UserProvider/UserContext";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import PageBack from "../../components/base/PageBack";
import ListCheckLog from "../../components/compose/ListCheckLog/ListCheckLog";
import useCalender from "../../hooks/addToCalender";
import ListCheckinUser from "../../components/compose/ListCheckinUser/ListCheckinUser";
import useShowImage from "../../hooks/showImage/showImage";
import useCopy from "../../hooks/copy";
import EventHomeContext from "../../components/provider/EventHomeProvider/EventHomeContext";

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
    const {showLoading, showToast, showEventCheckIn} = useContext(DialogsContext)
    const {addToCalender} = useCalender()
    const {showImage} = useShowImage()
    const {copy} = useCopy()
    const {eventGroups, setEventGroup, eventGroup, ready} = useContext(EventHomeContext)


    const [tab, setTab] = useState(1)
    const [isHoster, setIsHoster] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [isGuest, setIsGuest] = useState(false)
    const [canceled, setCanceled] = useState(false)
    const [outOfDate, setOutOfDate] = useState(false)
    const [inProgress, setInProgress] = useState(false)
    const [inCheckinTime, setIsCheckTime] = useState(false)
    const [notStart, setNotStart] = useState(false)
    const [participants, setParticipants] = useState<Participants[]>([])
    const [guests, setGuests] = useState<ProfileSimple[]>([])
    const [badge, setBadge] = useState<Badge | null>(null)
    const [isChecklog, setIsChecklog] = useState(false)
    const [canAccess, setCanAccess] = useState(false)

    async function fetchData() {
        if (eventId) {
            const res = await queryEventDetail({id: Number(eventId)})
            setEvent(res)

            setParticipants(res.participants?.filter(item => item.status !== 'cancel')!)
            setCanceled(res.status === 'cancel')
            // setCanceled(false)

            const isCheckLogEvent = res.event_type === 'checklog'
            setIsChecklog(isCheckLogEvent)

            const now = new Date().getTime()
            if (res.start_time && res.ending_time) {
                const start = new Date(res.start_time).getTime()
                const end = new Date(res.ending_time).getTime()
                if (now < start) {
                    setNotStart(true)
                }

                if (now >= start && now <= end) {
                    setInProgress(true)
                }
                if (now > end) {
                    setOutOfDate(true)
                }

                // 活动当天及之后都可以报名和签到
                const startDate = new Date(res.start_time).setHours(0, 0, 0, 0)
                if (now >= new Date(startDate).getTime()) {
                    setIsCheckTime(true)
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
                const isDomain = res.host_info && res.host_info.indexOf('.') > -1
                profile = await getProfile(isDomain
                    ? {domain: res.host_info!}
                    : {id: Number(res.host_info)})

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
            const joined = res.find((item: Participants) => item.event.id === event?.id && item.status !== 'cancel')
            setIsGuest(joined?.role === 'guest')
            setIsJoined(!!joined)
        }
    }

    useEffect(() => {
        fetchData()
    }, [eventId])

    useEffect(() => {
        if (event && event.group_id && ready) {
            const group: any = eventGroups.find(item => item.id === event.group_id)
            if (!group) {
                navigate('/error')
                return
            }

            setEventGroup(group as Group)

            const selectedGroup = group as Group
            if (selectedGroup.group_event_visibility === 'public') {
                setCanAccess(true)
                return
            } else if (user.id) {
                const myGroup = queryUserGroup({profile_id: user.id}).then(res => {
                    const joined = res.find(item => item.id === selectedGroup.id)
                    if (!joined && selectedGroup.group_event_visibility === 'private') {
                        navigate('/error')
                    } else {
                        setCanAccess(!!joined)
                    }
                })
            } else {
                setCanAccess(false)
            }
        }

    }, [event, ready, user.id])

    useEffect(() => {
        setIsHoster(hoster?.id === user.id || hoster?.group_owner_id === user.id)
        checkJoined()
    }, [hoster, user.id])

    const gotoModify = () => {
        navigate(`/event/edit/${event?.id}`)
    }

    const goToProfile = (username: string, isGroup?: boolean) => {
        const homeUrl = import.meta.env.VITE_SOLAS_HOME
        window.location.href = `${homeUrl}/${isGroup ? 'group' : 'profile'}/${username}`
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

    const handleHostCheckIn = async () => {
        navigate(`/checkin/${event!.id}`)
    }

    const handleUserCheckIn = async () => {
        navigate(`/checkin/${event!.id}`)
    }

    const copyLink = () => {
        navigate(`/success/${event?.id}`)
    }

    const handlePunchIn = async () => {
        const a = await punchIn({
            auth_token: user.authToken || '',
            id: Number(eventId)
        })
    }

    return (<Layout>
        {
            !!event &&
            <div className={'event-detail'}>
                <PageBack
                    onClose={() => navigate(-1)}
                    menu={() => <div className={'event-share-btn'} onClick={e => {
                    copyLink()
                }}><img src="/images/icon_share.svg" alt=""/></div>}/>

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
                                        ? event.event_site.title + (event.event_site.location ? `(${event.event_site.location})` : '')
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
                                     onClick={e => {
                                         !!hoster.username && goToProfile(hoster.username, hoster.is_group || undefined)
                                     }}>
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
                                                            onClick={e => {
                                                                goToProfile(item.domain!.split('.')[0])
                                                            }}>
                                                    <img src={item.image_url || defaultAvatar(item.id)} alt=""/>
                                                    <div>
                                                        <div className={'host-name'}>{item.domain?.split('.')[0]}</div>
                                                        <div>{lang['Activity_Detail_Guest']}</div>
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
                                {event.event_type !== 'checklog' ?
                                    <div className={tab === 2 ? 'tab-title active' : 'tab-title'}
                                         onClick={e => {
                                             setTab(2)
                                         }}>{lang['Activity_Participants']}({participants.length})
                                    </div> :

                                    <div className={tab === 3 ? 'tab-title active' : 'tab-title'}
                                         onClick={e => {
                                             setTab(3)
                                         }}>{lang['Activity_Punch_Log']}
                                    </div>
                                }
                            </div>
                        </div>


                        <div className={'tab-contains'}>
                            {tab === 1 &&
                                <div className={'tab-contain'}>
                                    <div className={'center'}>
                                        {!!event.wechat_contact_group &&
                                            <>
                                                <div className={'wechat-title'}>{lang['Activity_Detail_Wechat']}</div>
                                                {
                                                    !!event.wechat_contact_person &&
                                                    <div className={'wechat-account'}>{lang['Activity_Detail_Account']}
                                                        <span onClick={e => {
                                                            copy(event.wechat_contact_person!);
                                                            showToast('Copied!')
                                                        }}>
                                                        {event.wechat_contact_person}
                                                        </span>
                                                    </div>
                                                }
                                                <div className={'wechat-contact-group'} onClick={e => {
                                                    showImage(event.wechat_contact_group!)
                                                }}>
                                                    <img src={event.wechat_contact_group} alt=""/>
                                                </div>
                                            </>
                                        }
                                        {!!event.telegram_contact_group &&
                                            <div className={'wechat-account'}>
                                                <div className={'wechat-title'}>Telegram :  <a href={event.telegram_contact_group} target={'_blank'}>
                                                    {event.telegram_contact_group}
                                                </a></div>
                                            </div>
                                        }
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
                                            <ListCheckinUser
                                                editable={false}
                                                participants={participants}
                                                isHost={isHoster}
                                                eventId={Number(eventId)}
                                            />
                                        }
                                    </div>
                                </div>
                            }
                            {tab === 3 &&
                                <div className={'tab-contain'}>
                                    <div className={'center'}>
                                        <ListCheckLog eventId={Number(eventId)}/>
                                    </div>
                                </div>}
                        </div>

                        { canAccess && <div className={'event-action'}>
                                {isChecklog
                                    ? <div className={'center'}>
                                        {isHoster && !canceled &&
                                            <AppButton onClick={gotoModify}>{lang['Activity_Detail_Btn_Modify']}</AppButton>
                                        }
                                        {isHoster && !canceled &&
                                            <AppButton
                                                special
                                                onClick={e => {
                                                    handleHostCheckIn()
                                                }}>{
                                                lang['Activity_Punch_in_BTN']
                                            }</AppButton>
                                        }
                                        {inCheckinTime && !canceled && !isHoster &&
                                            <AppButton
                                                special
                                                onClick={e => {
                                                    showEventCheckIn(Number(eventId), true)
                                                }}>{
                                                lang['Activity_Punch_in_BTN']
                                            } </AppButton>
                                        }
                                        {canceled &&
                                            <AppButton disabled>{lang['Activity_Detail_Btn_has_Cancel']}</AppButton>
                                        }
                                    </div>
                                    :
                                    <div className={'center'}>
                                        {canceled &&
                                            <AppButton disabled>{lang['Activity_Detail_Btn_has_Cancel']}</AppButton>
                                        }

                                        {!canceled && isJoined && !outOfDate && !isHoster &&
                                            <AppButton
                                                onClick={e => {
                                                    addToCalender({
                                                        name: event.title,
                                                        startTime: event.start_time!,
                                                        endTime: event.ending_time!,
                                                        location: event.event_site?.title || event.location || '',
                                                        details: event.content,
                                                        url: window.location.href
                                                    })
                                                }}>
                                                <i className="icon-calendar" style={{marginRight: '8px'}}/>
                                                {lang['Activity_Detail_Btn_add_Calender']}</AppButton>
                                        }

                                        {isHoster && !canceled &&
                                            <AppButton onClick={gotoModify}>{lang['Activity_Detail_Btn_Modify']}</AppButton>
                                        }

                                        {!isJoined && !canceled && (inCheckinTime || notStart) && !isHoster &&
                                            <AppButton special onClick={e => {
                                                handleJoin()
                                            }}>{lang['Activity_Detail_Btn_Attend']}</AppButton>
                                        }

                                        {false &&
                                            <AppButton disabled>{lang['Activity_Detail_Btn_End']}</AppButton>
                                        }

                                        {isHoster && !canceled &&
                                            <AppButton
                                                special
                                                onClick={e => {
                                                    handleHostCheckIn()
                                                }}>{
                                                event.badge_id
                                                    ? lang['Activity_Host_Check_And_Send']
                                                    : lang['Activity_Detail_Btn_Checkin']
                                            }</AppButton>
                                        }

                                        {!canceled && isJoined && !isHoster && inCheckinTime &&
                                            <AppButton
                                                special
                                                onClick={e => {
                                                    handleUserCheckIn()
                                                }}>{lang['Activity_Detail_Btn_Checkin']}</AppButton>
                                        }

                                        {!canceled && isJoined && inProgress && !!event.online_location &&
                                            <AppButton
                                                onClick={e => {
                                                    window.open(event.online_location!, '_blank')
                                                }}
                                                special>{lang['Activity_Detail_Btn_AttendOnline']}</AppButton>
                                        }
                                    </div>
                                }
                            </div>
                        }

                        { !canAccess &&
                            <div className={'event-action'}>
                               <div className={'can-not-access'}> Event only open to members of the group</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
    </Layout>)
}

export default EventDetail
