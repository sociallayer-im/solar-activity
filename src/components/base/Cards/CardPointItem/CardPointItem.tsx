import {useStyletron} from 'baseui'
import {PointItem} from '../../../../service/solas'
import DialogsContext from '../../../provider/DialogProvider/DialogsContext'
import {useContext} from 'react'
import UserContext from '../../../provider/UserProvider/UserContext'

const style = {
    wrapper: {
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        width: '162px',
        height: '182px',
        borderRadius: '15px',
        background: '#fff',
        boxShadow: '0 1.9878px 11.9268px rgb(0 0 0 / 10%)',
        padding: '10px',
        cursor: 'pointer' as const,
        alignItems: 'center',
        marginBottom: '10px',
        boxSizing: 'border-box' as const,
        transition: 'all 0.12s linear',
        ':hover': {
            transform: 'translateY(-8px)'
        },
        ':active': {
            boxShadow: '0px 1.9878px 3px rgba(0, 0, 0, 0.1)'
        }
    },
    img: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        marginBottom: '10px'
    },
    name: {
        fontWeight: 600,
        maxWidth: '90%',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden' as const,
        textOverflow: 'ellipsis' as const,
        fontSize: '14px'
    },
    pendingMark: {
        position: 'absolute' as const,
        fontWeight: 600,
        fontSize: '12px',
        color: '#272928',
        padding: '0 10px',
        background: '#ffdc62',
        height: '28px',
        boxSizing: 'border-box' as const,
        lineHeight: '28px',
        borderTopLeftRadius: '6px',
        borderBottomRightRadius: '6px',
        top: '10px',
        left: '10px'
    },
    value: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        position: 'absolute' as const,
        background: 'rgba(0,0,0,0.3)',
        top: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#fff'
    },
    coverBg: {
        width: '100%',
        minWidth: '142px',
        height: '132px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(247, 247, 247, 0.82) 0%, #EBF2F1 100%);',
        borderRadius: '6px',
        marginBottom: '8px'
    }
}

export interface CardBadgeletProps {
    pointitem: PointItem
}

function CardPointItem(props: CardBadgeletProps) {
    const [css] = useStyletron()
    const {showPointItem} = useContext(DialogsContext)
    const {user} = useContext(UserContext)

    const isOwner = user.id === props.pointitem.owner.id

    return (<div className={css(style.wrapper)} onClick={() => {showPointItem(props.pointitem)}}>
        <div className={css(style.coverBg)}>
            <img className={css(style.img)} src={props.pointitem.point.image_url} alt=""/>
        </div>
        <div className={css(style.value)}>{props.pointitem.value}</div>
        <div className={css(style.name)}>{props.pointitem.point.title}</div>
        {isOwner && props.pointitem.status === 'sending' && <div className={css(style.pendingMark)}>Pending</div>}
    </div>)
}

export default CardPointItem
