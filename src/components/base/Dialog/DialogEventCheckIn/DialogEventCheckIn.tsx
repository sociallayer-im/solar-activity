import './DialogEventCheckIn.less'
import {Delete, Menu} from "baseui/icon";
import LangContext from "../../../provider/LangProvider/LangContext";
import {useContext, useEffect, useState} from "react";
import ScanQrcode from "../../ScanQrcode/ScanQrcode";
import DialogsContext from "../../../provider/DialogProvider/DialogsContext";
import solas, {CheckIn, eventCheckIn, punchIn} from '../../../../service/solas'
import CheckInRecords from "../../CheckInRecords/CheckInRecords";
import AppButton from "../../AppButton/AppButton";
import UserContext from "../../../provider/UserProvider/UserContext";

export interface DialogNftCheckInProps {
    handleClose: () => any
    eventId: number
    isCheckLog?: boolean
}

function DialogEventCheckIn(props: DialogNftCheckInProps) {
    const {lang} = useContext(LangContext)
    const [canScan, setCanScan] = useState(true)
    const [showRecord, setShowRecord] = useState(false)
    const [records, setRecords] = useState<CheckIn[]>([])
    const {showToast} = useContext(DialogsContext)
    const {user} = useContext(UserContext)

    const handleScanResult = async (res: string) => {
        setCanScan(false)
        console.log('scan', res)
        console.log('is Checklog', props.isCheckLog)

        const eventId = res.split('#')[0]
        const profileId = res.split('#')[1]


        if (props.isCheckLog) {
            await handlePunchIn()
        } else {
            await checkIn()
        }

        async function handlePunchIn() {
            try {
                const punch = await punchIn({
                    auth_token: user.authToken || '',
                    id: Number(eventId)
                })
                showToast('Success !')
                setTimeout(() => {
                    props.handleClose()
                } , 1000)
            } catch (e: any) {
                console.error(e)
                showToast(e.message || 'Check in fail !')
            } finally {
                setCanScan(true)
            }
        }

        async function checkIn() {
            try {
                const checkInRes = await eventCheckIn({
                    auth_token: user.authToken || '',
                    id: Number(eventId),
                    profile_id: Number(profileId) || 0,
                })
                showToast('Checked !')
                setTimeout(() => {
                    props.handleClose()
                } , 1000)
            } catch (e: any) {
                console.error(e)
                showToast(e.message || 'Check in fail !')
            } finally {
                setTimeout(() => {
                    setCanScan(true)
                }, 1000)
            }
        }
    }

    const screenWidth = window.innerWidth
    const isMobile = screenWidth <= 768

    return <div className={isMobile ? 'dialog-nft-check-in mobile' : 'dialog-nft-check-in'}>
        {screenWidth > 768 &&
            <div className='dialog-title'>
                <span>{lang['Dialog_Check_In_Title']}</span>
                <div className='close-dialog-btn' onClick={props.handleClose}>
                    <Delete title={'Close'} size={20}/>
                </div>
            </div>
        }
        <div className={'scan-window'}>
            <ScanQrcode enable={canScan} onResult={(res) => {
                handleScanResult(res)
            }}/>
            {isMobile &&
                <div className={'btns'}>
                    <div role={"button"} onClick={props.handleClose}><Delete size={30}/></div>
                </div>
            }
        </div>
    </div>
}

export default DialogEventCheckIn
