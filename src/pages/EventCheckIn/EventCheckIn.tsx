import {useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useRef, useState} from 'react'
import Layout from "../../components/Layout/Layout";
import './EventCheckIn.less'
import {Event, getProfile, Profile, ProfileSimple, queryEventDetail} from "../../service/solas";
import userContext from "../../components/provider/UserProvider/UserContext";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import PageBack from "../../components/base/PageBack";
import useTime from "../../hooks/formatTime";
import QRcode from "../../components/base/QRcode";
import langContext from "../../components/provider/LangProvider/LangContext";
import AppButton from "../../components/base/AppButton/AppButton";
import AddressList from "../../components/base/AddressList/AddressList";

function EventCheckIn() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const {eventId} = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [isHoster, setIsHoster] = useState(false)
    const [isJoin, setIsJoin] = useState(false)
    const [hoster, setHoster] = useState<Profile | null>(null)
    const [participants, setParticipants] = useState<ProfileSimple[]>([])
    const [hasCheckin, setHasCheckin] = useState<string[]>([])

    const {user} = useContext(userContext)
    const {showLoading, showEventCheckIn} = useContext(DialogsContext)
    const formatTime = useTime()
    const {lang} = useContext(langContext)
    const timeOut = useRef<any>(null)

    async function init(needLoading = true) {
        let unload: any = () => {}
        if (eventId) {
            if (needLoading) {
                unload = showLoading()
            }

            try {
                const eventDetails = await queryEventDetail({id: Number(eventId)})
                setEvent(eventDetails)
                setParticipants(eventDetails?.participants?.map(item => item.profile) as any)
                setHasCheckin(eventDetails?.participants?.filter(item => item.status === 'checked').map(item => item.profile.domain!) || [])

                if (eventDetails.host_info) {
                    const isDomain = eventDetails.host_info.indexOf('.') > -1
                    const profile = await getProfile(isDomain ? {domain: eventDetails.host_info} : {id: Number(eventDetails.host_info)})
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
        timeOut.current = setInterval(() => {
            init(false)
        }, 3000)

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

    const goToProfile = (username: string) => {
        const homeUrl = import.meta.env.VITE_SOLAS_HOME
        window.open(`${homeUrl}/profile/${username}`, '_blank')
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
                        {isHoster &&
                            <div className={'checkin-qrcode'}>
                                <QRcode text={eventId || ''} size={[155, 155]}/>
                                <div className={'text'}>{lang['Activity_Scan_checkin']}</div>
                            </div>
                        }

                        {isJoin && !isHoster &&
                            <div className={'checkin-checkin-btn'}>
                                <AppButton special onClick={e => {
                                    showEventCheckIn(event.id)
                                }}>{lang['Activity_Scan_checkin']}</AppButton>
                            </div>
                        }

                        {!user.id &&
                            <div className={'checkin-checkin-btn'}>
                                <div>{lang['Activity_login_des']}</div>
                            </div>
                        }

                        {user.id && !isJoin && !isHoster &&
                            <div className={'checkin-checkin-btn'}>
                                <AppButton disabled>{lang['Activity_Scan_checkin']}</AppButton>
                            </div>
                        }
                    </div>
                </div>
                <div className={'center'}>
                    <div className={'checkin-list'}>
                        <div className={'title'}>{lang['Activity_Registered_participants']}
                            <span>({hasCheckin.length} / {participants.length})</span></div>
                        <AddressList
                            onClick={e => {goToProfile(e.split('.')[0])}}
                            data={participants as any} selected={hasCheckin as any} />
                    </div>
                </div>
            </div>
        }
    </Layout>)
}

export default EventCheckIn
