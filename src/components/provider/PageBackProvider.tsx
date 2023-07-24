import {useNavigate, useLocation} from 'react-router-dom'
import {useEffect, createContext, useRef} from 'react'

export const PageBackContext = createContext({
    back: ():any => {},
    cleanCurrentHistory: ():any => {},
    history: [] as string[]
})

interface PageBacProviderProps {
    children: any
}

function PageBacProvider(props: PageBacProviderProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const history = useRef<string[]>([location.pathname])

    useEffect(() => {
        if (history.current[history.current.length - 1] !== location.pathname) {
            history.current.push(location.pathname)
        }
    }, [location])

    const back = () => {
        if (history.current.length > 1) {
            history.current.pop()
            const target = history.current[history.current.length - 1]
            console.log('navigate target', target)
            navigate(target)
        }
    }

    const cleanCurrentHistory = () => {
        history.current.pop()
    }

    return (<PageBackContext.Provider value={{back, cleanCurrentHistory, history: history.current}}>
        {props.children}
    </PageBackContext.Provider>)
}

export default PageBacProvider
