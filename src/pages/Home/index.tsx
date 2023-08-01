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

function Home() {
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    const {lang} = useContext(LangContext)

    const [tabIndex, setTabIndex] = useState('0')
    const [registered, setRegistered] = useState<Event[]>([])
    const [created, setCreated] = useState<Event[]>([])


    const start = async () => {

    }

    useEffect(() => {
        const myEvent = async () => {
            if (user.authToken) {
                const res = await queryMyEvent({auth_token: user.authToken || ''})
                const myRegistered = res.map((item: Participants) => item.event)
                setRegistered(myRegistered)

                const res2 = await queryEvent({owner_id: user.id!, page: 1})
                setCreated(res2)
            }
        }
        myEvent()
    }, [user.authToken])

    const gotoCreateEvent = () => {
        navigate('/event/create')
    }

    return <Layout>
        <div className='home-page'>
            <HomeUserPanel/>
            {!!user.id &&
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
                            <Tab title={lang['Activity_State_Registered']}>
                                <ListMyAttentedEvent/>
                            </Tab>
                            <Tab title={lang['Activity_State_Created']}>
                                <ListMyCreatedEvent/>
                            </Tab>
                        </AppSubTabs>
                    </div>
                </>
            }
            {!!user.id &&
                <div className={'center'}>
                    <div className={'module-title'}>
                        {lang['Activity_Commended']}
                    </div>
                    <ListMyCreatedEvent/>
                </div>
            }

            <div className={'center'}>
                <ListEventVertical/>
            </div>

            <div className={'create-event-btn'} onClick={e => {
                gotoCreateEvent()
            }}>+ {lang['Activity_Create_title']}</div>
        </div>
    </Layout>
}

export default Home
