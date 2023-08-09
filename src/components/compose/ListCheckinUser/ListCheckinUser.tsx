import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import {eventCheckIn, Participants} from "../../../service/solas";
import './ListCheckinUser.less'
import usePicture from "../../../hooks/pictrue";
import LangContext from "../../provider/LangProvider/LangContext";
import UserContext from "../../provider/UserProvider/UserContext";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";

interface ListCheckinUserProps {
    participants: Participants[],
    onChange?: (selected: Participants[]) => void
    isHost?: boolean
    eventId: number
}

function ListCheckinUser(props: ListCheckinUserProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const {defaultAvatar} = usePicture()
    const {lang} = useContext(LangContext)
    const [participants, setParticipants] = useState<Participants[]>(
        props.participants
    )
    const {user} = useContext(UserContext)
    const {showLoading, showToast} = useContext(DialogsContext)

    useEffect(() => {

    }, [])

    const handleCheckin = async (item: Participants) => {
        if (!user.id) return
        if (item.check_time) return
        const unload = showLoading()
        try {
            const checkin = await eventCheckIn({
                id: props.eventId,
                auth_token: user.authToken || '',
                profile_id: item.profile.id
            })
            const newParticipants = participants.map(participant => {
                if (participant.profile.id === item.profile.id) {
                    participant.status = 'checked'
                }
                return participant
            })
            setParticipants(newParticipants)
            unload()
        } catch (e: any) {
            unload()
            console.error(e)
            showToast(e.message || 'Checkin failed')
        }
    }

    const goToProfile = (username: string) => {
        const homeUrl = import.meta.env.VITE_SOLAS_HOME
        window.location.href = `${homeUrl}/profile/${username}`
    }


    return (<div className={'checkin-user-list'}>
        {
            participants.map((item, index) => {
                const checked = item.status === 'checked'
                return <div className={!checked ? 'user-list-item uncheck' : 'user-list-item'}>
                    <div className={'left'}
                         onClick={e => {goToProfile(item.profile.domain?.split('.')[0]!)}}>
                        <img src={item.profile.image_url || defaultAvatar(item.id)} alt=""/>
                        {item.profile.domain?.split('.')[0]}
                    </div>
                    <div className={'right'}>
                        {props.isHost && !checked &&
                            <div onClick={() => {
                                handleCheckin(item)
                            }}
                                 className={'checkin-by-host'}>
                                {lang['Activity_Detail_Btn_Checkin']}
                            </div>
                        }
                    </div>
                </div>
            })
        }
    </div>)
}

export default ListCheckinUser
