import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useEffect, useRef, useState} from 'react'
import './DivineBeast.less'
import useBeastConfig from "./beastConfig";
import BeastBtn from "./BeastBtn";
import AppSwiper from "../../../components/base/AppSwiper/AppSwiper";
import {BeastInfo, BeastItemInfo} from "./beastConfig";

function DivineBeast(props: {info: BeastInfo, status: 'hide' | 'build' | 'complete', items?: string[]}) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const svgRef = useRef<any>(null)
    const [items, setItems] = useState<string[]>(props.items || [])
    const [selectedItem, setSelectedItem] = useState<BeastItemInfo[]>([])
    const [status, setStatus] = useState<'hide' | 'build' | 'complete'>(props.status)
    const {beastInfo} = useBeastConfig()

    useEffect(() => {

    }, [])

    const setSelected = (targetItem: BeastItemInfo) => {
        if (selectedItem.find(item => item.name === targetItem!.name)) {
            setSelectedItem(selectedItem
                .filter(i => i.position !== targetItem!.position)
                .filter(i => i.name !== targetItem!.name))
        } else {
            const newSelectedItem = selectedItem.filter(i => i.position !== targetItem!.position)
            setSelectedItem([...newSelectedItem, targetItem!])
        }
    }

    const draw = () => {
        const bgImg = document.createElement('img')
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = '/images/merge/beast_1_show.webp'

        const canvas = document.createElement('canvas')
        canvas.width = 286
        canvas.height = 272

        const ctx = canvas.getContext('2d')
        bgImg.onload = () => {
            ctx?.drawImage(bgImg, 0, 0, 286, 272)
            const ItemImg = document.createElement('img')
            ItemImg.crossOrigin = 'anonymous';
            ItemImg.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgRef.current.outerHTML)))
            ItemImg.onload = () => {
                ctx?.drawImage(ItemImg, 0, 0, 286, 272)
                const a = document.createElement('a');
                a.download = `beast_${new Date().getTime()}.jpg`;
                a.href = canvas.toDataURL('image/jpeg', 1);
                a.click();
            }
        }
    }

    const Post = props.info.post

    return (<div className={'divine-beast'}>
        <div className={status === 'complete' ? 'border border-complete' : 'border'}>
            <div className={'window'}>
                {
                    status === 'complete' &&
                    <img className={'complete-title'} src="/images/merge/complete.png" alt=""/>
                }
                <div className={'post'}>
                    <Post ref={svgRef} status={status} items={selectedItem.map(i => i.name)}/>
                </div>
                <div className={'options'}>
                    {status === 'hide' &&
                        <div className={'des'}>
                            <div className={'left'}>
                                <div className={'title'}>神兽类型</div>
                                <div className={'value'}>{props.info.category}</div>
                            </div>
                            <div className={'right'}>
                                <div className={'title'}>特征</div>
                                <div className={'value'}>{props.info.description}</div>
                            </div>
                        </div>
                    }
                    {status === 'build' &&
                        <div className={'beast-item-list swiper-no-swiping'}>
                            { items.map(item => {
                                const targetItem = props.info.items.find(i => i.name === item)
                                return <div key={targetItem!.name} className={!!selectedItem.find(i => i.name === targetItem!.name) ? 'beast-item active' : 'beast-item'}
                                             onClick={() => setSelected(targetItem!)}>
                                    <div className={'icon'}>
                                        <img src={targetItem!.icon} alt=""/>
                                    </div>
                                    <div className={'item-name'}>{targetItem!.name}</div>
                                </div>
                            })}
                        </div>
                    }
                    {
                        status === 'complete' &&
                        <div className={'complete'}>
                            <div className={'beast-name'}>{props.info.complete}</div>
                            <BeastBtn>查看徽章详情</BeastBtn>
                        </div>
                    }
                </div>
                {
                    status !== 'complete' &&
                    <div className={'btns'}>
                        <BeastBtn background={'#DFC84E'} onClick={e => {draw()}}>合成神兽</BeastBtn>
                    </div>
                }
            </div>
        </div>
    </div>)
}

export default DivineBeast
