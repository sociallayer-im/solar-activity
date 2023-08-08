import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect} from 'react'
import {Event, Participants, queryEvent, queryMyEvent} from '../../../service/solas'
import './ListRecommendedEvent.less'
import ListEvent from "../ListEvent/ListEvent";
import userContext from "../../provider/UserProvider/UserContext";
import scrollToLoad from "../../../hooks/scrollToLoad";
import HorizontalList from "../../base/HorizontalList/HorizontalList";
import CardEvent from "../../base/Cards/CardEvent/CardEvent";


function ListRecommendedEvent() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [created, setCreated] = useState<Event[]>([])
    const [attended, setAttended] = useState<Event[]>([])
    const {user} = useContext(userContext)


    const getMyEvent = async (page: number) => {
        if (user.id) {
            const res = await queryEvent({tag: 'Recommended', page: page})
            return res
        } return []
    }

    const {page, ref, list, isEmpty} = scrollToLoad({
        queryFunction: getMyEvent,
        immediate: true,
    })

    return (<div>
        <HorizontalList
            queryFunction={ getMyEvent }
            item={(itemData: Event) => <CardEvent event={itemData} />}
            space={ 16 }
            itemWidth={ 300 }
        />
    </div>)
}

export default ListRecommendedEvent
