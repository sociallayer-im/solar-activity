import './EventLabels.less'
import {getLabelColor} from "../../../hooks/labelColor";

export interface EventLabelsProps {
    data: string[]
    value: string[]
    onChange?: (value: string[]) => any,
    disabled?: boolean,
    single?: boolean,
}

function EventLabels(props: EventLabelsProps) {
    return (<div className={props.disabled ? 'event-label-list disabled': 'event-label-list'}>
        {
            props.data.map((item, index) => {
                const isSelected = props.value.includes(item)
                const color = getLabelColor(item)
                const style_1 = isSelected ? {
                        color: color,
                        borderColor: color,
                    } :
                    {
                        color: '#c4c4c4',
                        borderColor: '#EDEDED',
                    }
                const style_2 = {background: isSelected ? color : '#c4c4c4'}

                return <div
                    style={style_1}
                    onClick={() => {
                        if (props.disabled) return

                        if (isSelected) {
                            props.onChange && props.onChange(props.value.filter(i => i !== item))
                        } else {
                            props.onChange && props.onChange(props.single ? [item]: [...props.value, item])
                        }
                    }}
                    className={'event-label-item'}
                    key={index.toString()}>
                    <i style={style_2}/>
                    <span>{item}</span>
                </div>
            })
        }
    </div>)
}

export default EventLabels
