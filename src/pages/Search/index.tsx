import {useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState} from 'react'
import LangContext from '../../components/provider/LangProvider/LangContext'
import Layout from '../../components/Layout/Layout'
import './Search.less'
import PageBack from "../../components/base/PageBack";
import AppInput from "../../components/base/AppInput";
import CardEvent from "../../components/base/Cards/CardEvent/CardEvent";
import {searchEvent, Event} from "../../service/solas";
import DialogsContext from "../../components/provider/DialogProvider/DialogsContext";
import Empty from "../../components/base/Empty";


function SearchPage() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const {keyword} = useParams()
    const {lang} = useContext(LangContext)
    const [keywordState, setKeywordState] = useState<string>('')
    const {showLoading} = useContext(DialogsContext)
    const [result, setResult] = useState<Event[]>([])

    const handleSearch = async (keyword: string) => {
        const unload = showLoading()
        try {
            const res = await searchEvent(keyword)
            unload()
            setResult(res)
            navigate('/search/' + keyword)
        } catch (e: any) {
            console.error(e)
            unload()
        }
    }

    useEffect(() => {
        if (keyword) {
            setKeywordState(keyword)
            handleSearch(keyword)
        }
    }, [keyword])

    return (<Layout>
        <div className='search-result-page'>
            <div className={'center'}>
                <PageBack />
                <div className={'event-search'}>
                    <AppInput
                        onKeyUp={e => { if (e.key === 'Enter') handleSearch(keywordState) }}
                        startEnhancer={() => <i className={'iconfont icon-search'}></i>}
                        value={keywordState}
                        onChange={e => {
                            setKeywordState(e.target.value)
                        }}/>
                </div>
                <div className={'result'}>
                    { !result.length && <Empty />}
                    {result.map((item, index) => {
                        return <CardEvent key={index} event={item}></CardEvent>
                    })
                    }
                </div>
            </div>
        </div>
    </Layout>)
}

export default SearchPage
