import { createContext } from 'react'
import {Profile} from "../../../service/solas";

interface EventHomeContextType {
    eventGroups: Profile[],
    availableList: Profile[],
    userGroup: Profile[],
    ready: boolean,
    joined: boolean,
    eventGroup: Profile | null,
    setEventGroup: (group: Profile) => any,
    findGroup: (username: string) => any,
}

const EventHomeContext = createContext<EventHomeContextType>({
    eventGroups: [],
    availableList: [],
    userGroup: [],
    ready: false,
    joined: false,
    eventGroup: null,
    setEventGroup: (group: Profile) => {},
    findGroup: (username: string) => {},
})

export default EventHomeContext
