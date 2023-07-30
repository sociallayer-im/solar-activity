import {useNavigate, useSearchParams} from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'
import Layout from '../../components/Layout/Layout'
import PageBack from '../../components/base/PageBack'
import './CreateBadge.less'
import LangContext from '../../components/provider/LangProvider/LangContext'
import UploadImage from '../../components/compose/UploadImage/UploadImage'
import AppInput from '../../components/base/AppInput'
import UserContext from '../../components/provider/UserProvider/UserContext'
import AppButton, {BTN_KIND} from '../../components/base/AppButton/AppButton'
import solas, {Badge, CreateEventProps, Group, Profile, updateEvent} from '../../service/solas'
import DialogsContext from '../../components/provider/DialogProvider/DialogsContext'
import ReasonInput from '../../components/base/ReasonInput/ReasonInput'
import SelectCreator from '../../components/compose/SelectCreator/SelectCreator'
import AppDateInput from "../../components/base/AppDateInput/AppDateInput";
import {CheckIndeterminate, Delete, Plus} from "baseui/icon";
import {Select} from "baseui/select";
import Toggle from "../../components/base/Toggle/Toggle";
import IssuesInput from "../../components/base/IssuesInput/IssuesInput";
import EventLabels from "../../components/base/EventLabels/EventLabels";
import DialogIssuePrefill from "../../components/base/Dialog/DialogIssuePrefill/DialogIssuePrefill";
import {OpenDialogProps} from "../../components/provider/DialogProvider/DialogProvider";

interface CreateEventPageProps {
    eventId?: number
}

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
    const [start, setStart] = useState(new Date().toISOString())
    const [ending, setEnding] = useState(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())
    const [locationType, setLocationType] = useState<'online' | 'offline' | 'both'>('offline')
    const [onlineUrl, setOnlineUrl] = useState('')
    const [location, setLocation] = useState<any>([])
    const [maxParticipants, setMaxParticipants] = useState<number>(10) // default 10
    const [minParticipants, setMinParticipants] = useState<number>(3) // default 3
    const [guests, setGuests] = useState<string[]>([''])
    const [label, setLabel] = useState<string[]>([])
    const [badgeId, setBadgeId] = useState<null | number>(null)

    const [enableMaxParticipants, setEnableMaxParticipants] = useState(true)
    const [enableMinParticipants, setEnableMinParticipants] = useState(false)
    const [enableGuest, setEnableGuest] = useState(true)
    const [hasDuration, setHasDuration] = useState(false)
    const [badgeDetail, setBadgeDetail] = useState<Badge | null>(null)
    const isEditMode = !!props.eventId

    // 预设
    const presetLocations = [
        {label: '预设1', id: '预设1'},
        {label: '预设2', id: '预设2'},
        {label: '预设3', id: '预设3'},
    ]
    const labels = ['预设1', '预设2', '预设3', '预设4', '预设5', '预设6', '预设7', '预设8']

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
                    setLocation(event.location ? [{label: event.location, id: event.location}] : [])
                    if (event.max_participants) {
                        setMaxParticipants(event.max_participants)
                        setEnableMaxParticipants(true)
                    }
                    if (event.min_participants) {
                        setMinParticipants(event.min_participants)
                        setEnableMinParticipants(true)
                    }
                    if (event.guests) {
                        setGuests(event.guests.split(','))
                        setEnableGuest(true)
                    }
                    setLabel(event.tags ? event.tags : [])
                    setBadgeId(event.badge_id)
                } catch (e: any) {
                    showToast(e.message)
                    navigate('/error')
                }
            }
        }

        fetchEventDetail()
    }, [])

    const showBadges = async () => {
        const props = creator?.is_group ? {
                group_id: creator!.id,
                page: 1
            } :
            {
                sender_id: creator!.id,
                page: 1
            }

        const badges = await solas.queryBadge(props)

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
            location_type: locationType,
            location: location[0] ? location[0].id : null,
            max_participants: enableMaxParticipants ? maxParticipants : null,
            min_participants: enableMinParticipants ? minParticipants : null,
            guests: enableGuest ? guests.filter(item => !!item).join(',') : null,
            badge_id: badgeId,
            host_info: creator?.is_group ? creator?.id + '' : null,
            online_location: onlineUrl || null,


            auth_token: user.authToken || ''
        }

        const unloading = showLoading(true)
        try {
            const newEvent = await solas.createEvent(props)
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
            ending_time: hasDuration ? ending : null,
            location_type: locationType,
            location: location[0] ? location[0].id : null,
            max_participants: enableMaxParticipants ? maxParticipants : null,
            min_participants: enableMinParticipants ? minParticipants : null,
            guests: enableGuest ? guests.filter(item => !!item).join(',') : null,
            badge_id: badgeId,
            host_info: creator?.is_group ? creator?.id + '' : null,
            online_location: onlineUrl || null,

            auth_token: user.authToken || ''
        }

        const unloading = showLoading(true)
        try {
            const newEvent = await updateEvent(saveProps)
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

                        {hasDuration ?
                            <div className={'event-duration'} onClick={e => {
                                setHasDuration(false)
                            }}>
                                {lang['Activity_Form_Duration_Cancel']}
                                <CheckIndeterminate size={12}></CheckIndeterminate>
                            </div>
                            :
                            <div className={'event-duration'} onClick={e => {
                                setHasDuration(true)
                            }}>
                                {lang['Activity_Form_Duration']}
                                <Plus size={12}></Plus>
                            </div>
                        }

                        <div className='input-area'>
                            <div className='input-area-title'>{lang['Activity_Form_Where']}</div>
                            <div className={'take-place'}>
                                <div className={locationType === 'offline' ? 'item active' : 'item'}
                                     onClick={(e) => {
                                         setLocationType('offline')
                                     }}>
                                    {'Offline'}
                                </div>
                                <div className={locationType === 'online' ? 'item active' : 'item'}
                                     onClick={(e) => {
                                         setLocationType('online')
                                     }}>
                                    {'Online'}
                                </div>
                            </div>
                            {locationType === 'online' &&
                                <AppInput
                                    clearable
                                    value={onlineUrl}
                                    errorMsg={''}
                                    placeholder={'Url'}
                                    onChange={(e) => {
                                        setOnlineUrl(e.target.value.trim())
                                    }}/>
                            }
                            <div className={'select-location'}>
                                <i className={'icon-Outline'}/>
                                <Select
                                    clearable
                                    creatable
                                    options={presetLocations}
                                    value={location}
                                    onChange={(params) => {
                                        setLocation(params.value)
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
                            <div className='input-area-title'>{lang['BadgeDialog_Label_Creator']}</div>
                            <SelectCreator value={creator} onChange={(res) => {
                                console.log('resres', res);
                                setCreator(res)
                            }}/>
                        </div>

                        <div className={'input-area'}>
                            <div className={'input-area-title'}>{lang['Activity_Form_Label']}</div>
                            <EventLabels data={labels} onChange={e => {
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
