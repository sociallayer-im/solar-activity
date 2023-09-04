import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import EventHomeContext from "./EventHomeContext";
import {getEventGroup, Profile, queryUserGroup} from "../../../service/solas";
import UserContext from "../UserProvider/UserContext";
import DialogsContext from "../DialogProvider/DialogsContext";

function EventHomeProvider(props: { children: any }) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [eventGroups, setEventGroups] = useState<Profile[]>([])
    const [availableList, setAvailableList] = useState<Profile[]>([])
    const [userGroup, setUserGroup] = useState<Profile[]>([])
    const [ready, setReady] = useState(false)
    const [selectedEventGroup, setSelectedEventGroup] = useState<Profile | null>(null)
    const [joined, setJoined] = useState(true)
    const {user} = useContext(UserContext)
    const {showToast, showLoading} = useContext(DialogsContext)

    useEffect(() => {
        const getEventGroupList = async () => {
            const unload = showLoading()
            const eventGroup = await getEventGroup()
            setEventGroups(eventGroup as Profile[])
            unload()
            setReady(true)
        }
        getEventGroupList()
    }, [])

    useEffect(() => {
        async function getAvailableList() {
            if (eventGroups.length) {
                if (user.id) {
                    const userGroup = await queryUserGroup({profile_id: user.id})
                    setUserGroup(userGroup as Profile[])
                    const res = eventGroups.filter(g => {
                        return g.group_event_visibility !== 'private' ||
                            userGroup.find(ug => ug.id === g.id)
                    })
                    setAvailableList(res as Profile[])
                } else {
                    const res = eventGroups.filter(g => {
                        return g.group_event_visibility !== 'private'
                    })
                    setAvailableList(res as Profile[])
                    setUserGroup([])
                }
            }
        }

        getAvailableList()
    }, [eventGroups, user.id])

   
    useEffect(() => {
        if (userGroup.length) {
            const joined = userGroup.find(g => {
                return selectedEventGroup?.id === g.id
            })

            setJoined(!!joined)
        }
    }, [userGroup.length, selectedEventGroup])

    const findGroup = (username: string) => {
        return eventGroups.find(p => p.username === username)
    }

    return (<EventHomeContext.Provider value={{
            userGroup,
            eventGroups,
            eventGroup: selectedEventGroup,
            setEventGroup: setSelectedEventGroup,
            findGroup,
            availableList,
            ready,
            joined
        }}>
            {props.children}
        </EventHomeContext.Provider>
    )
}

export default EventHomeProvider
