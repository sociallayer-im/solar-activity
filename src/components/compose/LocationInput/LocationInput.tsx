import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useRef, useState} from 'react'
import {EventSites, getEventSide, Profile} from "../../../service/solas";
import './LocationInput.less'
import {Select} from "baseui/select";
import AppInput from "../../base/AppInput";
import {Delete} from "baseui/icon";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import langContext from "../../provider/LangProvider/LangContext";
import fetch from "../../../utils/fetch"

export interface LocationInputValue {
    customLocation: string,
    eventSite: EventSites | null
    metaData: string | null
}

export interface GMapSearchResult {
    description: string,
    place_id: string,
}

export interface LocationInputProps {
    eventGroup: Profile,
    onChange?: (value: LocationInputValue) => any
}

function LocationInput(props: LocationInputProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const {showToast, showLoading} = useContext(DialogsContext)
    const {lang, langType} = useContext(langContext)

    const [eventSiteList, setEventSiteList] = useState<EventSites[]>([])
    const [isCustom, setIsCustom] = useState(false)
    const [eventSite, setEventSite] = useState<{ id: number, title: string, isCreatable: boolean }[]>([])
    const [customLocation, setCustomLocation] = useState('')
    const [selectionSearchRes, setSelectionSearchRes] = useState<GMapSearchResult | null>()

    const [customLocationSearch, setCustomLocationSearch] = useState('')
    const [GmapSearchResult, setGmapSearchResult] = useState<GMapSearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [showSearchRes, setShowSearchRes] = useState(false)

    const mapService = useRef<any>(null)
    const delay = useRef<any>(null)

    useEffect(() => {
        async function fetchLocation() {
            if (props.eventGroup) {
                const locations = await getEventSide(props.eventGroup.id)
                setEventSiteList(locations)
            }
        }

       function initGoogleMap() {
            const apiKey = import.meta.env.VITE_GMAP_API_KEY
            if (!apiKey) {
                showToast('error', 'Google Map API key is not set.')
                return
            }

            if (!document.getElementById('google-map')) {
                const script = document.createElement('script')
                const lang = langType === 'cn' ? 'zh-CN' : 'en'
                script.id = 'google-map'
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${lang}`
                script.async = true
                script.defer = true
                document.body.appendChild(script)
                script.onload = () => {
                    mapService.current = new (window as any).google.maps.places.AutocompleteService()
                }

                script.onerror = () => {
                    showToast('Google map script load failed.')
                }
            } else {
                if ((window as any).google) {
                    mapService.current = new (window as any).google.maps.places.AutocompleteService()
                } else {
                    showToast('Google map script load failed.')
                }
            }
        }

        fetchLocation()
        initGoogleMap()

        return () => {
            mapService.current = null
        }
    }, [])

    useEffect(() => {
        const search = () => {
            if (!showSearchRes) {
                return
            }

            if (delay.current) {
                clearTimeout(delay.current)
            }
            delay.current = setTimeout(() => {
                if (customLocationSearch && mapService.current && !searching) {
                    setSearching(true)
                    mapService.current.getQueryPredictions({ input: customLocationSearch }, (predictions: any, status: any) => {
                        setSearching(false)
                        console.log('predictions', predictions)
                        console.log('status', status)
                        if (status !== 'OK') {
                            showToast('error', 'Google map search failed.')
                            return
                        }
                        setGmapSearchResult(predictions)
                    });
                }
            }, 400)
        }
        search()
    }, [customLocationSearch, showSearchRes])

    useEffect(() => {
        const res = {
            customLocation,
            eventSite: eventSiteList.find((site) => site.id === eventSite[0]?.id) || null,
            metaData: selectionSearchRes ? JSON.stringify(selectionSearchRes) : null
        }
        console.log('location value', res)
        if (props.onChange) {
            props.onChange(res)
        }
    }, [
        eventSite,
        customLocation,
        selectionSearchRes
    ])

    const reset = () => {
        setEventSite([])
        setIsCustom(false)
        setCustomLocation('')
    }

    const handleSelectSearchRes = async (res: GMapSearchResult) => {
        const lang = langType === 'cn' ? 'zh-CN' : 'en'
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${res.place_id}&fields=formatted_address,name,geometry&key=${import.meta.env.VITE_GMAP_API_KEY}&language=${lang}`
        const unload = showLoading()
        const detail = await fetch.get({url, header: {
            ':authority' : 'maps.googleapis.com'
            }})
            .catch(e => {
                unload()
                showToast('error', 'Google map search failed.')
            })

        if (detail) {
            console.log('location detail', detail)
        }
        setShowSearchRes(false)
        // setCustomLocation(result.description)
        // setSelectionSearchRes(result);
        unload()
    }

    return (<div className={'input-area event-location-input'}>
        <div className={'input-area-title'}>{'Where is the event taking place?'}</div>
        <div className={'input-area-sub-title'}>In person</div>
        {!isCustom &&
            <div className={'selector'}>
                <i className={'icon-Outline'}/>
                <Select
                    labelKey={'title'}
                    valueKey={'id'}
                    clearable
                    creatable
                    options={eventSiteList}
                    value={eventSite}
                    onChange={(params) => {
                        console.log(params)
                        if (params.value.length && params.value[0].isCreatable) {
                            setIsCustom(true)
                            setEventSite([])
                            setCustomLocation(params.value[0].title)
                            return
                        }

                        setEventSite(params.value as any)
                    }}
                />
            </div>
        }
        {isCustom &&
            <>
                <AppInput
                    startEnhancer={() => <i className={'icon-edit'}/>}
                    endEnhancer={() => <Delete size={24} onClick={reset} className={'delete'}/>}
                    placeholder={'Enter location'}
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.currentTarget.value)}
                />
                <div className={'input-area-sub-title'}>Select the location</div>
                <div className={'custom-selector'}>
                    {
                        showSearchRes && <div className={'shell'} onClick={e => {setShowSearchRes(false)}} />
                    }
                    <AppInput
                        onFocus={() => setShowSearchRes(true)}
                        startEnhancer={() => <i className={'icon-Outline'}/>}
                        endEnhancer={() => <Delete size={24} onClick={reset} className={'delete'}/>}
                        placeholder={'Select location'}
                        value={customLocationSearch}
                        onChange={(e) => setCustomLocationSearch(e.currentTarget.value)}
                    />
                    { showSearchRes && GmapSearchResult.length > 0 &&
                        <div className={'search-res'}>
                            {
                                GmapSearchResult.map((result, index) => {
                                    let textSplit = result.description.split(', ')
                                    const title = textSplit.shift()
                                    const sub = textSplit.join(', ')
                                    return  <div className={'search-res-item'}
                                                 key={index}
                                                 onClick={e => {
                                                     handleSelectSearchRes(result)
                                                    }}>
                                        <div className={'search-title'}>{title}</div>
                                        <div className={'search-sub-title'}>{sub}</div>
                                    </div>
                                })
                            }
                        </div>
                    }
                </div>
            </>
        }
    </div>)
}

export default LocationInput
