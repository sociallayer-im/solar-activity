import {useNavigate, useParams} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useState, createRef} from 'react'
import Layout from '../../components/Layout/Layout'
import solas, {Profile, updateGroup, verifyTwitter} from '../../service/solas'
import DialogsContext from '../../components/provider/DialogProvider/DialogsContext'
import PageBack from '../../components/base/PageBack'
import './GroupEdit.less'
import AppButton, {BTN_KIND, BTN_SIZE} from '../../components/base/AppButton/AppButton'
import FormProfileEdit, { ProfileEditFormData } from '../../components/compose/FormProfileEdit/FormProfileEdit'
import LangContext from '../../components/provider/LangProvider/LangContext'
import { DialogConfirmProps } from '../../components/base/Dialog/DialogConfirm/DialogConfirm'
import UserContext from "../../components/provider/UserProvider/UserContext";


function GroupEdit() {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [newProfile, setNewProfile] = useState<Profile | null>(null)
    const { groupname } = useParams()
    const { showLoading, showToast, openConfirmDialog } = useContext(DialogsContext)
    const { lang } = useContext(LangContext)
    const form = createRef<ProfileEditFormData>()
    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        const getProfile = async () => {
            const unload = showLoading()
            if (!groupname) return
            try {
                const profile = await solas.getProfile({
                    username: groupname
                })

                setNewProfile(profile)
                setProfile(profile)
                unload()
            } catch (e: any) {
                console.error('[getProfile]: ', e)
            }
        }
        getProfile()
    }, [])

    const saveProfile = async () => {
        console.log(form.current?.profile)
        const avatar = form.current?.profile.image_url
        let twitter = form.current?.profile.twitter
        if (twitter) {
            twitter = twitter.replace('https://twitter.com/', '')
        }

        const unload = showLoading()
        try {
            if (avatar && avatar !== profile?.image_url) {
                const updateAvatar = await solas.updateGroup({
                    image_url: avatar,
                    id: profile?.id!,
                    auth_token: user.authToken || ''
                })
            }

            if (twitter && twitter !== profile?.twitter) {
                const updateTwitter = await solas.verifyTwitter({
                    twitter_handle: twitter || '',
                    tweet_url: '',
                    auth_token: user.authToken || ''
                })
            }


            showToast('Save Successfully')
            navigate(`/group/${profile?.username}`)
        } catch (e) {
            console.error('[saveProfile]: ', e)
        } finally {
            unload()
        }
    }

    const SaveBtn = function () {
        return <AppButton
            onClick={ saveProfile }
            style={{width: '60px'}} inline kind={BTN_KIND.primary}
            special
            size={BTN_SIZE.mini} >
            {lang['Profile_Edit_Save']}
        </AppButton>
    }

    const handleBack = () => {
        const editedAvatar = form.current?.profile.image_url !== profile?.image_url
        const editTwitter = form.current?.profile.twitter !== profile?.twitter

        if ( editedAvatar || editTwitter) {
            const props: DialogConfirmProps = {
                confirmLabel: lang['Profile_Edit_Leave'],
                cancelLabel: lang['Profile_Edit_Cancel'],
                title: lang['Profile_Edit_Leave_Dialog_Title'],
                content: lang['Profile_Edit_Leave_Dialog_Des'],
                onConfirm: (close) => {
                    navigate(`/group/${profile?.username}`)
                    close()
                }
            }
            const dialog = openConfirmDialog(props)
        } else {
            navigate(`/group/${profile?.username}`)
        }
    }

    const handleFreeze = () => {
        const props: DialogConfirmProps = {
            confirmLabel: lang['Group_freeze_Dialog_confirm'],
            confirmBtnColor: '#F64F4F!important',
            confirmTextColor: '#fff',
            cancelLabel: lang['Group_freeze_Dialog_cancel'],
            title: lang['Group_freeze_dialog_title'],
            content: lang['Group_freeze_dialog_des'],
            onConfirm: async (close) => {
                close()
                const unload = showLoading()
                try {
                    const res = await solas.freezeGroup({
                        group_id: profile?.id!,
                        auth_token: user.authToken || ''
                    })
                    unload()
                    showToast('Froze')
                    navigate(`/profile/${user?.userName}`)
                } catch (e: any) {
                    console.log('[handleFreeze]:', e)
                    showToast(e.message)
                }
            }
        }
        const dialog = openConfirmDialog(props)
    }

    return (<Layout>
        <div className='edit-profile-page'>
            {!!newProfile &&
                <div className='edit-profile-page-wrapper'>
                    <PageBack
                        onClose={ handleBack }
                        title={lang['Profile_Edit_Title']}
                        menu={ SaveBtn }/>
                    <FormProfileEdit profile={ newProfile } onRef={ form }/>
                    <AppButton style={{color: '#F64F4F'}} onClick={ handleFreeze }>{ lang['Group_setting_dissolve'] }</AppButton>
                </div>
            }
        </div>
    </Layout>)
}

export default GroupEdit
