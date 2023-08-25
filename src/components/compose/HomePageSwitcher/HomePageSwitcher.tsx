import {useState, useContext, useEffect} from 'react'
import langContext from "../../provider/LangProvider/LangContext";
import './HomePageSwitcher.less'
import TriangleDown from "baseui/icon/triangle-down";
import {Profile, queryUserGroup, getEventGroup} from "../../../service/solas";
import userContext from "../../provider/UserProvider/UserContext";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";

function HomePageSwitcher() {
    const { lang } = useContext(langContext)
    const [selectedGroup, setSelectedGroup] = useState<null | Profile>(null)
    const [showList, setShowList] = useState(false)
    const [groupList, setGroupList] = useState<Profile[]>([])
    const [joined, setJoined] = useState(false)
    const { user, setUser } = useContext(userContext)
    const {showToast, showLoading} = useContext(DialogsContext)

    useEffect(() => {
        async function init() {
            const group = window.localStorage.getItem('solar.event.home')
            if (group){
                setSelectedGroup(JSON.parse(group))
            }

            const eventGroup = await getEventGroup()
            setGroupList(eventGroup)
            setUser({eventGroup: eventGroup})
        }

        init()
    }, [])

    const check = async function () {
        if (!user.id) {
            if (selectedGroup && selectedGroup.group_event_visibility === 'private') {
                showToast('需要组织成员成员身份')
                window.localStorage.removeItem('solar.event.home')
                setSelectedGroup(null)
                setUser({eventGroup: null})
            }
            return
        }

        if (selectedGroup && selectedGroup.group_event_visibility === 'private') {
            const unload = showLoading()
            const myGroups = await queryUserGroup({profile_id: user.id})
            const joined = myGroups.some(group => group.id === selectedGroup.id)
            setJoined(joined)
            unload()

            if (!joined) {
                showToast('需要组织成员成员身份')
                window.localStorage.removeItem('solar.event.home')
                setSelectedGroup(null)
                setUser({eventGroup: null})
                return
            }
        }
    }

    useEffect(() => {
        check()
    }, [user.id])

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
            if (value.group_event_visibility === 'private') {
                if (!joined) {
                    showToast('需要组织成员成员身份')
                    return
                }
            }
        }

        setSelectedGroup(value)
        window.localStorage.setItem('solar.event.home', JSON.stringify(value))
        setUser({eventGroup: value})
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
