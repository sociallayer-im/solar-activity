import LangContext from '../../provider/LangProvider/LangContext'
import UserContext from '../../provider/UserProvider/UserContext'
import DialogsContext from '../../provider/DialogProvider/DialogsContext'
import {useContext, useEffect, useState} from 'react'
import DetailWrapper from './atoms/DetailWrapper/DetailWrapper'
import usePicture from '../../../hooks/pictrue'
import DetailHeader from './atoms/DetailHeader'
import DetailBadgeletPrivateMark from './atoms/DetailBadgeletPriviateMark'
import DetailCover from './atoms/DetailCover'
import DetailName from './atoms/DetailName'
import DetailDes from './atoms/DetailDes/DetailDes'
import DetailArea from './atoms/DetailArea'
import AppButton, {BTN_KIND} from '../../base/AppButton/AppButton'
import BtnGroup from '../../base/BtnGroup/BtnGroup'
import solas, {CheckIn, NftPasslet, queryCheckInList} from '../../../service/solas'
import useEvent, {EVENT} from '../../../hooks/globalEvent'
import ReasonText from '../../base/ReasonText/ReasonText'
import DetailScrollBox from './atoms/DetailScrollBox/DetailScrollBox'
import DetailCreator from './atoms/DetailCreator/DetailCreator'
import useTime from '../../../hooks/formatTime'
import {useNavigate} from 'react-router-dom'
import QRcode from "../../base/QRcode";
import {useStyletron} from "baseui";
import CheckInRecords from "../../base/CheckInRecords/CheckInRecords";

export interface DetailNftpassletProps {
    nftpasslet: NftPasslet,
    handleClose: () => void
}

const NftpassQrcode = (props: { nftpasslet: NftPasslet }) => {
    const [css] = useStyletron()
    const {user} = useContext(UserContext)

    const wrapper = {
        width: '220px',
        height: '238px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '62px auto 62px auto',
    }
    const title = {
        fontWeight: 600,
        fontSize: '20px',
        lineHeight: '28px',
        textAlign: 'center',
        color: '#272928',
        marginBottom: '8px',
    }

    const qrcodeWrapper = {
        width: '192px',
        height: '192px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
    }

    const text = user.authToken + '##' + props.nftpasslet.id + ''

    return <div className={css(wrapper as any)}>
        <div className={css(title as any)}>Scan the QR Code</div>
        <div className={css(qrcodeWrapper as any)}>
            <QRcode size={[160, 160]} text={text}/>
        </div>
    </div>
}

