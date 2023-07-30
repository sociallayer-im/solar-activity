import { useNavigate, useParams } from 'react-router-dom'
import CreateBadgeNonPrefill from './NonPrefill'
import CreateBadgeWithPrefill from './WithPrefill'

function CreateEvent() {
    const {eventId} = useParams()
    return  <CreateBadgeNonPrefill eventId={Number(eventId) || undefined}/>
}

export default CreateEvent
