import {useContext, useEffect, useRef, useState} from 'react'
import './DivineBeast.less'
import useBeastConfig, {BeastItemInfo} from "./beastConfig";
import BeastBtn from "./BeastBtn";
import {Badgelet, divineBeastMerge, divineBeastRemerge, uploadImage } from "../../../service/solas";
import UserContext from "../../../components/provider/UserProvider/UserContext";
import DialogsContext from "../../../components/provider/DialogProvider/DialogsContext";

export interface BeastMetadata {
    category: number
    name: string
    description: string
    image: string,
    properties: {
        items: string,
        status: 'hide' | 'build' | 'complete',
    }
}

function DivineBeast(props: { badgelet?: Badgelet, hide?: number, poap?: number, host?: number }) {
    const svgRef = useRef<any>(null)
    const [selectedItem, setSelectedItem] = useState<BeastItemInfo[]>([])
    const {beastInfo} = useBeastConfig()
    const {user} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const {showLoading, showToast} = useContext(DialogsContext)
    const [poap, setPoap] = useState(props.poap || 0)
    const [host, setHost] = useState(props.host || 0)

    const metadata = props.badgelet ? JSON.parse(props.badgelet.metadata!) as BeastMetadata : null
    const status: 'hide' | 'build' | 'complete' = props.hide ? 'hide' : (metadata ? metadata.properties.status : 'hide')
    const info = props.hide ? beastInfo.find(i => i.id === props.hide)
        : beastInfo.find(i => i.id === metadata!.category)


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

   useEffect(() => {
       if (props.host) {
           setHost(props.host)
       }
       if(props.poap) {
           setPoap(props.poap)
       }
   },[props.host, props.poap])

    const reMerge = () => {
        if (!info) return

        if (poap < selectedItem.length) {
            showToast('POAP或HOST徽章不够哦~')
            return
        }

        const bgImg = document.createElement('img')
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = `/images/merge/beast_${info.id}_show.webp`

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
                // const a = document.createElement('a');
                // a.download = `beast_${new Date().getTime()}.jpg`;
                // a.href = canvas.toDataURL('image/jpeg', 1);
                // a.click();

                canvas.toBlob((blob) => {
                    uploadImage({
                        file: blob!,
                        auth_token: user.authToken || '',
                        uploader: user.userName || '',
                    }).then(res => {
                        console.log(res)
                        divineBeastRemerge({
                            auth_token: user.authToken || '',
                            badgelet_id: props.badgelet!.id,
                            image_url: res,
                            metadata: JSON.stringify({
                                description: info.description,
                                name: info.category,
                                image: res,
                                properties: {
                                    items: selectedItem.map(i => i.name).join(','),
                                    status: 'complete'
                                }
                            })
                        })
                    })
                }, 'image/jpeg', 1)
            }
        }
    }


    const merge = () => {
        if (!props.hide) return

        if (poap < info!.cost[0] || host < info!.cost[1]) {
            showToast('POAP或HOST徽章不够哦~')
            return
        }

        const unloading = showLoading()
        setLoading(true)

        const bgImg = document.createElement('img')
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = `/images/merge/beast_${props.hide}_show.webp`
        const canvas = document.createElement('canvas')
        canvas.width = 286
        canvas.height = 272
        const ctx = canvas.getContext('2d')
        bgImg.onload = () => {
            ctx?.drawImage(bgImg, 0, 0, 286, 272)
            canvas.toBlob(async (blob) => {
                try {
                    const pic = await uploadImage({
                        file: blob!,
                        auth_token: user.authToken || '',
                        uploader: user.userName || '',
                    })
                    const res = await divineBeastMerge({
                        auth_token: user.authToken || '',
                        content: info!.description,
                        image_url: pic,
                        metadata: JSON.stringify({
                            description: info!.description,
                            name: info!.category,
                            image: pic,
                            properties: {
                                items: [],
                                status: 'build'
                            }
                        })
                    })
                } catch (e) {
                    unloading()
                    setLoading(false)
                    showToast('生成失败')
                    console.error(e)
                }
            }, 'image/jpeg', 1)
        }
    }

    const Post = info!.post

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
                                <div className={'value'}>{info!.category}</div>
                            </div>
                            <div className={'right'}>
                                <div className={'title'}>特征</div>
                                <div className={'value'}>{info!.description}</div>
                            </div>
                        </div>
                    }
                    {status === 'build' &&
                        <div className={'beast-item-list swiper-no-swiping'}>
                            {info!.items.map(item => {
                                const targetItem = item
                                return <div key={targetItem!.name}
                                            className={!!selectedItem.find(i => i.name === targetItem!.name) ? 'beast-item active' : 'beast-item'}
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
                            <div className={'beast-name'}>{info!.complete}</div>
                            <BeastBtn>查看徽章详情</BeastBtn>
                        </div>
                    }
                </div>
                {status !== 'complete' && status === 'hide' &&
                    <div className={'btns'}>
                        <BeastBtn
                            loading={loading}
                            background={'#F99351'}
                            onClick={e => {
                                merge()
                            }}>消耗 Host*1 + POAP*3 生成</BeastBtn>
                    </div>
                }

                {status !== 'complete' && status === 'build' &&
                    <div className={'btns'}>
                        <BeastBtn loading={loading} background={'#F99351'} onClick={e => {
                            reMerge()
                        }}>消耗 POAP*{selectedItem.length} 合成神兽</BeastBtn>
                    </div>
                }
            </div>
        </div>
    </div>)
}

export default DivineBeast
