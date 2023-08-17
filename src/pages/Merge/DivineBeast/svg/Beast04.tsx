import './Beast.less'
import {forwardRef} from "react";

export interface BeastProps {
    status: 'hide' | 'build' | 'complete'
    items: string[]
}
function Beast01(props: BeastProps, ref: any) {

    return (<div className={'beast-svg-wrapper'}>
        { props.status === 'hide' &&  <img src={'/images/merge/beast_4_hide.webp'} alt=""/> }
        { props.status !== 'hide' &&  <img src={'/images/merge/beast_4_show.webp'} alt=""/> }
        { props.status !== 'hide' &&
            <svg ref={ref} width="286" height="272" viewBox="0 0 286 272" fill="none" xmlns="http://www.w3.org/2000/svg">
            </svg>
        }
    </div>)
}

export default forwardRef(Beast01)
