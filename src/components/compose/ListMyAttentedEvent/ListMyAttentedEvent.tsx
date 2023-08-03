import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect} from 'react'
import {Event, Participants, queryMyEvent}  from '../../../service/solas'
import './ListMyAttentedEvent.less'
import ListEvent from "../ListEvent/ListEvent";
import userContext from "../../provider/UserProvider/UserContext";
import scrollToLoad from "../../../hooks/scrollToLoad";


function ListMyAttentedEvent(props: {emptyCallBack?: () => any}) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [created, setCreated] = useState<Event[]>([])
    const [attended, setAttended] = useState<Event[]>([])
    const {user} = useContext(userContext)


    const getMyEvent = async (page: number) => {
        if (user.authToken) {
            const res = await queryMyEvent({auth_token: user.authToken, page})
            const list =  res.map((item: Participants) => item.event)
            if (page === 1 && list.length === 0) {
                !!props.emptyCallBack && props.emptyCallBack()
            }
            return list
        } return []
        // return []
    }

    const {page, ref, list, isEmpty} = scrollToLoad({
        queryFunction: getMyEvent,
        immediate: true,
    })

    return (<div>
        <ListEvent data={list} scrollMarkRef={ref} />
    </div>)
}

export default ListMyAttentedEvent
