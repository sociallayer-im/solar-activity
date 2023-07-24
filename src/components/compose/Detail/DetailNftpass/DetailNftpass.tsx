import LangContext from '../../../provider/LangProvider/LangContext'
import UserContext from '../../../provider/UserProvider/UserContext'
import {useContext, useEffect, useRef, useState} from 'react'
import DetailWrapper from '../atoms/DetailWrapper/DetailWrapper'
import usePicture from '../../../../hooks/pictrue'
import DetailHeader from '../atoms/DetailHeader'
import solas, {NftPass, NftPasslet, PointItem} from '../../../../service/solas'
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
import './DetailNftpass.less'
import SwiperPagination from '../../../base/SwiperPagination/SwiperPagination'
import DialogsContext from "../../../provider/DialogProvider/DialogsContext";
import useEvent, {EVENT} from "../../../../hooks/globalEvent";

//HorizontalList deps
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination} from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'

export interface DetailBadgeProps {
    nftpass: NftPass,
    handleClose: () => void
}

function DetailNftpass(props: DetailBadgeProps) {
    const {lang} = useContext(LangContext)
    const {user} = useContext(UserContext)
    const {showNftCheckIn} = useContext(DialogsContext)
    const {defaultAvatar} = usePicture()
    const navigate = useNavigate()
    const [nftPasslets, setNftPasslet] = useState<NftPasslet[]>([])
    const swiper = useRef<any>(null)
    const formatTime = useTime()
    const swiperIndex = useRef(0)


    useEffect(() => {
        async function getItems() {
            const nftpassLets = await solas.queryNftPasslet({badge_id: props.nftpass.id, page: 1})
            let nftpassLetsAccepted = nftpassLets.filter(item => {
                return item.status === 'accepted'
            })

            setNftPasslet(nftpassLetsAccepted)
        }

        getItems()
    }, [])

    const handleIssue = async () => {
        navigate(`/create-nftpass?nftpass=${props.nftpass.id}`)
        props.handleClose()
    }

    const loginUserIsSender = user.id === props.nftpass.sender.id
    const swiperMaxHeight = window.innerHeight - 320
    return (
        <DetailWrapper>
            <DetailHeader title={lang['NFT_Detail_title']} onClose={props.handleClose}/>
            <DetailCover src={props.nftpass.image_url}></DetailCover>
            <DetailName> {props.nftpass.name} </DetailName>

            <DetailCreator isGroup={!!props.nftpass.group}
                           profile={props.nftpass.group || props.nftpass.sender}></DetailCreator>

            {nftPasslets.length > 0 ?
                <div style={{width: '100%', overflow: 'hidden', maxHeight: swiperMaxHeight + 'px'}}>
                    <Swiper
                        ref={swiper}
                        modules={[Pagination]}
                        spaceBetween={12}
                        className='badge-detail-swiper'
                        onSlideChange={(swiper) => swiperIndex.current = swiper.activeIndex}
                        slidesPerView={'auto'}>
                        <SwiperPagination total={nftPasslets.length} showNumber={3}/>
                        {
                            nftPasslets.map((nft, index) =>
                                <SwiperSlide className='badge-detail-swiper-slide' key={nft.id}>
                                    <DetailScrollBox style={{maxHeight: swiperMaxHeight - 40 + 'px'}}>
                                        {!!nft.content &&
                                            <DetailDes>
                                                <ReasonText text={nft.content}/>
                                            </DetailDes>
                                        }
                                        <DetailArea
                                            onClose={props.handleClose}
                                            title={lang['BadgeDialog_Label_Issuees']}
                                            content={nft.owner.domain
                                                ? nft.owner.domain.split('.')[0]
                                                : ''
                                            }
                                            navigate={nft.owner.domain
                                                ? `/profile/${nft.owner.domain?.split('.')[0]}`
                                                : '#'}
                                            image={nft.owner.image_url || defaultAvatar(nft.owner.id)}/>

                                        <DetailArea
                                            title={lang['BadgeDialog_Label_Token']}
                                            content={props.nftpass.domain}/>

                                        <DetailArea
                                            title={lang['BadgeDialog_Label_Creat_Time']}
                                            content={formatTime(nft.created_at)}/>
                                    </DetailScrollBox>
                                </SwiperSlide>
                            )
                        }
                    </Swiper>
                </div>

                : <DetailScrollBox style={{maxHeight: swiperMaxHeight - 60 + 'px', marginLeft: 0}}>
                    {!!props.nftpass.content &&
                        <DetailDes title={lang['NFT_Detail_Des']}>
                            <ReasonText text={props.nftpass.content}/>
                        </DetailDes>
                    }

                    <DetailArea
                        title={lang['BadgeDialog_Label_Token']}
                        content={props.nftpass.domain}/>

                    <DetailArea
                        title={lang['BadgeDialog_Label_Creat_Time']}
                        content={formatTime(props.nftpass.created_at)}/>

                </DetailScrollBox>
            }

            <BtnGroup>
                {loginUserIsSender &&
                    <>
                        <AppButton size={BTN_SIZE.compact} onClick={() => {
                            showNftCheckIn(props.nftpass.id)
                        }} kind={BTN_KIND.primary}>
                            {lang['NFT_Detail_Check']}
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

export default DetailNftpass
