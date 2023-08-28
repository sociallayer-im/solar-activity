import {useState, useContext, useEffect} from 'react'
import langContext from "../../provider/LangProvider/LangContext";
import './HomePageSwitcher.less'
import TriangleDown from "baseui/icon/triangle-down";
import {Profile, queryUserGroup, getEventGroup, getProfile} from "../../../service/solas";
import userContext from "../../provider/UserProvider/UserContext";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import {useParams, useNavigate, useLocation} from "react-router-dom";

function HomePageSwitcher() {
    const { lang } = useContext(langContext)
    const [selectedGroup, setSelectedGroup] = useState<null | Profile>(null)
    const [showList, setShowList] = useState(false)
    const [groupList, setGroupList] = useState<Profile[]>([])
    const [joined, setJoined] = useState(false)
    const [ready, setReady] = useState(false)
    const { user, setUser } = useContext(userContext)
    const {showToast, showLoading} = useContext(DialogsContext)
    const {groupname} = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const getEventGroupList = async () => {
            const unload = showLoading()
            const eventGroup = await getEventGroup()
            setGroupList(eventGroup)
            unload()
            setReady(true)
        }
        getEventGroupList()
    }, [])

    useEffect(() => {
       async function init() {
           if (ready && groupname && groupList.length) {
               const group = groupList.find(g => g.username === groupname)
               if (!group) {
                   navigate('/')
                   return
               }

               const canAccess = await check(group)
               if (!canAccess) {
                   showToast('需要加入该组织才能访问')
                   navigate('/')
                   return
               }

               setSelectedGroup(group)
           }
       }

        init()
    }, [ready, groupname, user.id, groupList])


    const check = async function (target: Profile) {
        if (target.group_event_visibility === 'private' && !user.id) {
            return false
        }

        if (target.group_event_visibility === 'private' && user.id) {
            const unload = showLoading()
            const myGroups = await queryUserGroup({profile_id: user.id})
            const joined = myGroups.some(g => g.id === target.id)
            unload()

            return joined
        }

        return true
    }

    const switchList = () => {
        if (showList){
            document.querySelector('body')!.style.overflow = 'auto'
        } else {
            document.querySelector('body')!.style.overflow = 'hidden'
        }

        setShowList(!showList)
    }

    const setSelect = async (group: Profile) => {
        const value = group.id === selectedGroup?.id ? null : group
        if (value) {
            const canAccess = await check(value)
            if (!canAccess) {
                showToast('需要加入该组织才能访问')
                return
            }

            setSelectedGroup(value)
            if (window.location.pathname.includes('calendar')) {
                navigate(`/calendar/${value.username}`)
            } else {
                const nameList = groupList.map(g => g.username)
                const isHome = nameList.some(name => {
                    return location.pathname.includes(name!)
                })
                if (isHome || location.pathname === '/') {
                    navigate(`/${value.username}`)
                }
            }
        } else {
            setSelectedGroup(null)
            if (window.location.pathname.includes('calendar')){
                navigate(`/calendar`)
            } else {
                const nameList = groupList.map(g => g.username)
                const isHome = nameList.some(name => {
                    return window.location.pathname === `/${name}`
                })
                if (isHome) {
                    navigate('/')
                }
            }
        }
    }

    const home = import.meta.env.VITE_SOLAS_HOME
    return (<div className={'home-page-switcher'}>
        <a href={home} className={'badge-page'}>{lang['Nav_Badge_Page']}</a>
        <div className={selectedGroup ? 'group-page active' : 'group-page'} onClick={switchList}>
            {selectedGroup ? (selectedGroup.nickname || selectedGroup.username) : lang['Nav_Event_Page']}
            <TriangleDown />
        </div>
        {showList &&
            <div className={'group-list'}>
                <div className={'shell'} onClick={switchList} />
                <div className={'list-content'}>
                    {
                        groupList.map((group, index) => {
                            return <div className={group.id === selectedGroup?.id ?  'list-item active': 'list-item'}
                                        key={index}
                                        onClick={() => {
                                            setSelect(group)
                                            switchList()}} >
                                {group.nickname || group.username}
                            </div>
                        })
                    }
                </div>
            </div>
        }
    </div>)
}

export default HomePageSwitcher
