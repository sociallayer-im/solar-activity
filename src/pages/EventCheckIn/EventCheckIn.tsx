import {useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useRef, useState} from 'react'
import Layout from "../../components/Layout/Layout";
import './EventCheckIn.less'
import {
    CheckLog,
    Event,
    getEventCheckLog,
    getProfile,
    Participants,
    Profile,
    queryEventDetail,
    sendEventBadge
} from "../../service/solas";
import userContext from "../../components/provider/UserProvider/UserContext";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import PageBack from "../../components/base/PageBack";
import useTime from "../../hooks/formatTime";
import QRcode from "../../components/base/QRcode";
import langContext from "../../components/provider/LangProvider/LangContext";
import AppButton from "../../components/base/AppButton/AppButton";
import ListCheckinUser from "../../components/compose/ListCheckinUser/ListCheckinUser";
import ListCheckLog from "../../components/compose/ListCheckLog/ListCheckLog";

function EventCheckIn() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const {eventId} = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [isHoster, setIsHoster] = useState(false)
    const [isJoin, setIsJoin] = useState(false)
    const [hoster, setHoster] = useState<Profile | null>(null)
    const [participants, setParticipants] = useState<Participants[]>([])
    const [hasCheckin, setHasCheckin] = useState<string[]>([])
    const [isCheckLog, setIsCheckLog] = useState(false)

    const {user} = useContext(userContext)
    const {showLoading, showEventCheckIn, showToast} = useContext(DialogsContext)
    const formatTime = useTime()
    const {lang} = useContext(langContext)
    const timeOut = useRef<any>(null)

    async function init(needLoading = true) {
        let unload: any = () => {
        }
        if (eventId) {
            if (needLoading) {
                unload = showLoading()
            }

            try {
                const eventDetails = await queryEventDetail({id: Number(eventId)})
                setEvent(eventDetails)
                setIsCheckLog(eventDetails.event_type === 'checklog')
                setParticipants(eventDetails?.participants?.sort((a, b) => {
                    if (b.status === 'checked') {
                        return 1
                    } else {
                        return -1
                    }
                }) || [])
                setHasCheckin(eventDetails?.participants?.filter(item => item.status === 'checked').map(item => item.profile.domain!) || [])

                if (eventDetails.host_info || eventDetails.group_id) {
                    const isDomain = eventDetails.host_info && eventDetails.host_info.indexOf('.') > -1
                    const profile = await getProfile(isDomain
                        ? {domain: eventDetails.host_info!}
                        : {id: eventDetails.group_id || Number(eventDetails.host_info)})
                    if (profile) {
                        setHoster(profile)
                    }
                } else {
                    const profile = await getProfile({id: Number(eventDetails.owner_id)})
                    if (profile) {
                        setHoster(profile)
                    }
                }

                unload()
            } catch (e) {
                unload()
                console.error(e)
                navigate('/error')
            }
        } else {
            navigate('/error')
        }
    }

    useEffect(() => {
        init()

        // timeOut.current = setInterval(() => {
        //     init(false)
        // }, 3000)

        return () => {
            if (timeOut.current) {
                clearInterval(timeOut.current)
            }
        }
    }, [])

    useEffect(() => {
        if (user.id && event) {
            setIsHoster(user.id === event.owner_id)
            const isJoin = event.participants?.find((item: any) => {
                return item.profile.id === user.id
            })
            setIsJoin(!!isJoin)
        }
    }, [user.id, hoster])


    const handleSendBadge = async () => {
        const unload = showLoading()
        try {
            const send = await sendEventBadge({
                event_id: Number(eventId),
                auth_token: user.authToken || ''
            })
            unload()
            showToast('Send successfully')
        } catch (e: any) {
            unload()
            console.error(e)
            showToast(e.message || 'Send badge failed')
        }
    }

    return (<Layout>
        {!!event &&
            <div className={'event-checkin-page'}>
                <div className={'center'}>
                    <PageBack onClose={() => {
                        navigate(`/event/${eventId}`)
                    }}/>
                    <div className={'checkin-card'}>
                        <div className={'event-name'}>{event.title}</div>
                        <div className={'time'}>
                            {formatTime(event.start_time!)} - {formatTime(event.ending_time!)}
                        </div>

                        {!user.id &&
                            <div className={'checkin-checkin-btn'}>
                                <div className={'login-tips'}>{lang['Activity_login_des']}</div>
                            </div>
                        }

                        {!isCheckLog && isHoster &&
                            <div className={'checkin-checkin-btn'}>
                                <AppButton special onClick={e => {
                                    showEventCheckIn(event.id)
                                }}>{lang['Activity_Scan_checkin']}</AppButton>
                            </div>
                        }

                        { !isCheckLog && isJoin && !isHoster &&
                            <div className={'checkin-qrcode'}>
                                <QRcode text={`${eventId}#${user.id}` || ''} size={[155, 155]}/>
                                {
                                    isCheckLog ?
                                        <div className={'text'}>{lang['Activity_Scan_punch_in']}</div>
                                        : <div className={'text'}>{lang['Activity_Scan_checkin']}</div>
                                }
                            </div>
                        }

                        { isCheckLog && isHoster &&
                            <div className={'checkin-qrcode'}>
                                <QRcode text={`${eventId}#${user.id}` || ''} size={[155, 155]}/>
                                {
                                    isCheckLog ?
                                        <div className={'text'}>{lang['Activity_Scan_punch_in']}</div>
                                        : <div className={'text'}>{lang['Activity_Scan_checkin']}</div>
                                }
                            </div>
                        }

                        { isCheckLog && !isHoster &&
                            <div className={'checkin-checkin-btn'}>
                                <AppButton special onClick={e => {
                                    showEventCheckIn(event.id, true)
                                }}>{lang['Activity_Scan_checkin']}</AppButton>
                            </div>
                        }


                        {!!user.id && !isJoin && !isHoster && !isCheckLog &&
                            <div className={'checkin-checkin-btn'}>
                                <AppButton disabled>{lang['Activity_Scan_checkin']}</AppButton>
                            </div>
                        }
                    </div>
                </div>
                <div className={'center'}>
                    <div className={'checkin-list'}>
                        {isCheckLog ?
                            <>
                                <div className={'title'}>{lang['Activity_Punch_Log']}</div>
                                <ListCheckLog eventId={Number(eventId)} />
                            </>
                            : <>
                                <div className={'title'}>{
                                    lang['Activity_Registered_participants']
                                } <span>({hasCheckin.length} / {participants.length})</span>
                                </div>
                                <ListCheckinUser
                                    isHost={isHoster}
                                    eventId={Number(eventId || 0)}
                                    participants={participants}
                                />
                            </>
                        }
                    </div>
                </div>

                {isHoster && event.badge_id && <div className={'actions'}>
                    <div className={'center'}>
                        <AppButton special onClick={e => {
                            handleSendBadge()
                        }}>{lang['Activity_Host_Send']}</AppButton>
                    </div>
                </div>
                }
            </div>
        }
    </Layout>)
}

export default EventCheckIn
