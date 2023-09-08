import Layout from '../../components/Layout/Layout'
import './Home.less'
import {useContext, useEffect, useState} from 'react'
import UserContext from '../../components/provider/UserProvider/UserContext'
import {useNavigate} from 'react-router-dom'
import LangContext from '../../components/provider/LangProvider/LangContext'
import HomeUserPanel from "../../components/base/HomeUserPanel/HomeUserPanel";
import AppSubTabs from "../../components/base/AppSubTabs";
import {Tab} from "baseui/tabs";
import {Event, Participants, queryEvent, queryMyEvent} from "../../service/solas";
import ListMyAttentedEvent from "../../components/compose/ListMyAttentedEvent/ListMyAttentedEvent";
import ListMyCreatedEvent from "../../components/compose/ListMyCreatedEvent/ListMyCreatedEvent";
import ListEventVertical from "../../components/compose/ListEventVertical/ListEventVertical";
import ListRecommendedEvent from "../../components/compose/ListRecommendedEvent/ListRecommendedEvent";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import EventHomeContext from "../../components/provider/EventHomeProvider/EventHomeContext";

function Home() {
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    const {lang} = useContext(LangContext)
    const {showToast} = useContext(DialogsContext)
    const {eventGroup , ready, joined} = useContext(EventHomeContext)

    const [tabIndex, setTabIndex] = useState('0')
    const [showMyCreate, setShowMyCreate] = useState(true)
    const [showMyAttend, setShowMyAttend] = useState(true)

    useEffect(() => {
        const myEvent = async () => {
            if (user.authToken) {
                const res = await queryMyEvent({auth_token: user.authToken || ''})
                const myRegistered = res.map((item: Participants) => item.event)
                const res2 = await queryEvent({owner_id: user.id!, page: 1})
                setShowMyAttend(myRegistered.length > 0)
                setShowMyCreate(res2.length > 0)
                if (myRegistered.length > 0) {
                    setTabIndex('0')
                }  else {
                    setTabIndex('1')
                }
            } else {
                setShowMyAttend(false)
                setShowMyCreate(false)
            }
        }
        myEvent()
    }, [user.authToken])

    useEffect(() => {
        if (!showMyCreate) {
            setTabIndex('0')
        }
    }, [showMyCreate])

    useEffect(() => {
        if (!showMyAttend) {
            setTabIndex('1')
        }
    }, [showMyAttend])

    const gotoCreateEvent = () => {
        if (!user.authToken) {
            showToast('Please Login to continue')
            return
        }

        if (!eventGroup) {
            return
        }

        navigate(`/${eventGroup.username}/create`)
    }


    return <Layout>
        <div className='home-page'>
            <HomeUserPanel/>
            {!!user.id &&
                <>
                    { (showMyAttend || showMyCreate) &&
                        <>
                            <div className={'center'}>
                                <div className={'module-title'}>
                                    {lang['Activity_My_Event']}
                                </div>
                            </div>
                            <div className={'center'}>
                                <AppSubTabs activeKey={tabIndex} renderAll onChange={({activeKey}) => {
                                    setTabIndex(activeKey + '')
                                }}>
                                    {showMyAttend ? <Tab title={lang['Activity_State_Registered']}>
                                        <ListMyAttentedEvent />
                                    </Tab>: <></>}

                                    { showMyCreate ?
                                        <Tab title={lang['Activity_State_Created']}>
                                            <ListMyCreatedEvent />
                                        </Tab>: <></>
                                    }
                                </AppSubTabs>
                            </div>
                        </>
                    }
                </>
            }
            {!!user.id &&
                <div className={'center'}>
                    <ListRecommendedEvent />
                </div>
            }

            <div className={'center'}>
                <ListEventVertical/>
            </div>

            {
                user.id && eventGroup && ready && (joined || eventGroup.group_event_visibility === 'public') &&
                <div className={'create-event-btn'} onClick={e => {
                    gotoCreateEvent()
                }}>+ {lang['Activity_Create_Btn']}</div>
            }
        </div>
    </Layout>
}

export default Home
