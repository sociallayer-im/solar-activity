import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useEffect, useRef, useState} from 'react'
import './DivineBeast.less'
import useBeastConfig from "./beastConfig";
import BeastBtn from "./BeastBtn";
import AppSwiper from "../../../components/base/AppSwiper/AppSwiper";

function DivineBeast() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const svgRef = useRef<any>(null)
    const [items, setItems] = useState<string[]>([])
    const [status, setStatus] = useState<'hide' | 'build' | 'complete'>('build')
    const {beastInfo} = useBeastConfig()

    useEffect(() => {

    }, [])

    const setItem = (item: string) => {
        if (items.includes(item)) {
            setItems(items.filter(i => i !== item))
        } else {
            setItems([...items, item])
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

    const Post = beastInfo[0].post

    return (<div className={'divine-beast'}>
        <div className={'border'}>
            <div className={'window'}>
                <div className={'post'}>
                    <Post ref={svgRef} status={status} items={items}/>
                </div>
                <div className={'options'}>
                    {status === 'hide' &&
                        <div className={'des'}>
                            <div className={'left'}>
                                <div className={'title'}>神兽类型</div>
                                <div className={'value'}>{beastInfo[0].category}</div>
                            </div>
                            <div className={'right'}>
                                <div className={'title'}>特征</div>
                                <div className={'value'}>{beastInfo[0].description}</div>
                            </div>
                        </div>
                    }
                    {status === 'build' &&
                        <div className={'beast-item-list swiper-no-swiping'}>
                            <div className={items.includes('帽子') ? 'beast-item active' : 'beast-item'}
                                 onClick={() => setItem('帽子')}>
                                <div className={'icon'}>
                                    <img src="/images/merge/items/beast_1_item_1.svg" alt=""/>
                                </div>
                                <div className={'item-name'}>帽子</div>
                            </div>
                            <div className={items.includes('眼镜') ? 'beast-item active' : 'beast-item'}
                                 onClick={() => setItem('眼镜')}>
                                <div className={'icon'}>
                                    <img src="/images/merge/items/beast_1_item_2.svg" alt=""/>
                                </div>
                                <div className={'item-name'}>眼镜</div>
                            </div>
                            <div className={items.includes('项链') ? 'beast-item active' : 'beast-item'}
                                 onClick={() => setItem('项链')}>
                                <div className={'icon'}>
                                    <img src="/images/merge/items/beast_1_item_3.svg" alt=""/>
                                </div>
                                <div className={'item-name'}>项链</div>
                            </div>
                            <div className={items.includes('项链') ? 'beast-item active' : 'beast-item'}
                                 onClick={() => setItem('项链')}>
                                <div className={'icon'}>
                                    <img src="/images/merge/items/beast_1_item_3.svg" alt=""/>
                                </div>
                                <div className={'item-name'}>项链</div>
                            </div>
                        </div>
                    }
                </div>
                <div className={'btns'}>
                    <BeastBtn background={'#DFC84E'} onClick={e => {draw()}}>合成神兽</BeastBtn>
                </div>
            </div>
        </div>
    </div>)
}

export default DivineBeast
