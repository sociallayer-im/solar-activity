import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useState, useContext, useEffect} from 'react'
import {EventStats, getEventStats} from "../../../service/solas";
import './DashboardInfo.less'
import {Select} from "baseui/select";
import {s} from "msw/lib/glossary-de6278a9";

const daysOptions = [
    {label: 'Last 24 hours', id: 1},
    {label: 'Last 7 days', id: 7},
    {label: 'Last 30 days', id: 30},
    {label: 'Last 3 months', id: 90},
    {label: 'Last 1 year', id: 365},
]

function DashboardInfo(props: {groupid: number}) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [days, setDays] = useState<{label: string, id: number}[]>([daysOptions[0]])
    const [info, setInfo] = useState<EventStats | null>(null)

    useEffect(() => {
        getEventStats({id: props.groupid, days: days[0].id}).then((res) => {
            setInfo(res)
        })
    }, [props.groupid, days])

    return (<>
        { !!info &&
            <div className={'dashboard-info'}>
                <div className={'dashboard-title'}>
                    <div>Dashboard</div>
                    <Select
                        value={days}
                        clearable={false}
                        searchable={false}
                        options={daysOptions}
                        onChange={(params) => {
                            setDays(params.value as any)
                        }}
                    />
                </div>
                <div className={'dashboard-info-item'}>
                    <div className={'label'}>Number of participants</div>
                    <div className={'value'}>{info.total_participants}</div>
                </div>
                <div className={'dashboard-info-item'}>
                    <div className={'label'}>Number of hosts</div>
                    <div className={'value'}>{info.total_event_hosts}</div>
                </div>
                <div className={'dashboard-info-item'}>
                    <div className={'label'}>Events</div>
                    <div className={'value'}>{info.total_events}</div>
                </div>
                <div className={'dashboard-info-item'}>
                    <div className={'label'}>Badges received</div>
                    <div className={'value'}>{info.total_issued_badges}</div>
                </div>
            </div>
        }
    </>)
}

export default DashboardInfo
