import { createContext } from 'react'
import { User } from './UserProvider'

const emptyUser: User = {
    id: null,
    userName: null,
    avatar: null,
    domain: null,
    email: null,
    wallet: null,
    twitter: null,
    authToken: null,
    nickname: null,
    eventGroup: null,
}

const UserContext  = createContext<UserContextType>({
    user: emptyUser,
    setUser: (data: Partial<Record<keyof User, any>>):void => {},
    logOut: ():void => {},
    walletLogin: ():void => {},
    emailLogin: ():void => {},
    setProfile: (data:{ authToken: string, address?: string | undefined, email?: string | undefined }):void => {}
})

export interface UserContextType {
    user: User,
    walletLogin: () => any
    emailLogin: () => any
    setUser: (data: Partial<Record<keyof User, any>>) => any,
    logOut: (data?: Partial<Record<keyof User, any>>) => any
    setProfile: (data:{ authToken: string, address?: string | undefined, email?: string | undefined }) => any
}

export default UserContext
