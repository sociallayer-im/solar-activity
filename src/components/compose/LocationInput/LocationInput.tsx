import {useContext, useEffect, useRef, useState} from 'react'
import {EventSites, getEventSide, Profile} from "../../../service/solas";
import './LocationInput.less'
import {Select} from "baseui/select";
import AppInput from "../../base/AppInput";
import {Delete} from "baseui/icon";
import DialogsContext from "../../provider/DialogProvider/DialogsContext";
import langContext from "../../provider/LangProvider/LangContext";

export interface LocationInputValue {
    customLocation: string,
    eventSite: EventSites | null
    metaData: string | null
}

export interface GMapSearchResult {
    description: string,
    place_id: string,
    structured_formatting: {
        main_text: string,
        secondary_text: string
    }
}

export interface LocationInputProps {
    initValue?: LocationInputValue,
    eventGroup: Profile,
    onChange?: (value: LocationInputValue) => any
}

function LocationInput(props: LocationInputProps) {
    const {showToast, showLoading} = useContext(DialogsContext)
    const {langType, lang} = useContext(langContext)


    const [eventSiteList, setEventSiteList] = useState<EventSites[]>([])
    const [isCustom, setIsCustom] = useState(!!props?.initValue?.customLocation || false)
    const [eventSite, setEventSite] = useState<{ id: number, title: string, isCreatable?: boolean }[]>(props?.initValue?.eventSite ? [{id: props?.initValue.eventSite.id, title: props.initValue.eventSite.title}] : [])
    const [customLocation, setCustomLocation] = useState(props?.initValue?.customLocation || '')

    const [searchKeyword, setSearchKeyword] = useState('')
    const [customLocationDetail, setCustomLocationDetail] = useState<any>(props?.initValue?.metaData ? JSON.parse(props.initValue.metaData) : null)
    const [GmapSearchResult, setGmapSearchResult] = useState<GMapSearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [showSearchRes, setShowSearchRes] = useState(false)


    const mapService = useRef<any>(null)
    const delay = useRef<any>(null)
    const sessionToken = useRef('')

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
                if (searchKeyword && mapService.current && !searching) {
                    setSearching(true)
                    const token = new (window as any).google.maps.places.AutocompleteSessionToken();
                    mapService.current.getQueryPredictions({
                        input: searchKeyword,
                        token: token,
                        language: langType === 'cn' ? 'zh-CN' : 'en'
                    }, (predictions: any, status: any) => {
                        setSearching(false)
                        console.log('predictions', predictions)
                        console.log('status', status)
                        if (status !== 'OK') {
                            showToast('error', 'Google map search failed.')
                            return
                        }
                        sessionToken.current = token
                        setGmapSearchResult(predictions.filter((r: any) => !!r.place_id))
                    });
                }
            }, 200)
        }
        search()
    }, [searchKeyword, showSearchRes])

    useEffect(() => {
        const res = {
            customLocation,
            eventSite: eventSiteList.find((site) => site.id === eventSite[0]?.id) || null,
            metaData: customLocationDetail ? JSON.stringify(customLocationDetail) : null
        }
        console.log('location value', res)
        if (props.onChange) {
            props.onChange(res)
        }
    }, [
        eventSite,
        customLocation,
        customLocationDetail
    ])

    useEffect(() => {
        if (showSearchRes) {
            document.body.style.overflow = 'hidden';
            (document.querySelector('.search-res input') as HTMLInputElement).focus()
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [showSearchRes])

    const reset = () => {
        setEventSite([])
        setIsCustom(false)
        setCustomLocation('')
        resetSelect()
    }

    const resetSelect = () => {
        setSearchKeyword('')
        setGmapSearchResult([])
        setShowSearchRes(false)
        setCustomLocationDetail(null)
    }

    const handleSelectSearchRes = async (result: GMapSearchResult) => {
        const unload = showLoading()
        try {
            const lang = langType === 'cn' ? 'zh-CN' : 'en'
            const placesList = document.getElementById("map") as HTMLElement
            const map = new (window as any).google.maps.Map(placesList)
            const service = new (window as any).google.maps.places.PlacesService(map)
            service.getDetails({
                sessionToken: sessionToken.current,
                fields: ['geometry', 'formatted_address', 'name'],
                placeId: result.place_id
            }, (place: any, status: string) => {
                console.log('placeplace detail', place)
                setShowSearchRes(false)
                setCustomLocationDetail(place)
                setSearchKeyword('')
                unload()
            })
        } catch (e) {
            console.error(e)
            unload()
        }
    }

    return (<div className={'input-area event-location-input'}>
        <input type="text" id={'map'}/>
        <div className={'input-area-title'}>{lang['Activity_Form_Where']}</div>
        <div className={'input-area-sub-title'}>{lang['Activity_Detail_Offline_location']}</div>
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
                        if (params.value.length && params.value[0].isCreatable) {
                            setIsCustom(true)
                            setEventSite([])
                            setCustomLocation(params.value[0].title)
                            setSearchKeyword(params.value[0].title)
                            setTimeout(() => {
                                setShowSearchRes(true)
                            }, 100)
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
                <div className={'input-area-sub-title'}>{lang['Activity_Detail_Offline_location_Custom']}</div>
                <div className={'custom-selector'}>
                    {
                        showSearchRes && <div className={'shell'} onClick={e => {
                            setShowSearchRes(false)
                        }}/>
                    }
                    <AppInput
                        readOnly
                        onFocus={(e) => {
                            setSearchKeyword(e.target.value);
                            setShowSearchRes(true)
                        }}
                        startEnhancer={() => <i className={'icon-Outline'}/>}
                        endEnhancer={() => <Delete size={24} onClick={resetSelect} className={'delete'}/>}
                        placeholder={'Select location'}
                        value={customLocationDetail ? customLocationDetail.name : ''}
                    />
                    {showSearchRes &&
                        <div className={'search-res'}>
                            <AppInput
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.currentTarget.value)}
                                placeholder={'Search location'}
                            />
                            {!!GmapSearchResult.length &&
                                <div className={'res-list'}>
                                    {
                                        GmapSearchResult.map((result, index) => {
                                            const subtext = result.description
                                            const title = result.structured_formatting.main_text
                                            return <div className={'search-res-item'}
                                                        key={index}
                                                        onClick={e => {
                                                            handleSelectSearchRes(result)
                                                        }}>
                                                <div className={'search-title'}>{title}</div>
                                                <div className={'search-sub-title'}>{subtext}</div>
                                            </div>
                                        })
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </>
        }
    </div>)
}

export default LocationInput
