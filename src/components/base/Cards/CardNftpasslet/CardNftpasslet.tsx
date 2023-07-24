import { useStyletron } from 'baseui'
import {Badgelet, NftPasslet} from '../../../../service/solas'
import DialogsContext from '../../../provider/DialogProvider/DialogsContext'
import { useContext } from 'react'
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
        ':hover' : {
            transform: 'translateY(-8px)'
        },
        ':active' : {
            boxShadow: '0px 1.9878px 3px rgba(0, 0, 0, 0.1)'
        }
    },
    img:  {
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
    hideMark: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        position: 'absolute' as const,
        background: 'rgba(0,0,0,0.3)',
        top: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
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
    nftpasslet: NftPasslet
}

function CardNftpasslet (props: CardBadgeletProps) {
    const [css] = useStyletron()
    const { showNftpasslet } = useContext(DialogsContext)
    const { user } = useContext(UserContext)

    const isOwner = user.id === props.nftpasslet.receiver.id

    return (<div data-testid='CardBadgelet' className={ css(style.wrapper) } onClick={ () => { showNftpasslet(props.nftpasslet) }}>
                <div className={css(style.coverBg)}>
                    <img className={ css(style.img) } src={ props.nftpasslet.badge.image_url } alt=""/>
                </div>
                { props.nftpasslet.hide && <div className={css(style.hideMark)}><i className='icon-lock'></i></div> }
                <div className={ css(style.name) }>{ props.nftpasslet.badge.name }</div>
                { isOwner && props.nftpasslet.status === 'pending' && <div className={ css(style.pendingMark) }>Pending</div> }
            </div>)
}

export default CardNftpasslet
