import LangContext from '../../../provider/LangProvider/LangContext'
import UserContext from '../../../provider/UserProvider/UserContext'
import DialogsContext from "../../../provider/DialogProvider/DialogsContext";
import {useContext, useEffect, useRef, useState} from 'react'
import DetailWrapper from '../atoms/DetailWrapper/DetailWrapper'
import usePicture from '../../../../hooks/pictrue'
import DetailHeader from '../atoms/DetailHeader'
import solas, {Badge, Badgelet} from '../../../../service/solas'
import DetailCover from '../atoms/DetailCover'
import DetailName from '../atoms/DetailName'
import DetailArea from '../atoms/DetailArea'
import AppButton, {BTN_KIND, BTN_SIZE} from '../../../base/AppButton/AppButton'
import BtnGroup from '../../../base/BtnGroup/BtnGroup'
import DetailScrollBox from '../atoms/DetailScrollBox/DetailScrollBox'
import {useNavigate} from 'react-router-dom'
import useTime from '../../../../hooks/formatTime'
import DetailCreator from '../atoms/DetailCreator/DetailCreator'
import ReasonText from '../../../base/ReasonText/ReasonText'
import DetailDes from '../atoms/DetailDes/DetailDes'
import './DetailGift.less'
import SwiperPagination from '../../../base/SwiperPagination/SwiperPagination'

//HorizontalList deps
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination} from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

export interface DetailBadgeProps {
    badge: Badge,
    handleClose: () => void
}

