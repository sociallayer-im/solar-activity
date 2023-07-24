import {useState, useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import solas, { Badge, Profile } from '../service/solas'
import DialogsContext from '../components/provider/DialogProvider/DialogsContext'
import { OpenDialogProps } from '../components/provider/DialogProvider/DialogProvider'
import DialogIssuePrefill, { BadgeBookDialogRes } from '../components/base/Dialog/DialogIssuePrefill/DialogIssuePrefill'
import UserContext from '../components/provider/UserProvider/UserContext'

export interface StartIssueBadgeProps {
    badges: Badge[]
    to?: string
}

interface UseIssueBadgeProp {
    groupName?: string
}

function useIssueBadge (useIssueBadgeProps?: UseIssueBadgeProp) {
    const { user } = useContext(UserContext)
    const { openDialog } = useContext(DialogsContext)
    const navigate = useNavigate()

    function toIssuePage (props: BadgeBookDialogRes, to?: string) {
        let path = `/create-${props.type}`

        const split = (path: string) => {
            return  path.includes('?') ? '&' : '?'
        }

        if (useIssueBadgeProps && useIssueBadgeProps.groupName) {
            const groupDomain = useIssueBadgeProps.groupName + import.meta.env.VITE_SOLAS_DOMAIN
            path = path + split(path) + `group=${groupDomain}`
        }

        if (to) {
            path = path + split(path) + `to=${to}`
        }

        if (props.badgeId) {
            path = path + split(path) + `badge=${props.badgeId}`
        }

        if (props.badgebookId) {
            path = path + split(path) + `badgebook=${props.badgeId}`
        }

        navigate(path)
    }

    return (props: StartIssueBadgeProps) => {
        // 没有登录或者没有徽章，直接跳转到徽章发行页面
        // if (!user.id) { toIssuePage({type:'badge'}, props.to); return }
        // if (!props.badges.length) {toIssuePage({type:'badge'}, props.to); return;}


        openDialog({
            content: (close: any) => <DialogIssuePrefill
                badges={ props.badges }
                profileId={ user.id! }
                onSelect= { (res) => { toIssuePage(res, props.to) } }
                handleClose={ close } />,
            position: 'bottom',
            size: [360, 'auto']
        } as OpenDialogProps)
    }
}

export default useIssueBadge
