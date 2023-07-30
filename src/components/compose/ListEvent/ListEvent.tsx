import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import AppSwiper from "../../base/AppSwiper/AppSwiper";
import CardEvent from "../../base/Cards/CardEvent/CardEvent";
import {Event, Participants, queryMyEvent} from "../../../service/solas";
import Empty from "../../base/Empty";
import './ListEvent.less'
import UserContext from "../../provider/UserProvider/UserContext";

export interface ListEventHorizontal {
    data: Event[],
    scrollMarkRef?: any
}

function ListEventHorizontal(props: ListEventHorizontal) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [participants, setParticipants] = useState<Participants[]>([])
    const {user} = useContext(UserContext)

    useEffect(() => {
        async function fetchData() {
            if(user.authToken) {
                const res = await queryMyEvent({auth_token: user.authToken || ''})
                setParticipants(res)
            }
        }
        fetchData()
    }, [user.authToken])

    const list = props.data.map((item, index) => {
        return <CardEvent key={index} participants={participants} event={item}/>
    })

    return (<div className={'event-list'}>
        {props.data.length === 0 ? <Empty/>
            : <AppSwiper
                space={16}
                itemWidth={300}
                items={list}
                endEnhancer={ props.scrollMarkRef ? <div ref={props.scrollMarkRef}></div> : undefined}
            />
        }
    </div>)
}

export default ListEventHorizontal
