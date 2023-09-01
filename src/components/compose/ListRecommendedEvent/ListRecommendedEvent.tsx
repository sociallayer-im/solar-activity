import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useState, useRef, useEffect} from 'react'
import {Event, queryRecommendEvent} from '../../../service/solas'
import './ListRecommendedEvent.less'
import userContext from "../../provider/UserProvider/UserContext";
import HorizontalList from "../../base/HorizontalList/HorizontalList";
import CardEvent from "../../base/Cards/CardEvent/CardEvent";
import LangContext from "../../provider/LangProvider/LangContext";

function ListRecommendedEvent() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [created, setCreated] = useState<Event[]>([])
    const [attended, setAttended] = useState<Event[]>([])
    const {user} = useContext(userContext)
    const {lang} = useContext(LangContext)
    const [showList, setShowList] = useState(true)
    const list = useRef<any>(null)

    const getMyEvent = async (page: number) => {
        const res = await queryRecommendEvent({page: page, rec: 'top'})
        setShowList(!(page === 1 && res.length === 0))
        return res
    }

    return (<>
        { showList &&
            <div>
                <div className={'module-title'}>
                    {lang['Activity_Commended']}
                </div>
                <HorizontalList
                    queryFunction={getMyEvent}
                    item={(itemData: Event) => <CardEvent event={itemData}/>}
                    space={16}
                    itemWidth={300}
                    itemHeight={164}
                    onRef={list}
                />
            </div>
        }
    </>)
}

export default ListRecommendedEvent
