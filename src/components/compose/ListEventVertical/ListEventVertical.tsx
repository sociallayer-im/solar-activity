import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import LangContext from "../../provider/LangProvider/LangContext";
import Empty from "../../base/Empty";
import CardEvent from "../../base/Cards/CardEvent/CardEvent";
import {Event, getHotTags, getProfile, Profile, queryEvent, queryRecommendEvent} from "../../../service/solas";
import AppInput from "../../base/AppInput";
import {Search} from "baseui/icon";
import EventLabels from "../../base/EventLabels/EventLabels";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import scrollToLoad from "../../../hooks/scrollToLoad";
import './ListEventVertical.less'
import userContext from "../../provider/UserProvider/UserContext";
import EventHomeContext from "../../provider/EventHomeProvider/EventHomeContext";


function ListEventVertical() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [tab2Index, setTab2Index] = useState<'latest' | 'soon' | 'past'>(searchParams.get('tab') as any || 'soon')
    const {lang} = useContext(LangContext)
    const {showLoading, showToast} = useContext(DialogsContext)
    const {user} = useContext(userContext)
    const {groupname} = useParams()
    const {ready, eventGroup} = useContext(EventHomeContext)

    const [selectTag, setSelectTag] = useState<string[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [searchKeyword, setSearchKeyWork] = useState<string>('')


    useEffect(() => {
        if (searchParams.get('tab')) {
            setTab2Index(searchParams.get('tab') as any)
        }
    }, [searchParams])

    const getEvent = async (page: number) => {
        // 获取当日0点时间戳
        const todayZero  = new Date(new Date().toLocaleDateString()).getTime() / 1000

        try {
            if (tab2Index !== 'past') {
                let res = await queryEvent({
                    page,
                    start_time_from: todayZero,
                    event_order: 'start_time_asc',
                    group_id: eventGroup?.id || undefined})
                if (selectTag[0]) {
                    res = res.filter(item => {
                        return item.tags?.includes(selectTag[0])
                    })
                }
                return res
            } else {
                let res = await queryEvent({
                    page,
                    start_time_to: todayZero,
                    event_order: 'start_time_desc',
                    group_id: eventGroup?.id || undefined})
                if (selectTag[0]) {
                    res = res.filter(item => {
                        return item.tags?.includes(selectTag[0])
                    })
                }
                return res
            }
        } catch (e: any) {
            console.error(e)
            showToast(e.message)
            return []
        }
    }

    const {list, ref, refresh, loading} = scrollToLoad({
        queryFunction: getEvent,
        immediate: true,
    })

    useEffect(() => {
        refresh()
    }, [selectTag, tab2Index, eventGroup])

    useEffect(() => {
        const getLabels = async () => {
            const res = await getHotTags()
            setLabels(res)
        }
        getLabels()
    }, [])

    return (
        <div className={'module-tabs'}>
            <div className={'tab-titles'}>
                <div onClick={() => {setTab2Index('soon'); setSearchParams({tab: 'soon'})}}
                     className={tab2Index === 'soon' ? 'module-title' : 'tab-title'}>
                    {lang['Activity_Coming']}
                </div>
                <div onClick={() => {setTab2Index('past'); setSearchParams({tab: 'past'})}}
                     className={tab2Index === 'past' ? 'module-title' : 'tab-title'}>
                    {lang['Activity_Past']}
                </div>
            </div>
            <div className={'event-search-bar'}>
                <AppInput
                    onKeyUp={(e) => {
                        e.key === 'Enter' && navigate(`/search/${searchKeyword}`)
                    }}
                    onChange={(e) => {
                        setSearchKeyWork(e.currentTarget.value)
                    }}
                    placeholder={lang['Activity_search_placeholder']}
                    value={searchKeyword}
                    startEnhancer={() => <Search/>}/>
            </div>
            { !!eventGroup && eventGroup.group_event_tags &&
                <div className={'tag-list'}>
                    <EventLabels
                        single
                        onChange={(value) => {
                            if (selectTag[0] === value[0]) {
                                setSelectTag([])
                            } else {
                                setSelectTag(value)
                            }
                        }}
                        data={eventGroup.group_event_tags}
                        value={selectTag}/>
                </div>
            }
            <div className={'tab-contains'}>
                {!list.length ? <Empty/> :
                    <div className={'list'}>
                        {
                            list.filter((item: Event) => {
                               if (tab2Index === 'past') {
                                   return true
                               } else {
                                   const now = new Date().getTime()
                                   return new Date(item.ending_time!).getTime() >= now
                               }
                            }).map((item, index) => {
                                return <CardEvent fixed={false} key={item.id} event={item}/>
                            })
                        }
                        {!loading && <div ref={ref}></div>}
                    </div>
                }
            </div>
        </div>
    )
}

export default ListEventVertical