function DetailNftpasslet(props: DetailNftpassletProps) {
    const {lang} = useContext(LangContext)
    const {user} = useContext(UserContext)
    const {openConnectWalletDialog, showLoading, showToast} = useContext(DialogsContext)
    const {defaultAvatar} = usePicture()
    const [_, emitUpdate] = useEvent(EVENT.giftItemUpdate)
    const [nftpasslet, setNftpasslet] = useState(props.nftpasslet)
    const isOwner = user.id === props.nftpasslet.receiver.id
    const formatTime = useTime()
    const navigate = useNavigate()
    const [showQrcode, setShowQrcode] = useState(false)
    const [showRecord, setShowRecord] = useState(false)
    const [records, setRecords] = useState<CheckIn[]>([])

    const getRecords = async () => {
        const list =  await queryCheckInList({
            badgelet_id: nftpasslet.id,
            profile_id: nftpasslet.receiver.id,
        })
        setRecords(list)
    }

    useEffect(() => {
        getRecords()
    },[])

    const handleAccept = async () => {
        const unload = showLoading()
        try {
            const accept = await solas.acceptBadgelet({
                badgelet_id: nftpasslet.id,
                auth_token: user.authToken || ''
            })

            unload()
            emitUpdate(nftpasslet)
            props.handleClose()
            showToast('Accept success')
            navigate(`/profile/${user.userName}`)
        } catch (e: any) {
            unload()
            console.log('[handleAccept]: ', e)
            showToast(e.message || 'Accept fail')
        }
    }

    const handleReject = async () => {
        const unload = showLoading()
        try {
            const reject = await solas.rejectBadgelet({
                badgelet_id: nftpasslet.id,
                auth_token: user.authToken || ''
            })

            unload()
            emitUpdate(nftpasslet)
            props.handleClose()
            showToast('rejected')
        } catch (e: any) {
            unload()
            console.log('[handleAccept]: ', e)
            showToast(e.message || 'Reject fail')
        }
    }

    const LoginBtn = <AppButton
        special
        onClick={() => {
            openConnectWalletDialog()
        }}
        kind={BTN_KIND.primary}>
        {lang['BadgeDialog_Btn_Login']}
    </AppButton>

    const ActionBtns = <>
        <AppButton
            special
            kind={BTN_KIND.primary}
            onClick={() => {
                handleAccept()
            }}>
            {lang['BadgeDialog_Btn_Accept']}
        </AppButton>
        <AppButton onClick={() => {
            handleReject()
        }}>
            {lang['BadgeDialog_Btn_Reject']}
        </AppButton>
    </>

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

    const checkAvailable = () => {
        const now = new Date().getTime()
        const start = nftpasslet.starts_at ? new Date(nftpasslet.starts_at).getTime() : null
        const end = nftpasslet.expires_at ? new Date(nftpasslet.expires_at).getTime() : null
        return !start || now >= start && (!end || now <= end)
    }

    const swiperMaxHeight = window.innerHeight - 320
    return (
        <DetailWrapper>
            <DetailHeader
                title={lang['NFT_Detail_title']}
                slotLeft={nftpasslet.hide && <DetailBadgeletPrivateMark/>}
                onClose={props.handleClose}/>

            <DetailCover src={nftpasslet.badge.image_url}></DetailCover>
            <DetailName> {nftpasslet.badge.name} </DetailName>

            {!showQrcode
                && <DetailCreator isGroup={!!nftpasslet.badge.group}
                                  profile={nftpasslet.badge.group || nftpasslet.sender}/>
            }

            { showQrcode && <>
                <NftpassQrcode nftpasslet={props.nftpasslet}/>
                <BtnGroup>
                    <AppButton
                        kind={'secondary'}
                        onClick={() => {
                            setShowQrcode(false)
                        }}>
                        {'Close'}
                    </AppButton>
                </BtnGroup>
            </> }

            { showRecord &&  <>
                <CheckInRecords data={records} title={lang['NFT_Detail_checkin_title']}/>
                <BtnGroup>
                    <AppButton
                        kind={'secondary'}
                        onClick={() => {
                            setShowRecord(false)
                        }}>
                        {'Close'}
                    </AppButton>
                </BtnGroup>
            </>
            }

            { !showQrcode && !showRecord && <>
                        <DetailScrollBox style={{maxHeight: swiperMaxHeight - 60 + 'px', marginLeft: 0}}>
                            {
                                !!nftpasslet.content &&
                                <DetailDes title={lang['NFT_Detail_Des']}>
                                    <ReasonText text={nftpasslet.content}></ReasonText>
                                </DetailDes>
                            }

                            <DetailArea
                                onClose={props.handleClose}
                                title={lang['BadgeDialog_Label_Issuees']}
                                content={nftpasslet.receiver.domain
                                    ? nftpasslet.receiver.domain.split('.')[0]
                                    : ''
                                }
                                navigate={nftpasslet.receiver.domain
                                    ? `/profile/${nftpasslet.receiver.domain?.split('.')[0]}`
                                    : '#'}
                                image={nftpasslet.receiver.image_url || defaultAvatar(nftpasslet.receiver.id)}/>

                            <DetailArea
                                title={lang['BadgeDialog_Label_Token']}
                                content={nftpasslet.domain}
                                link={nftpasslet.chain_data ? `https://moonscan.io/tx/${nftpasslet.chain_data}` : undefined}/>

                            <DetailArea
                                title={lang['BadgeDialog_Label_Creat_Time']}
                                content={formatTime(nftpasslet.created_at)}/>

                            <DetailArea
                                title={lang['NFT_Detail_Expiration']}
                                content={formatExpiration(nftpasslet.created_at, nftpasslet.starts_at || null, nftpasslet.expires_at || null)}/>

                        </DetailScrollBox>
                        <BtnGroup>
                            {!user.domain && LoginBtn}

                            {!!user.domain
                                && user.id === nftpasslet.receiver.id
                                && nftpasslet.status === 'pending'
                                && ActionBtns}

                            {!!user.domain
                                && user.id === nftpasslet.receiver.id
                                && nftpasslet.status === 'accepted'
                                && (
                                    <>
                                        {
                                            checkAvailable() ? <AppButton
                                                    special
                                                    kind={BTN_KIND.primary}
                                                    onClick={() => {
                                                        setShowQrcode(true)
                                                    }}>
                                                    {lang['NFT_Detail_use']}
                                                </AppButton>
                                                : <AppButton kind={BTN_KIND.secondary} disabled={true}>
                                                    {lang['NFT_Detail_Unavailable']}
                                                </AppButton>
                                        }
                                        { checkAvailable() && <AppButton
                                            kind={'secondary'}
                                            onClick={() => {
                                                setShowRecord(true)
                                            }}>
                                            {lang['NFT_Detail_show_record_btn']}
                                        </AppButton>
                                        }
                                    </>
                                )
                            }
                        </BtnGroup>
                    </> }
        </DetailWrapper>
    )
}

export default DetailNftpasslet
