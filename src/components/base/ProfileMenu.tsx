import {useContext} from 'react'
import UserContext from '../provider/UserProvider/UserContext'
import {useNavigate} from 'react-router-dom'
import MenuItem from './MenuItem'
import {PLACEMENT, StatefulPopover} from 'baseui/popover'
import {useStyletron} from 'baseui'
import LangContext from '../provider/LangProvider/LangContext'
import usePicture from '../../hooks/pictrue'

function ProfileMenu() {
    const {user, logOut} = useContext(UserContext)
    const {lang} = useContext(LangContext)
    const [css] = useStyletron()
    const navigate = useNavigate()
    const {defaultAvatar} = usePicture()

    const handleLogOut = () => {
        logOut()
    }

    const home = import.meta.env.VITE_SOLAS_HOME
    const toProfile = () => {
        window.location.href = `${home}/profile/${user.userName}`
    }

    const menuContent = (close: any) => <>
        {!!user.domain &&
            <MenuItem onClick={() => {
                toProfile();
                close()
            }}>{lang['UserAction_MyProfile']}</MenuItem>
        }
        <MenuItem onClick={() => {
            handleLogOut();
            close()
        }}>{lang['UserAction_Disconnect']}</MenuItem>
    </>

    const style = {
        wrapper: {
            display: 'flex',
            'flex-direction': 'row',
            'flex-wrap': 'nowrap',
            alignItems: 'center',
            cursor: 'pointer',
        },
        img: {
            width: '16px',
            height: '16px',
            borderRadius: ' 50%',
            marginRight: '6px'
        },
        showName: {
            maxWidth: '40px',
            overflow: 'hidden',
            'text-overflow': 'ellipsis',
            whitespace: 'nowrap',
        },
    }

    const overridesStyle = {
        Body: {
            style: {
                'z-index': 999
            }
        }
    }

    const shortAddress = (address: null | string) => {
        if (!address) return address
        return `${address.substr(0, 6)}...${address.substr(-4)}`
    }

    return (
        <StatefulPopover
            overrides={overridesStyle}
            placement={PLACEMENT.bottomRight}
            returnFocus={false}
            content={({close}) => menuContent(close)}
            autoFocus>
            <div className={css(style.wrapper)}>
                <img className={css(style.img)} src={user.avatar || defaultAvatar(user.id)} alt=""/>
                <div className={css(style.showName)}> {user.nickname || user.userName || shortAddress(user.wallet) || user.email}</div>
            </div>
        </StatefulPopover>
    )
}

export default ProfileMenu
