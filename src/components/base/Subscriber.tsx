import {useContext, useEffect, useRef} from 'react'
import UserContext from '../provider/UserProvider/UserContext'
import DialogsContext from '../provider/DialogProvider/DialogsContext'
import solas from '../../service/solas'

function Subscriber() {
    const {user} = useContext(UserContext)
    const {showBadgelet, showInvite, showNftpasslet, showGiftItem} = useContext(DialogsContext)
    const SubscriptionDomain = useRef('')

    // 实时接受badgelet
    useEffect(() => {
        // if (!pusher) return
        // if (!user.domain) {
        //     if (SubscriptionDomain.current) {
        //         pusher.unsubscribe(SubscriptionDomain.current)
        //     }
        //     return
        // }
        //
        // const channel = pusher.subscribe(user.domain)
        // SubscriptionDomain.current = user.domain
        // channel.bind('send_badge', async (data: any) => {
        //     const badgeletId = data.message
        //     const badgelet = await solas.queryBadgeletDetail({id: Number(badgeletId)})
        //     showBadgelet(badgelet)
        // })

    }, [user.domain])

    useEffect(() => {
        if (!user.id || !user.domain) return

        async function showPendingBadgelets() {
            const badgelets = await solas.queryAllTypeBadgelet({receiver_id: user.id!, page: 1})
            const pendingBadgelets = badgelets.filter((item) => item.status === 'pending')
            pendingBadgelets.forEach((item) => {
                if (!item.badge.badge_type || item.badge.badge_type === 'badge') {
                    showBadgelet(item)
                }

                if (item.badge.badge_type === 'gift') {
                    showGiftItem(item)
                }

                if (item.badge.badge_type === 'nftpass') {
                    showNftpasslet(item)
                }

                if (item.badge.badge_type === 'private') {
                    showBadgelet(item)
                }
            })
        }

        // showPendingBadgelets()


        async function showPendingInvite() {
            const invites = await solas.queryPendingInvite(user.id!)
            invites.forEach((item) => {
                showInvite(item)
            })
        }

        // showPendingInvite()
    }, [user.id, user.domain])

    return (<></>)
}

export default Subscriber
