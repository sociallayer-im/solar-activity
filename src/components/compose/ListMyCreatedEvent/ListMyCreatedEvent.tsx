import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect} from 'react'
import {Event, Participants, queryEvent, queryMyEvent} from '../../../service/solas'
import './ListMyCreatedEvent.less'
import ListEvent from "../ListEvent/ListEvent";
import userContext from "../../provider/UserProvider/UserContext";
import scrollToLoad from "../../../hooks/scrollToLoad";


function ListMyCreatedEvent() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [created, setCreated] = useState<Event[]>([])
    const [attended, setAttended] = useState<Event[]>([])
    const {user} = useContext(userContext)


    const getMyEvent = async (page: number) => {
        if (user.id) {
            const res = await queryEvent({owner_id: user.id, page})
            return res
        } return []
    }

    const {page, ref, list, isEmpty} = scrollToLoad({
        queryFunction: getMyEvent,
        immediate: true,
    })

    return (<div>
        <ListEvent data={list} scrollMarkRef={ref} />
    </div>)
}

export default ListMyCreatedEvent
