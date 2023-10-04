import {useContext, useEffect, useState} from 'react'
import './Calendar.less'
import Layout from "../../components/Layout/Layout";
import langContext from "../../components/provider/LangProvider/LangContext";
import AppSwiper from "../../components/base/AppSwiper/AppSwiper";
import {Event, getHotTags, getProfile, Profile, queryEvent, queryMyEvent} from "../../service/solas";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import usePicture from "../../hooks/pictrue";
import userContext from "../../components/provider/UserProvider/UserContext";
import Empty from "../../components/base/Empty";
import EventLabels from "../../components/base/EventLabels/EventLabels";
import {getLabelColor} from "../../hooks/labelColor";
import PageBack from "../../components/base/PageBack";
import {useParams, useNavigate, useSearchParams, useLocation} from "react-router-dom";
import EventHomeContext from "../../components/provider/EventHomeProvider/EventHomeContext";


interface EventWithProfile extends Event {
    profile: Profile | null
}

interface DateItem {
    value: string,
    date: number,
    day: string,
    monthName: string,
}



function Calendar() {
    const navigate = useNavigate()
    const {lang, langType} = useContext(langContext)
    const [selectedLabel, setSelectedLabel] = useState<string[]>([])
    const {showLoading, showToast} = useContext(DialogsContext)
    const [eventList, setEventList] = useState<EventWithProfile[]>([])
    const [onlyShowMyEvent, setOnlyShowMyEvent] = useState(false)
    const [MyEvent, setMyEvent] = useState<Event[]>([])
    const {defaultAvatar} = usePicture()
    const {user} = useContext(userContext)
    const [labels, setLabels] = useState<string[]>([])
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const {groupname} = useParams()
    const {eventGroup, setEventGroup, findGroup, ready} = useContext(EventHomeContext)

    const monthName = langType === 'cn'
        ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', "八月", '九月', '十月', '十一月', '十二月']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const now = new Date()
    const selectedDateFromParams = searchParams.get('time') ? new Date(Number(searchParams.get('time'))) : now
    const selectedDateItem = {
        value: selectedDateFromParams.toISOString(),
        date: selectedDateFromParams.getDate(),
        day: dayName[selectedDateFromParams.getDay()],
        monthName: monthName[selectedDateFromParams.getMonth()],
    }

    const [selectedDate, setSelectedDate] = useState<DateItem>(selectedDateItem)

    const [currDate, _] = useState<DateItem>({
        value: now.toISOString(),
        date: now.getDate(),
        day: dayName[now.getDay()],
        monthName: monthName[now.getMonth()],

    })

    useEffect(() => {
        const selectedDateFromParams = searchParams.get('time') ? new Date(Number(searchParams.get('time'))) : now
        const selectedDateItem = {
            value: selectedDateFromParams.toISOString(),
            date: selectedDateFromParams.getDate(),
            day: dayName[selectedDateFromParams.getDay()],
            monthName: monthName[selectedDateFromParams.getMonth()],
        }
        setSelectedDate(selectedDateItem)
    }, [searchParams.get('time')])

    useEffect(() => {
        async function fetchData2() {
            if (user.authToken) {
                const res = await queryMyEvent({auth_token: user.authToken!})
                setMyEvent(res.map(item => item.event))
            } else {
                setMyEvent([])
            }

        }

        fetchData2()
    }, [user.authToken])

    useEffect(() => {
        async function fetchData1() {
            if (groupname && ready) {
                const group = findGroup(groupname)
                setEventGroup(group)
            }
        }

        fetchData1()
    }, [groupname, ready])

    useEffect(() => {
        async function getProfileInfo(id?: number, domain?: string) {
            return await getProfile({id, domain})
        }

        async function fetchData() {
            if (!ready) return
            if (!eventGroup) return
            if (!selectedDate) return

            const unload = showLoading()
            const selected = new Date(selectedDate.value)
            try {
                let res = await queryEvent({
                    start_time_from: new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 0 , 0 ).getTime() / 1000,
                    start_time_to: new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59 ).getTime() / 1000,
                    tag: selectedLabel[0] || undefined,
                    page: 1,
                    group_id: eventGroup?.id || undefined,
                })

                if (res.length === 0) {
                    setEventList([])
                }

                const task = res.map(item => {
                    return getProfileInfo(item.host_info? Number(item.host_info) : item.owner_id)
                })

                const eventWithProfile: EventWithProfile[] = []
                await Promise.all(task).then((profiles) => {
                    profiles.map((profile, index) => {
                        eventWithProfile.push({
                            ...res[index],
                            profile
                        })
                    })
                })

                console.log(res)
                setEventList(eventWithProfile)
                unload()
            } catch (e: any) {
                unload()
                console.error(e)
                showToast(e.message)
            }
        }

        fetchData()
    }, [selectedDate, selectedLabel, eventGroup, ready])

    // 一个今年1月1日到12月31日时间戳的数组
    const dateList: DateItem[] = Array.from({length: 365}, (v, k) => k + 1).map(item => {
        const date = new Date(now.getFullYear(), 0, item)
        return {
            value: date.toISOString(),
            date: date.getDate(),
            day: dayName[date.getDay()],
            monthName: monthName[date.getMonth()],
        }
    })

    let initIndex = 0
    const items = dateList.map((item, index) => {
        const showMonth = index === 0 || item.monthName !== dateList[index - 1].monthName
        let className = 'calendar-item'
        if (item.monthName === monthName[now.getMonth()] && item.date === now.getDate()) {
            className = className + ' current'
            initIndex = index
        }

        const selected = new Date(selectedDate.value)
        if (item.monthName === monthName[selected.getMonth()] && item.date === selected.getDate()) {
            className = className + ' active'
        }

        return <div className={className} onClick={e => {
            const href = location.pathname + '?time=' + new Date(item.value).getTime().toString()
            navigate(href)
            setSelectedDate(item)
        }}>
            <div>{showMonth ? item.monthName : ''}</div>
            <div className={'inside'}>
                <div>{item.day}</div>
                <div>{item.date}</div>
            </div>
        </div>
    })

    // if (initIndex > 6) {
    //     initIndex = initIndex - 6
    // }

    // start_time 和 end_time 相同的为同一组, 并且按照是否是自己的事件分组
    let groupedEvent: EventWithProfile[][] = []
    let list = eventList.sort((a, b) => {
        return new Date(a.start_time!).getTime() - new Date(b.start_time!).getTime()
    })

    if (onlyShowMyEvent) {
        list = eventList.filter(item => {
            return MyEvent.find(event => event.id === item.id)
        })
    }

    if (list.length > 0) {
        list.forEach(item => {
            const group = groupedEvent
                .find(group => group[0].start_time === item.start_time && group[0].ending_time === item.ending_time)
            if (group) {
                group.push(item)
            } else {
                groupedEvent.push([item])
            }
        })
    }

    const gotoEventDetail = (id: number) => {
        window.location.href=`/event/${id}`
    }

    return (<Layout>
        <div className={'calendar-page'}>
            <div className={'page-title'}>
                <div className={'center'}>
                    <PageBack onClose={() => {
                        navigate(`/${eventGroup?.username || ''}`)
                    }} />
                </div>
                <div className={'center'}>
                    <div className={'left'}>{lang['Activity_Calendar']}</div>
                    <div className={'right'}>
                        <div className={'date'}>{currDate.date}</div>
                        <div className={'other'}>
                            <div className={'item'}>{currDate.day}</div>
                            <div className={'item'}>{currDate.monthName} {now.getFullYear()}</div>
                        </div>
                    </div>
                </div>
                <div className={'calendar-bar'}>
                    <AppSwiper items={items} space={10} itemWidth={40} initIndex={initIndex}/>
                </div>
            </div>


            <div className={'calendar-event-list'}>
                { !!eventGroup && eventGroup.group_event_tags &&
                    <div className={'label-bar'}>
                        <EventLabels single data={eventGroup.group_event_tags} value={selectedLabel} onChange={
                            (value) => {
                                setSelectedLabel(value)
                            }
                        }/>
                    </div>
                }
                <div className={'calendar-event-title'}>
                    <div className={'col1'}>{lang['Activity_Calendar_Page_Time']}</div>
                    <div className={'col2'}>{lang['Activity_Calendar_Page_Name']}</div>
                    {
                        !!user.id &&
                        <div className={onlyShowMyEvent ? 'col3 active' : 'col3'} onClick={e => {
                            setOnlyShowMyEvent(!onlyShowMyEvent)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21"
                                 fill="none">
                                <path
                                    d="M12.267 7.82533L8.692 11.4087L7.317 10.0337C7.24229 9.94642 7.15036 9.87557 7.04697 9.82555C6.94358 9.77554 6.83097 9.74743 6.71621 9.74299C6.60144 9.73856 6.487 9.7579 6.38006 9.79979C6.27312 9.84169 6.176 9.90524 6.09479 9.98645C6.01357 10.0677 5.95003 10.1648 5.90813 10.2717C5.86624 10.3787 5.8469 10.4931 5.85133 10.6079C5.85576 10.7226 5.88387 10.8352 5.93389 10.9386C5.98391 11.042 6.05476 11.134 6.142 11.2087L8.10033 13.1753C8.1782 13.2526 8.27054 13.3137 8.37207 13.3551C8.4736 13.3966 8.58232 13.4176 8.692 13.417C8.91061 13.4161 9.12011 13.3293 9.27533 13.1753L13.442 9.00866C13.5201 8.93119 13.5821 8.83902 13.6244 8.73747C13.6667 8.63592 13.6885 8.527 13.6885 8.41699C13.6885 8.30698 13.6667 8.19806 13.6244 8.09651C13.5821 7.99496 13.5201 7.90279 13.442 7.82533C13.2859 7.67012 13.0747 7.583 12.8545 7.583C12.6343 7.583 12.4231 7.67012 12.267 7.82533ZM10.0003 2.16699C8.35215 2.16699 6.74099 2.65573 5.37058 3.57141C4.00017 4.48709 2.93206 5.78858 2.30133 7.3113C1.6706 8.83401 1.50558 10.5096 1.82712 12.1261C2.14866 13.7426 2.94234 15.2274 4.10777 16.3929C5.27321 17.5583 6.75807 18.352 8.37458 18.6735C9.99109 18.9951 11.6666 18.8301 13.1894 18.1993C14.7121 17.5686 16.0136 16.5005 16.9292 15.1301C17.8449 13.7597 18.3337 12.1485 18.3337 10.5003C18.3337 9.40598 18.1181 8.32234 17.6993 7.3113C17.2805 6.30025 16.6667 5.38159 15.8929 4.60777C15.1191 3.83395 14.2004 3.22012 13.1894 2.80133C12.1783 2.38254 11.0947 2.16699 10.0003 2.16699ZM10.0003 17.167C8.68179 17.167 7.39286 16.776 6.29653 16.0435C5.2002 15.3109 4.34572 14.2697 3.84113 13.0515C3.33655 11.8334 3.20453 10.4929 3.46176 9.19972C3.719 7.90652 4.35393 6.71863 5.28628 5.78628C6.21863 4.85393 7.40652 4.21899 8.69973 3.96176C9.99293 3.70452 11.3334 3.83654 12.5516 4.34113C13.7697 4.84571 14.8109 5.7002 15.5435 6.79652C16.276 7.89285 16.667 9.18178 16.667 10.5003C16.667 12.2684 15.9646 13.9641 14.7144 15.2144C13.4641 16.4646 11.7684 17.167 10.0003 17.167Z"
                                    fill="#272928"/>
                            </svg>
                            {lang['Activity_Detail_Btn_Joined']}
                        </div>
                    }
                </div>
                {
                    !!groupedEvent.length ?
                        <div className={'grouped-events'}>
                            {
                                groupedEvent.map((group, index) => {
                                    return <div className={'grouped-events-item'} key={index}>
                                        <div className={'col1'}>
                                            <div
                                                className={'start'}>{(new Date(group[0].start_time!).getHours() + '').padStart(2, '0')} : {(new Date(group[0].start_time!).getMinutes() + '').padStart(2, '0')}</div>
                                            {
                                                group[0].ending_time &&
                                                <div
                                                    className={'ending'}>{(new Date(group[0].ending_time!).getHours() + '').padStart(2, '0')} : {(new Date(group[0].ending_time!).getMinutes() + '').padStart(2, '0')}</div>
                                            }
                                        </div>
                                        <div className={'col2'}>
                                            {
                                                group.map(item => {
                                                    return (
                                                        <div className={'event-item'}
                                                             key={item.id}
                                                             onClick={e => {
                                                                 gotoEventDetail(item.id)
                                                             }}>
                                                            <div className={'label-color'}>
                                                                {
                                                                   item.tags?.map((tag, index) => {
                                                                       return <span key={index} style={{background: getLabelColor(tag)}} />
                                                                   })
                                                                }
                                                            </div>
                                                            <div className={'event-name'}>{item.title}</div>
                                                            <div className={'creator'}>
                                                                <img
                                                                    src={item.profile?.image_url || defaultAvatar(item.profile?.id)}
                                                                    alt=""/>
                                                                {item.profile?.nickname || item.profile?.username || ''}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        : <Empty/>
                }
            </div>
        </div>
    </Layout>)
}

export default Calendar
