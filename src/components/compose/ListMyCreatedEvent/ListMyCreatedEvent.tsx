import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect} from 'react'
import {Event, Participants, queryEvent, queryMyEvent} from '../../../service/solas'
import './ListMyCreatedEvent.less'
import ListEvent from "../ListEvent/ListEvent";
import userContext from "../../provider/UserProvider/UserContext";
import scrollToLoad from "../../../hooks/scrollToLoad";
import CardEvent from "../../base/Cards/CardEvent/CardEvent";
import HorizontalList from "../../base/HorizontalList/HorizontalList";


function ListMyCreatedEvent(props: {emptyCallBack?: () => any}) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [created, setCreated] = useState<Event[]>([])
    const [attended, setAttended] = useState<Event[]>([])
    const {user} = useContext(userContext)


    const getMyEvent = async (page: number) => {
        if (user.id) {
            const res = await queryEvent({owner_id: user.id, page})
            if (page === 1 && res.length === 0) {
                !!props.emptyCallBack && props.emptyCallBack()
            }
            return res
        } return []
    }

    return (<div>
        <HorizontalList
            queryFunction={ getMyEvent }
            item={(itemData: Event) => <CardEvent event={itemData} />}
            space={ 16 }
            itemWidth={ 300 }
        />
    </div>)
}

export default ListMyCreatedEvent
