import {Link, useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useState} from 'react'
import LangContext from '../../provider/LangProvider/LangContext'
import UserContext from "../../provider/UserProvider/UserContext";
import usePicture from "../../../hooks/pictrue";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import './HomeUserPanel.less'
import AppButton from "../AppButton/AppButton";
import {useParams} from "react-router-dom";
import EventHomeContext from "../../provider/EventHomeProvider/EventHomeContext";


function HomeUserPanel() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const {lang, langType} = useContext(LangContext)
    const {user} = useContext(UserContext)
    const {defaultAvatar} = usePicture()
    const {openConnectWalletDialog} = useContext(DialogsContext)
    const {eventGroup} = useContext(EventHomeContext)
    const {groupname} = useParams()


    const date = new Date().getDate()
    const day = new Date().getDay()
    const mouth = new Date().getMonth()
    const year = new Date().getFullYear()
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthName = langType === 'en'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][mouth]
        : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', "八月", '九月', '十月', '十一月', '十二月'][mouth]

    // 根据时间显示不同问候语
    const greet = () => {
        const hour = new Date().getHours()
        if (hour >= 0 && hour < 12) {
            return 'Good morning'
        } else if (hour >= 12 && hour < 18) {
            return 'Good afternoon'
        } else {
            return 'Good evening'
        }
    }

    const toCalendar = () => {
        eventGroup ? navigate(`/${eventGroup.username}/calendar`) : navigate('/')
    }

    return <div className={'home-user-panel'}>
        <div className={'greet'}>
            <div className={'center'}>
                <div className={'left-side'}>
                    {user.userName ?
                        <img src={user.avatar || defaultAvatar(user.id)} alt=""/>
                        : <img src='/images/event.png' alt=""/>
                    }
                    <div>
                        {user.userName ?
                            <>
                                <div className={'greet-text'}>{greet()}</div>
                                <div className={'name'}>{user.nickname || user.userName}</div>
                            </>
                            : <div className={'main-greet'}>{greet()}</div>
                        }
                    </div>
                </div>
                <div className={'right-size'}>
                    <div className={'date'}>{date}</div>
                    <div>
                        <div className={'day'}>{dayName[day]}</div>
                        <div className={'day'}>{monthName} {year}</div>
                    </div>
                </div>
            </div>
        </div>
        { groupname === 'shanhaiwoo' &&
            <Link to={'/merge'} className={'beast-banner'}>
                <img src="/images/merge/beast_ad.jpg" alt=""/>
            </Link>
        }
        { groupname === 'muchiangmai' &&
            <a href='https://t.me/muchiangmai' className={'beast-banner'} target={'_blank'}>
                <img src="https://ik.imagekit.io/soladata/aqmogq7u_ICL2MCBGZ" alt=""/>
            </a>
        }
        <div className={'center'}>
            <div className={'calendar-btn'} onClick={e => {
                toCalendar()
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M16 14H8C7.73478 14 7.48043 14.1054 7.29289 14.2929C7.10536 14.4804 7 14.7348 7 15C7 15.2652 7.10536 15.5196 7.29289 15.7071C7.48043 15.8946 7.73478 16 8 16H16C16.2652 16 16.5196 15.8946 16.7071 15.7071C16.8946 15.5196 17 15.2652 17 15C17 14.7348 16.8946 14.4804 16.7071 14.2929C16.5196 14.1054 16.2652 14 16 14ZM16 10H10C9.73478 10 9.48043 10.1054 9.29289 10.2929C9.10536 10.4804 9 10.7348 9 11C9 11.2652 9.10536 11.5196 9.29289 11.7071C9.48043 11.8946 9.73478 12 10 12H16C16.2652 12 16.5196 11.8946 16.7071 11.7071C16.8946 11.5196 17 11.2652 17 11C17 10.7348 16.8946 10.4804 16.7071 10.2929C16.5196 10.1054 16.2652 10 16 10ZM20 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H4C3.73478 4 3.48043 4.10536 3.29289 4.29289C3.10536 4.48043 3 4.73478 3 5V19C3 19.7956 3.31607 20.5587 3.87868 21.1213C4.44129 21.6839 5.20435 22 6 22H18C18.7956 22 19.5587 21.6839 20.1213 21.1213C20.6839 20.5587 21 19.7956 21 19V5C21 4.73478 20.8946 4.48043 20.7071 4.29289C20.5196 4.10536 20.2652 4 20 4ZM19 19C19 19.2652 18.8946 19.5196 18.7071 19.7071C18.5196 19.8946 18.2652 20 18 20H6C5.73478 20 5.48043 19.8946 5.29289 19.7071C5.10536 19.5196 5 19.2652 5 19V6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H11V7C11 7.26522 11.1054 7.51957 11.2929 7.70711C11.4804 7.89464 11.7348 8 12 8C12.2652 8 12.5196 7.89464 12.7071 7.70711C12.8946 7.51957 13 7.26522 13 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H19V19Z"
                        fill="#7492EF"/>
                </svg>
                {lang['Activity_Calendar']}
            </div>
        </div>
        {
            !user.userName &&
            <div className={'center'}>
                <div className={'home-login-panel'}>
                    <img src="/images/balloon.png" alt=""/>
                    <div className={'text'}>{lang['Activity_login_des']}</div>
                    <AppButton onClick={e => {
                        openConnectWalletDialog()
                    }} special size={'compact'}>{lang['Activity_login_btn']}</AppButton>
                </div>
            </div>
        }
    </div>

}

export default HomeUserPanel
