import { useState, useEffect } from 'react'

export enum EVENT {
    badgeletListUpdate = 'badgeletListUpdate',
    badgeListUpdate = 'badgeListUpdate',
    presendListUpdate = 'presendListUpdate',
    groupListUpdate = 'groupListUpdate',
    profileUpdate = 'profileUpdate',
    groupUpdate = 'groupUpdate',
    pointItemListUpdate = 'pointItemListUpdate',
    pointItemUpdate = 'pointItemUpdate',
    badgeletDetailUpdate = 'badgeletDetailUpdate',
    nftpassItemUpdate = 'nftpassItemUpdate',
    giftItemUpdate = 'giftItemUpdate',
}

export default function useEvent (eventName: EVENT) {
    const [data, setData] = useState<any>(null)

    const targetOrigin = window.location.origin

    const post = (data: any) => {
        window.postMessage({event: eventName, data }, { targetOrigin })
    }

    useEffect(() => {
        const handle = (event: MessageEvent<any>) => {
            if (event.source !== window) return
            if (event.data.event !== eventName) return
            setData(event.data.data)
        }
        window.addEventListener('message', handle)

        return () => {
            window.removeEventListener('message', handle)
        }
    }, [])

    return [data, post]
}
