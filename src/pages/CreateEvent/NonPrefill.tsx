import {useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import PageBack from '../../components/base/PageBack'
import './CreateBadge.less'
import LangContext from '../../components/provider/LangProvider/LangContext'
import UploadImage from '../../components/compose/UploadImage/UploadImage'
import AppInput from '../../components/base/AppInput'
import UserContext from '../../components/provider/UserProvider/UserContext'
import AppButton, {BTN_KIND} from '../../components/base/AppButton/AppButton'
import solas, {
    Badge,
    CreateEventProps,
    getEventSide,
    getHotTags,
    Group,
    inviteGuest,
    Profile,
    queryEvent,
    updateEvent,
    getProfile, createSite,setEventBadge
} from '../../service/solas'
import DialogsContext from '../../components/provider/DialogProvider/DialogsContext'
import ReasonInput from '../../components/base/ReasonInput/ReasonInput'
import SelectCreator from '../../components/compose/SelectCreator/SelectCreator'
import AppDateInput from "../../components/base/AppDateInput/AppDateInput";
import {Delete} from "baseui/icon";
import {Select} from "baseui/select";
import Toggle from "../../components/base/Toggle/Toggle";
import IssuesInput from "../../components/base/IssuesInput/IssuesInput";
import EventLabels from "../../components/base/EventLabels/EventLabels";
import DialogIssuePrefill from "../../components/base/Dialog/DialogIssuePrefill/DialogIssuePrefill";
import {OpenDialogProps} from "../../components/provider/DialogProvider/DialogProvider";

interface CreateEventPageProps {
    eventId?: number
}

// 函数，一天24小时分成若干时间时间点，步进为15分钟, 然后找出和当前时间最近的时间点,而且时间点必须大于等于当前时间
const getNearestTime = () => {
    const now = new Date()
    const minutes = now.getMinutes()
    const minuteRange = [0, 15, 30, 45, 60]
    const nearestMinute = minuteRange.find((item) => {
        return item>= minutes
    })

    const initStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), nearestMinute || 0)
    const initEndTime = new Date(initStartTime.getTime() + 60 * 60 * 1000)

    return [initStartTime, initEndTime]
}

const initTime = getNearestTime()

