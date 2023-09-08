import {useContext, useEffect, useState} from 'react'
import langContext from "../../provider/LangProvider/LangContext";
import './HomePageSwitcher.less'
import TriangleDown from "baseui/icon/triangle-down";
import {Profile} from "../../../service/solas";
import userContext from "../../provider/UserProvider/UserContext";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import EventHomeContext from "../../provider/EventHomeProvider/EventHomeContext";

function HomePageSwitcher() {
    const {lang} = useContext(langContext)
    const [showList, setShowList] = useState(false)
    const {user} = useContext(userContext)
    const {showToast, showLoading} = useContext(DialogsContext)
    const {groupname} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const {eventGroups: groupList, ready, setEventGroup, findGroup, eventGroup, availableList, leadingEvent} = useContext(EventHomeContext)

    useEffect(() => {
        if (ready && location.pathname === '/') {
            navigate(`/${groupList[0].username}`)
            return
        }

        if (ready && groupname) {
            const group = findGroup(groupname)
            if (!group) {
                navigate('/')
                return
            }

            setEventGroup(group)
            return
        }
    }, [ready, groupname, groupList])


    const switchList = () => {
        if (showList) {
            document.querySelector('body')!.style.overflow = 'auto'
        } else {
            document.querySelector('body')!.style.overflow = 'hidden'
        }
        setShowList(!showList)
    }

    const setSelect = async (group: Profile) => {
        navigate(`/${group.username}`)
    }

    const home = import.meta.env.VITE_SOLAS_HOME
    return (<div className={'home-page-switcher'}>
        <a href={home} className={'badge-page'}>{lang['Nav_Badge_Page']}</a>
        <div className={ 'group-page active' } onClick={switchList}>
            {eventGroup ?
                leadingEvent?.id === eventGroup.id ?
                    <img src={leadingEvent.logo} alt={''} />
                    :  (eventGroup.nickname || eventGroup.username)
                : lang['Nav_Event_Page']
            }
            <TriangleDown/>
        </div>
        {showList &&
            <div className={'group-list'}>
                <div className={'shell'} onClick={switchList}/>
                <div className={'list-content'}>
                    {
                        availableList.map((group, index) => {
                            return <div className={group.id === eventGroup?.id ? 'list-item active' : 'list-item'}
                                        key={index}
                                        onClick={() => {
                                            setSelect(group)
                                            switchList()
                                        }}>
                                { leadingEvent?.id === group.id ?
                                    <img src={leadingEvent.logo} alt={''} />
                                    :  (group.nickname || group.username)}
                            </div>
                        })
                    }
                </div>
            </div>
        }
    </div>)
}

export default HomePageSwitcher