function DetailGift(props: DetailBadgeProps) {
    const {lang} = useContext(LangContext)
    const {user} = useContext(UserContext)
    const {showGiftCheckIn} = useContext(DialogsContext)
    const {defaultAvatar} = usePicture()
    const navigate = useNavigate()
    const [badgelets, setBadgelets] = useState<Badgelet[]>([])
    const swiper = useRef<any>(null)
    const formatTime = useTime()
    const swiperIndex = useRef(0)

    useEffect(() => {
        async function getBadgelet() {
            const badgeWithBadgelets = await solas.queryBadgeDetail({id: props.badge.id})
            let badgelets = badgeWithBadgelets.badgelets.filter(item => {
                return item.status === 'accepted'
            })
            badgelets = badgelets.map(item => {
                item.badge = props.badge
                return item
            })
            setBadgelets(badgelets)
        }

        getBadgelet()
    }, [])

    const handleIssue = async () => {
        navigate(`/create-gift?gift=${props.badge.id}`)
        props.handleClose()
    }

    const formatExpiration = (crateTime: string, start: null | string, end: null | string) => {
        let res = 'Unlimited'
        if (start && end) {
            res = `${formatTime(start)} - ${formatTime(end)}`
        }

        if (!start && end) {
            res = `${formatTime(crateTime)} -- ${formatTime(end)}`
        }

        if (start && !end) {
            res = `Available after ${formatTime(start)}`
        }

        return res
    }

    const loginUserIsSender = user.id === props.badge.sender.id
    const swiperMaxHeight = window.innerHeight - 320
    return (
        <DetailWrapper>
            <DetailHeader title={lang['BadgeletDialog_gift_title']} onClose={props.handleClose}/>


            {(props.badge.badge_type === 'private' && !loginUserIsSender) ?
                <>
                    <DetailCover src={'/images/badge_private.png'}></DetailCover>
                    <DetailName> 🔒 </DetailName>
                    <DetailCreator isGroup={!!props.badge.group}
                                   profile={props.badge.group || props.badge.sender}/>
                    <DetailScrollBox style={{maxHeight: swiperMaxHeight - 40 + 'px'}}>
                        <DetailArea
                            title={lang['BadgeDialog_Label_Creat_Time']}
                            content={formatTime(props.badge.created_at)}/>
                        <DetailArea
                            title={lang['BadgeDialog_Label_Private']}
                            content={lang['BadgeDialog_Label_Private_text']}/>
                    </DetailScrollBox>
                </>
                : <>
                    <DetailCover src={props.badge.image_url}></DetailCover>

                    <DetailName> {props.badge.name} </DetailName>
                    <DetailCreator isGroup={!!props.badge.group}
                                   profile={props.badge.group || props.badge.sender}/>

                    {
                        badgelets.length > 0 ?
                            <div style={{width: '100%', overflow: 'hidden', maxHeight: swiperMaxHeight + 'px'}}>
                                <Swiper
                                    ref={swiper}
                                    modules={[Pagination]}
                                    spaceBetween={12}
                                    className='badge-detail-swiper'
                                    onSlideChange={(swiper) => swiperIndex.current = swiper.activeIndex}
                                    slidesPerView={'auto'}>
                                    <SwiperPagination total={badgelets.length} showNumber={3}/>
                                    {
                                        badgelets.map((badgelet, index) =>
                                            <SwiperSlide className='badge-detail-swiper-slide' key={badgelet.id}>
                                                <DetailScrollBox style={{maxHeight: swiperMaxHeight - 40 + 'px'}}>
                                                    {!!badgelet.content &&
                                                        <DetailDes>
                                                            <ReasonText text={badgelet.content}/>
                                                        </DetailDes>
                                                    }
                                                    <DetailArea
                                                        onClose={props.handleClose}
                                                        title={lang['BadgeDialog_Label_Issuees']}
                                                        content={badgelet.receiver.domain
                                                            ? badgelet.receiver.domain.split('.')[0]
                                                            : ''
                                                        }
                                                        navigate={badgelet.receiver.domain
                                                            ? `/profile/${badgelet.receiver.domain?.split('.')[0]}`
                                                            : '#'}
                                                        image={badgelet.receiver.image_url || defaultAvatar(badgelet.receiver.id)}/>

                                                    <DetailArea
                                                        title={lang['BadgeDialog_Label_Token']}
                                                        content={props.badge.domain}/>


                                                    <DetailArea
                                                        title={lang['NFT_Detail_Expiration']}
                                                        content={formatExpiration(badgelet.created_at, badgelet.starts_at || null, badgelet.expires_at || null)}/>

                                                    <DetailArea
                                                        title={lang['BadgeDialog_Label_Creat_Time']}
                                                        content={formatTime(badgelet.created_at)}/>

                                                    <DetailArea
                                                        title={lang['BadgeDialog_Label_Private']}
                                                        content={lang['BadgeDialog_Label_gift_text']}/>
                                                </DetailScrollBox>
                                            </SwiperSlide>
                                        )
                                    }
                                </Swiper>
                            </div>

                            : <DetailScrollBox style={{maxHeight: swiperMaxHeight - 60 + 'px', marginLeft: 0}}>
                                {!!props.badge.content &&
                                    <DetailDes>
                                        <ReasonText text={props.badge.content}/>
                                    </DetailDes>
                                }

                                <DetailArea
                                    title={lang['BadgeDialog_Label_Token']}
                                    content={props.badge.domain}/>

                                <DetailArea
                                    title={lang['BadgeDialog_Label_Creat_Time']}
                                    content={formatTime(props.badge.created_at)}/>

                                <DetailArea
                                    title={lang['BadgeDialog_Label_Private']}
                                    content={lang['BadgeDialog_Label_gift_text']}/>

                            </DetailScrollBox>
                    }
                </>
            }

            <BtnGroup>
                {loginUserIsSender &&
                    <>
                        <AppButton size={BTN_SIZE.compact} onClick={() => {
                            showGiftCheckIn(props.badge.id)
                        }} kind={BTN_KIND.primary} special>
                            {lang['Gift_detail_check_btn']}
                        </AppButton>
                        <AppButton size={BTN_SIZE.compact} onClick={() => {
                            handleIssue()
                        }} kind={'secondary'}>
                            {lang['BadgeDialog_Btn_Issue']}
                        </AppButton>
                    </>
                }
            </BtnGroup>
        </DetailWrapper>
    )
}

export default DetailGift