function CreateEvent(props: CreateEventPageProps) {
    const navigate = useNavigate()
    const {user} = useContext(UserContext)
    const {showLoading, showToast, openDialog} = useContext(DialogsContext)
    const [searchParams, _] = useSearchParams()
    const [creator, setCreator] = useState<Group | Profile | null>(null)
    const {lang} = useContext(LangContext)

    const [cover, setCover] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [locationType, setLocationType] = useState<'online' | 'offline' | 'both'>('offline')
    const [onlineUrl, setOnlineUrl] = useState('')
    const [eventSite, setEventSite] = useState<any>([])
    const [maxParticipants, setMaxParticipants] = useState<number>(10) // default 10
    const [minParticipants, setMinParticipants] = useState<number>(3) // default 3
    const [guests, setGuests] = useState<string[]>([''])
    const [label, setLabel] = useState<string[]>([])
    const [badgeId, setBadgeId] = useState<null | number>(null)

    const [start, setStart] = useState(initTime[0].toISOString())
    const [ending, setEnding] = useState(initTime[1].toISOString())

    const [enableMaxParticipants, setEnableMaxParticipants] = useState(true)
    const [enableMinParticipants, setEnableMinParticipants] = useState(false)
    const [enableGuest, setEnableGuest] = useState(true)
    const [hasDuration, setHasDuration] = useState(true)
    const [badgeDetail, setBadgeDetail] = useState<Badge | null>(null)
    const [labels, setLabels] = useState<string[]>([])
    const [presetLocations, setPresetLocations] = useState<{ label: string, id: number }[]>([])
    const [onlineUrlError, setOnlineUrlError] = useState('')
    const isEditMode = !!props.eventId
    const [siteOccupied, setSiteOccupied] = useState(false)
    const location = useLocation()

    const toNumber = (value: string, set: any) => {
        if (!value) {
            set(0)
            return
        }

        const number = parseInt(value)
        if (!isNaN(number)) {
            set(number)
        }
    }

    useEffect(() => {
        const checkUrl = (url: string) => {
            if (!url) {
                setOnlineUrlError('')
                return
            }

            try {
                new URL(url)
                setOnlineUrlError('')
            } catch (e) {
                setOnlineUrlError('Invalid Online address')
            }
        }
        checkUrl(onlineUrl)
    }, [onlineUrl])

    useEffect(() => {
        async function fetchBadgeDetail() {
            if (badgeId) {
                const badge = await solas.queryBadgeDetail({id: badgeId})
                setBadgeDetail(badge)
            }
        }

        fetchBadgeDetail()
    }, [badgeId])

    useEffect(() => {
        async function fetchEventDetail() {
            if (isEditMode) {
                try {
                    const event = await solas.queryEventDetail({id: props.eventId!})
                    if (!event) {
                        showToast('event not found')
                        navigate('/error')
                        return
                    }

                    setCover(event.cover)
                    setTitle(event.title)
                    setContent(event.content)
                    if (event.start_time) {
                        setStart(event.start_time)
                    }
                    if (event.ending_time) {
                        setEnding(event.ending_time)
                        setHasDuration(true)
                    }
                    setLocationType(event.location_type)
                    setOnlineUrl(event.online_location || '')
                    setEventSite(event.event_site ? [{label: event.event_site.title, id: event.event_site.id}] : [])
                    if (event.max_participant) {
                        setMaxParticipants(event.max_participant)
                        setEnableMaxParticipants(true)
                    }
                    if (event.min_participant) {
                        setMinParticipants(event.min_participant)
                        setEnableMinParticipants(true)
                    }

                    if (event.participants) {
                        const gustList = event.participants
                            .filter(p => p.role === 'guest')
                            .map((p) => p.profile.domain!)
                        setEnableGuest(true)
                        setGuests([...gustList, ''])
                    }

                    setLabel(event.tags ? event.tags : [])
                    setBadgeId(event.badge_id)

                    if (event.host_info) {
                        const profile = await getProfile({id: Number(event.host_info)})
                        setCreator(profile)
                    } else {
                        const profile = await getProfile({id:event.owner_id})
                        setCreator(profile)
                    }

                } catch (e: any) {
                    showToast(e.message)
                    navigate('/error')
                }
            }
        }

        async function fetchTags() {
            const tags = await getHotTags()
            setLabels(tags)
        }

        async function fetchCreator() {
            const tags = await getHotTags()
            setLabels(tags)
        }


        fetchTags()
        fetchEventDetail()
    }, [])

    useEffect(() => {
        async function fetchLocation() {
            if (creator?.is_group) {
                const location = await getEventSide({group_id: creator.id})
                setPresetLocations(location.map((l) => ({label: l.title, id: l.id})))
            }
        }

        fetchLocation()
    }, [creator?.is_group])

    // 检查event_site在设置的event.start_time和event.ending_time否可用
    useEffect(() => {
        async function getEventBySiteAndDate() {
            if (eventSite[0] && start && ending) {
                const startDate = new Date(start).getFullYear() + '-' + (new Date(start).getMonth() + 1) + '-' + new Date(start).getDate()
                const endDate = new Date(ending).getFullYear() + '-' + (new Date(ending).getMonth() + 1) + '-' + new Date(ending).getDate()
                console.log('eventSite', eventSite[0])
                let events = await queryEvent({
                    event_site_id: eventSite[0].id,
                    date: startDate,
                    page: 1
                })
                console.log('eventseventsevents', events)

                // 排除自己
                events = events.filter((e) => e.id !== props.eventId)

                const occupied = events.some((e) => {
                    return new Date(start).getTime() >= new Date(e.start_time!).getTime() || new Date(ending).getTime() <= new Date(e.ending_time!).getTime()
                })

                setSiteOccupied(occupied)
            }
        }

        getEventBySiteAndDate()
    }, [start, ending, eventSite])

    const showBadges = async () => {
        const props = creator?.is_group ? {
                group_id: creator!.id,
                page: 1
            } :
            {
                sender_id: creator!.id,
                page: 1
            }

        const unload = showLoading()
        const badges = await solas.queryBadge(props)
        unload()

        openDialog({
            content: (close: any) => <DialogIssuePrefill
                badges={badges}
                profileId={user.id!}
                onSelect={(res) => {
                    if (res.badgeId) {
                        setBadgeId(res.badgeId)
                    }
                }}
                handleClose={close}/>,
            position: 'bottom',
            size: [360, 'auto']
        } as OpenDialogProps)
    }

    const handleCreate = async () => {
        if (siteOccupied) {
            showToast(lang['Activity_Detail_site_Occupied'])
            window.location.href = location.pathname + '#SiteError'
            return
        }

        if (onlineUrlError) {
            showToast('Invalid online address')
            return
        }

        if (new Date(start) > new Date(ending)) {
            showToast('start time should be earlier than ending time')
            return
        }

        if (!cover) {
            showToast('please upload cover')
            return
        }

        if (!title) {
            showToast('please input title')
            return
        }

        const props: CreateEventProps = {
            title: title.trim(),
            cover,
            content,
            tags: label,
            start_time: start,
            ending_time: hasDuration ? ending : null,
            location_type: 'both',
            max_participant: enableMaxParticipants ? maxParticipants : null,
            min_participant: enableMinParticipants ? minParticipants : null,
            badge_id: badgeId,
            host_info: creator?.is_group ? creator?.id + '' : null,
            online_location: onlineUrl || null,
            event_site_id: eventSite[0] ? eventSite[0].id : null,


            auth_token: user.authToken || ''
        }

        const unloading = showLoading(true)
        try {
            const newEvent = await solas.createEvent(props)
            if (guests.length) {
                const domains = guests.filter((g) => !!g)
                if (domains.length) {
                    const invite = await inviteGuest({
                        id: newEvent.id,
                        domains,
                        auth_token: user.authToken || ''
                    })
                }
            }
            if (badgeId) {
                const setBadge = await setEventBadge({
                    id: newEvent.id,
                    badge_id: badgeId,
                    auth_token: user.authToken || ''
                })
            }
            unloading()
            showToast('create success')
            navigate(`/success/${newEvent.id}`)
        } catch (e: any) {
            unloading()
            console.error(e)
            showToast(e.message)
        }
    }

    const handleSave = async () => {
        if (siteOccupied) {
            showToast(lang['Activity_Detail_site_Occupied'])
            window.location.href = location.pathname + '#SiteError'
            return
        }

        if (onlineUrlError) {
            showToast('Invalid online address')
            return
        }

        if (new Date(start) > new Date(ending)) {
            showToast('start time should be earlier than ending time')
            return
        }

        if (!cover) {
            showToast('please upload cover')
            return
        }

        if (!title) {
            showToast('please input title')
            return
        }

        const saveProps: CreateEventProps = {
            id: props.eventId!,
            title: title.trim(),
            cover,
            content,
            tags: label,
            start_time: start,
            location_type: 'both',
            ending_time: hasDuration ? ending : null,
            event_site_id: eventSite[0] ? eventSite[0].id : null,
            max_participant: enableMaxParticipants ? maxParticipants : null,
            min_participant: enableMinParticipants ? minParticipants : null,
            badge_id: badgeId,
            host_info: creator?.is_group ? creator?.id + '' : null,
            online_location: onlineUrl || null,
            auth_token: user.authToken || ''
        }

        const unloading = showLoading(true)
        try {
            const newEvent = await updateEvent(saveProps)
            if (guests.length) {
                const domains = guests.filter((g) => !!g)
                if (domains.length) {
                    const invite = await inviteGuest({
                        id: newEvent.id,
                        domains,
                        auth_token: user.authToken || ''
                    })
                }
            }
            unloading()
            showToast('update success')
            navigate(`/event/${newEvent.id}`)
        } catch (e: any) {
            unloading()
            console.error(e)
            showToast(e.message)
        }
    }

    return (
        <Layout>
            <div className='create-badge-page'>
                <div className='create-badge-page-wrapper'>
                    <PageBack title={lang['Activity_Create_title']}/>

                    <div className='create-badge-page-form'>
                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_Form_Cover']}</div>
                            <UploadImage
                                cropper={false}
                                imageSelect={cover}
                                confirm={(coverUrl) => {
                                    setCover(coverUrl)
                                }}/>
                        </div>

                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_Form_Name']}</div>
                            <AppInput
                                clearable
                                maxLength={30}
                                value={title}
                                errorMsg={''}
                                placeholder={''}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}/>
                        </div>

                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_Form_Details']}</div>
                            <ReasonInput unlimited value={content} onChange={(value) => {
                                setContent(value)
                            }}/>
                        </div>

                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_Form_Starttime']}</div>
                            <AppDateInput value={start} onChange={(data) => {
                                console.log('start', data)
                                setStart(data as string)
                            }}/>
                        </div>

                        {hasDuration &&
                            <div className='input-area'>
                                <div className='input-area-title'>{lang['Activity_Form_Ending']}</div>
                                <AppDateInput value={ending} onChange={(data) => {
                                    console.log('ending', data)
                                    setEnding(data as string)
                                }}/>
                            </div>
                        }

                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_Detail_Online_address']}</div>
                            <AppInput
                                clearable
                                value={onlineUrl}
                                errorMsg={onlineUrlError}
                                placeholder={'Url'}
                                onChange={(e) => {
                                    setOnlineUrl(e.target.value.trim())
                                }}/>
                        </div>

                        <div className={'input-area'}>
                            <div className='input-area-title'>{lang['Activity_Detail_Offline_location']}</div>
                            <div className={'select-location'}>
                                <i className={'icon-Outline'}/>
                                <Select
                                    clearable
                                    options={presetLocations}
                                    value={eventSite}
                                    onChange={(params) => {
                                        setEventSite(params.value)
                                    }}
                                ></Select>
                            </div>
                        </div>

                        <div className={'input-area'}>
                            <div className={'toggle'}>
                                <div className={'item-title'}>{lang['Activity_Form_participants']}</div>
                                <div className={'item-value'}>
                                    {enableMaxParticipants &&
                                        <input value={maxParticipants} onChange={
                                            e => {
                                                toNumber(e.target.value.trim(), setMaxParticipants)
                                            }
                                        }/>
                                    }

                                    {!enableMaxParticipants &&
                                        <div className={'unlimited'}>Unlimited</div>
                                    }

                                    <Toggle checked={enableMaxParticipants} onChange={e => {
                                        setEnableMaxParticipants(!enableMaxParticipants)
                                    }}/>
                                </div>
                            </div>
                        </div>

                        <div className={'input-area'}>
                            <div className={'toggle'}>
                                <div className={'item-title'}>{lang['Activity_Form_participants_Min']}</div>
                                <div className={'item-value'}>
                                    {enableMinParticipants &&
                                        <input value={minParticipants} onChange={
                                            e => {
                                                toNumber(e.target.value.trim(), setMinParticipants)
                                            }
                                        }/>
                                    }

                                    {!enableMinParticipants &&
                                        <div className={'unlimited'}>Unlimited</div>
                                    }

                                    <Toggle checked={enableMinParticipants} onChange={e => {
                                        setEnableMinParticipants(!enableMinParticipants)
                                    }}/>
                                </div>
                            </div>
                        </div>

                        <div className={'input-area'}>
                            <div className={'toggle'}>
                                <div className={'item-title'}>{lang['Activity_Form_Guest']}</div>
                                <div className={'item-value'}>

                                    <Toggle checked={enableGuest} onChange={e => {
                                        setEnableGuest(!enableGuest)
                                    }}/>
                                </div>
                            </div>

                            {enableGuest &&
                                <IssuesInput
                                    value={guests}
                                    placeholder={lang['Activity_Form_Guest']}
                                    onChange={(newIssues) => {
                                        setGuests(newIssues)
                                    }}/>
                            }
                        </div>

                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_originators']}</div>
                            <SelectCreator
                                autoSet={!isEditMode}
                                groupFirst value={creator}
                                onChange={(res) => {
                                setCreator(res)
                            }}/>
                        </div>

                        <div className={'input-area'}>
                            <div className={'input-area-title'}>{lang['Activity_Form_Label']}</div>
                            <EventLabels
                                showRecommend
                                data={labels} onChange={e => {
                                setLabel(e)
                            }} value={label}/>
                        </div>

                        <div className={'input-area'}>
                            <div className={'input-area-title'}>{lang['Activity_Form_Badge']}</div>
                            <div className={'input-area-des'}>{lang['Activity_Form_Badge_Des']}</div>
                            {!badgeId &&
                                <div className={'add-badge'} onClick={async () => {
                                    await showBadges()
                                }}>{lang['Activity_Form_Badge_Select']}</div>
                            }

                            {
                                !!badgeDetail &&
                                <div className={'banded-badge'}>
                                    <Delete size={22} onClick={e => {
                                        setBadgeId(null)
                                        setBadgeDetail(null)
                                    }
                                    }/>
                                    <img src={badgeDetail.image_url} alt=""/>
                                    <div>{badgeDetail.title}</div>
                                </div>
                            }
                        </div>

                        {isEditMode ?
                            <AppButton kind={BTN_KIND.primary}
                                       special
                                       onClick={() => {
                                           handleSave()
                                       }}>
                                {lang['Activity_Detail_Btn_Modify']}
                            </AppButton>
                            :
                            <AppButton kind={BTN_KIND.primary}
                                       special
                                       onClick={() => {
                                           handleCreate()
                                       }}>
                                {lang['Activity_Btn_Create']}
                            </AppButton>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateEvent
