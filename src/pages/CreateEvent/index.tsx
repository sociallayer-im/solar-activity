import { useNavigate, useParams } from 'react-router-dom'
import CreateBadgeNonPrefill from './NonPrefill'

function CreateEvent() {
    const {eventId} = useParams()
    return  <CreateBadgeNonPrefill eventId={Number(eventId) || undefined}/>
}

export default CreateEvent
