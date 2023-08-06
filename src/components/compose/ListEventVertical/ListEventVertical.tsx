import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import LangContext from "../../provider/LangProvider/LangContext";
import Empty from "../../base/Empty";
import CardEvent from "../../base/Cards/CardEvent/CardEvent";
import {getHotTags, queryRecommendEvent} from "../../../service/solas";
import AppInput from "../../base/AppInput";
import {Search} from "baseui/icon";
import EventLabels from "../../base/EventLabels/EventLabels";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import scrollToLoad from "../../../hooks/scrollToLoad";

function ListEventVertical() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const [tab2Index, setTab2Index] = useState<'latest' | 'soon'>('latest')
    const {lang} = useContext(LangContext)
    const {showLoading, showToast} = useContext(DialogsContext)

    const [selectTag, setSelectTag] = useState<string[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [searchKeyword, setSearchKeyWork] = useState<string>('')

    const getEvent = async (page: number) => {
        const unload = showLoading()
        try {
            let res = await queryRecommendEvent({page, rec: tab2Index})
            if (selectTag[0]) {
                res = res.filter(item => {
                    return item.tags?.includes(selectTag[0])
                })
            }
            unload()
            return res
        } catch (e: any) {
            console.error(e)
            showToast(e.message)
            unload()
            return []
        }
    }

    const {list, ref, refresh} = scrollToLoad({
        queryFunction: getEvent,
        immediate: true,
    })

    useEffect(() => {
        refresh()
    }, [selectTag, tab2Index])

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
                <div onClick={() => setTab2Index('latest')}
                     className={tab2Index === 'latest' ? 'module-title' : 'tab-title'}>
                    {lang['Activity_latest']}
                </div>
                <div onClick={() => setTab2Index('latest')}  style={{display: 'none'}}
                     className={tab2Index === 'latest' ? 'module-title' : 'tab-title'}>
                    {lang['Activity_Popular']}
                </div>
                <div onClick={() => setTab2Index('soon')}
                     className={tab2Index === 'soon' ? 'module-title' : 'tab-title'}>
                    {lang['Activity_Coming']}
                </div>
            </div>
            <div className={'event-search-bar'}>
                <AppInput
                    onKeyUp={(e) => {
                        e.key === 'Enter' && navigate(`/search/${searchKeyword}`)
                    }}
                    onChange={(e) => {setSearchKeyWork(e.currentTarget.value)}}
                    placeholder={lang['Activity_search_placeholder']}
                    value={searchKeyword}
                    startEnhancer={() => <Search/>}/>
            </div>
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
                    data={labels}
                    value={selectTag}/>
            </div>
            <div className={'tab-contains'}>
                {!list.length ? <Empty/> :
                    <div className={'list'}>
                        {
                            list.map((item, index) => {
                                return <CardEvent fixed={false} key={item.title} event={item}/>
                            })
                        }
                        <div ref={ref}></div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ListEventVertical
