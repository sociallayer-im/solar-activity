import {useNavigate, useParams, useSearchParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useRef, useState} from 'react'
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
import useTime from '../../../hooks/formatTime'



// @ts-ignore
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: import.meta.env.VITE_GMAP_API_KEY,
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
})

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
    const GoogleMapRef = useRef<google.maps.Map | null>()
    const mapDomRef = useRef<any>()
    const formatTime = useTime()
    const markersRef = useRef<any[]>([])

    const [selectTag, setSelectTag] = useState<string[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [searchKeyword, setSearchKeyWork] = useState<string>('')
    const [mode, setMode] = useState<'list' | 'map'>(searchParams.get('mode') === 'map' ? 'map' : 'list')
    const [mapReady, setMapReady] = useState(false)
    const [selectedEventInMap, setSelectedEventInMap] = useState<null | Event>(null)
    const [compact, setCompact] = useState(true)


    const MarkerElement = useRef<any | null>(null)
    const MapEvent = useRef<any | null>(null)
    useEffect(() => {
        const loadMapLib = async () => {
            try {
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary
                const {event} = await google.maps.importLibrary("core") as google.maps.CoreLibrary
                MarkerElement.current = AdvancedMarkerElement
                MapEvent.current = event

                async function initMap(): Promise<void> {
                    const googleMap = (window as any).google.maps
                    if (MarkerElement.current && MapEvent.current && googleMap) {
                        const { Map } = await googleMap.importLibrary("maps")
                        GoogleMapRef.current = new Map(document.getElementById("gmap") as HTMLElement, {
                            center: { lat: -34.397, lng: 150.644 },
                            zoom: 12,
                            language: 'en',
                            defaultUIZoom: 0.2,
                            mapId: 'e2f9ddc0facd5a80'
                        })

                        GoogleMapRef.current!.addListener('mapcapabilities_changed', () => {
                            const mapCapabilities = GoogleMapRef.current!.getMapCapabilities()
                            if (mapCapabilities.isAdvancedMarkersAvailable) {
                                setMapReady(true)
                            }
                        })
                    }
                }

                initMap()
            } catch (e: any) {
                console.error(e)
                showToast(e.message)
            }
        }

        loadMapLib()
    },[])

    const getEvent = async (page: number) => {
        // 获取当日0点时间戳
        const unload = showLoading()

        const todayZero  = new Date(new Date().toLocaleDateString()).getTime() / 1000
        if (!eventGroup?.id) {
            return []
        }

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
        } finally {
            unload()
        }
    }

    const {list, ref, refresh, loading} = scrollToLoad({
        queryFunction: getEvent
    })

    useEffect(() => {
        if (searchParams.get('tab')) {
            setTab2Index(searchParams.get('tab') as any)
        }
    }, [searchParams])

    useEffect(() => {
        if (eventGroup) {
            refresh()
        }
    }, [selectTag, tab2Index, eventGroup])

    useEffect(() => {
        setSearchParams({'mode': mode})
    }, [mode])

    useEffect(() => {
      if (list.length && mapReady) {
          const eventsWithLocation = list.filter(item => {
                return !!item.location_details
          })

          if (eventsWithLocation[0]) {
                showEventInMapCenter(eventsWithLocation[0], true)
          } else {
              setSelectedEventInMap(null)
                if (markersRef) {
                    markersRef.current.forEach(item => {
                        item.setMap(null)
                    })
                }
              return
          }

          showMarker(eventsWithLocation)
      } else {
          setSelectedEventInMap(null)
          if (markersRef) {
                markersRef.current.forEach(item => {
                    item.setMap(null)
                })
          }
      }
    }, [list, mapReady])

    const findParent = (element: HTMLElement, className: string) :null | HTMLElement => {
        if (element.classList.contains(className)) {
            return element
        } else {
            if (element.parentElement) {
                return findParent(element.parentElement, className)
            } else {
                return null
            }
        }
    }

    const removeActive = () => {
        const activeMarker = document.querySelector('.event-map-marker.active')
        if (activeMarker) {
            activeMarker.classList.remove('active')
        }
    }


    const showEventInMapCenter = (event: Event, zoom?: boolean) => {
        const eventLocation = event.location_details
        setSelectedEventInMap(event)
        if (!eventLocation) return

        const metadata = JSON.parse(eventLocation)
        if (GoogleMapRef.current) {
            const location = metadata.geometry.location
            GoogleMapRef.current!.setCenter(location)
            if (zoom) {
                GoogleMapRef.current!.setZoom(12)
            }

           setTimeout(() => {
               removeActive()
               document.getElementById(`marker-event-${event.id}`)?.classList.add('active')
           }, 100)
        }
    }

    const showMarker = (events: Event[]) => {
        const eventHasLocation = events

        // 清除marker
        if (markersRef.current.length) {
            markersRef.current.forEach(marker => {
                marker.setMap(null)
            })
        }

        // 将相同location的event合并
        let eventGrouped:Event[][] = []
        eventHasLocation.forEach(event => {
            const location = JSON.parse(event.location_details).geometry.location
            const index = eventGrouped.findIndex(item => {
                return JSON.stringify(JSON.parse(item[0].location_details).geometry.location) === JSON.stringify(location)
            })
            if (index > -1) {
                eventGrouped[index].push(event)
            } else {
                eventGrouped.push([event])
            }
        })

        eventGrouped.map((events, index) => {
            if (events.length === 1) {
                const time = formatTime(events[0].start_time!).split('.')[1] + '.' + formatTime(events[0].start_time!).split('.')[2]
                const eventMarker = document.createElement('div');
                eventMarker.className = index === 0 ? 'event-map-marker active': 'event-map-marker'
                eventMarker.id = `marker-event-${events[0].id}`
                eventMarker.innerHTML = `<div class="title"><span>${events[0].title}</span>${time}</div>`

                const markerView = new MarkerElement.current({
                    map: GoogleMapRef.current,
                    position: JSON.parse(events[0].location_details).geometry.location,
                    content: eventMarker,
                })

                MapEvent.current.addListener(markerView, 'click', function (a: any) {
                    removeActive()
                    setSelectedEventInMap(events[0])
                    showEventInMapCenter(events[0])
                })

                markersRef.current.push(markerView)
            }
            else {
                const eventGroupMarker = document.createElement('div');
                eventGroupMarker.className = 'event-map-marker-group';
                events.map((event,index_) => {
                    const time = formatTime(event.start_time!).split('.')[1] + '.' + formatTime(event.start_time!).split('.')[2]
                    const eventMarker = document.createElement('div');
                    eventMarker.setAttribute('data-event-id', event.id + '')
                    eventMarker.className = 'event-map-marker';
                    eventMarker.className = (index=== 0 && index_===0) ? 'event-map-marker active': 'event-map-marker'
                    eventMarker.id = `marker-event-${event.id}`;
                    eventMarker.innerHTML = `<div class="title" data-event-id="${event.id}"><span data-event-id="${event.id}">${event.title}</span>${time.split(' ')[0]}</div>`
                    eventGroupMarker.appendChild(eventMarker)
                })

                const markerView = new MarkerElement.current({
                    map: GoogleMapRef.current,
                    position: JSON.parse(events[0].location_details).geometry.location,
                    content: eventGroupMarker,
                })

                MapEvent.current.addListener(markerView, 'click', function (a: any) {
                    const eventId = Number(a.domEvent.target.getAttribute('data-event-id'))
                    const targetEvent = events.find(item => item.id === eventId)
                    setSelectedEventInMap(targetEvent!)
                    showEventInMapCenter(targetEvent!)
                })

                markersRef.current.push(markerView)
            }
        })
    }

    return (
        <div className={'module-tabs'}>
            <div className={mode === 'map' ? 'tab-titles fixed' : 'tab-titles'}>
                <div className={'center'}>
                    <div onClick={() => {setTab2Index('soon'); setSearchParams({tab: 'soon'})}}
                         className={tab2Index === 'soon' ? 'module-title' : 'tab-title'}>
                        {lang['Activity_Coming']}
                    </div>
                    { mode !== 'map' &&
                        <div onClick={() => {setTab2Index('past'); setSearchParams({tab: 'past'})}}
                             className={tab2Index === 'past' ? 'module-title' : 'tab-title'}>
                            {lang['Activity_Past']}
                        </div>
                    }

                    <div className={'mode-switch'}>
                        <div className={'switcher'}>
                            <div onClick={() => {setTab2Index('soon');setMode('map')}}
                                 className={mode === 'map' ? 'switcher-item active': 'switcher-item'}>
                                <i className={'icon-location'} />
                            </div>
                            <div onClick={() => {setMode('list')}}
                                 className={mode === 'list' ? 'switcher-item active': 'switcher-item'}>
                                <i className={'icon-menu'} />
                            </div>
                        </div>
                    </div>
                </div>
                { !!eventGroup && eventGroup.group_event_tags && mode === 'map' && !compact &&
                <div className={'center'}>
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
                 </div>
                }
                {
                    mode === 'map' && eventGroup?.group_event_tags &&
                    <div className={compact ? 'toggle-compact' : 'toggle-compact active'}
                        onClick={e => {setCompact(!compact)}} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="7" viewBox="0 0 11 7" fill="none">
                            <path d="M10.2458 0.290792C10.0584 0.104542 9.80498 0 9.5408 0C9.27661 0 9.02316 0.104542 8.8358 0.290792L5.2458 3.83079L1.7058 0.290792C1.51844 0.104542 1.26498 0 1.0008 0C0.736612 0 0.483161 0.104542 0.295798 0.290792C0.20207 0.383755 0.127675 0.494356 0.0769067 0.616216C0.026138 0.738075 0 0.868781 0 1.00079C0 1.1328 0.026138 1.26351 0.0769067 1.38537C0.127675 1.50723 0.20207 1.61783 0.295798 1.71079L4.5358 5.95079C4.62876 6.04452 4.73936 6.11891 4.86122 6.16968C4.98308 6.22045 5.11379 6.24659 5.2458 6.24659C5.37781 6.24659 5.50852 6.22045 5.63037 6.16968C5.75223 6.11891 5.86283 6.04452 5.9558 5.95079L10.2458 1.71079C10.3395 1.61783 10.4139 1.50723 10.4647 1.38537C10.5155 1.26351 10.5416 1.1328 10.5416 1.00079C10.5416 0.868781 10.5155 0.738075 10.4647 0.616216C10.4139 0.494356 10.3395 0.383755 10.2458 0.290792Z" fill="black"/>
                        </svg>
                    </div>
                }
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
            { !!eventGroup && eventGroup.group_event_tags && mode == 'list' &&
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
                <div id={'gmap'} className={mode==='map' ? 'show': ''} ref={mapDomRef} />
                { mode==='map' &&
                    <div className={'show-selected-event-in-map'}>
                        {
                            selectedEventInMap ?
                                <CardEvent fixed={false}  event={selectedEventInMap}/>
                                : <div className={'no-event-on-map'}>No event to show on map</div>
                        }
                    </div>
                }
                {!list.length ? <Empty/> :
                    <div className={'list'}>
                        {
                            list.map((item, index) => {
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
