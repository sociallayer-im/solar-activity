import {useNavigate} from 'react-router-dom'
import {useStyletron} from 'baseui'
import {useContext, useEffect, useImperativeHandle, useState} from 'react'
import {Profile} from '../../../service/solas'
import UploadAvatar from '../UploadAvatar/UploadAvatar'
import usePicture from '../../../hooks/pictrue'
import './FormProfileEdit.less'
import AppInput from '../../base/AppInput'
import LangContext from '../../provider/LangProvider/LangContext'
import AppTextArea from '../../base/AppTextArea/AppTextArea'
import EditSocialMedia from '../EditSocialMedia/EditSocialMedia'

export interface ProfileEditFormProps {
    profile: Profile
    onRef?: any
}

export interface ProfileEditFormData{
    profile: Profile
}

function FormProfileEdit(props: ProfileEditFormProps) {
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [a, seta] = useState('')
    const {defaultAvatar} = usePicture()
    const [newProfile, setNewProfile] = useState<Profile>(props.profile)
    const {lang} = useContext(LangContext)

    useEffect(() => {
        console.log('newProfile', newProfile)
    }, [])

    useImperativeHandle(props.onRef, () => {
        // 需要将暴露的接口返回出去
        const a: ProfileEditFormData = { profile: newProfile }
        return a
    })

    const update = (key: keyof Profile, value: any) => {
        console.log(value)
        const profile: any = {...newProfile}
        profile[key] = value
        console.log('edit', profile)
        setNewProfile(profile)
    }

    return (<div className='profile-edit-from'>
        <div className='input-area'>
            <div className='input-area-title'>{lang['Profile_Edit_Avatar']}</div>
            <UploadAvatar
                imageSelect={newProfile.image_url || defaultAvatar(newProfile.id)}
                confirm={(imgRes) => {
                    update('image_url', imgRes)
                }}/>
        </div>

        <div className='input-area'>
            <div className='input-area-title'>{lang['Profile_Edit_Ncikname']}</div>
            <AppInput value={newProfile.nickname || ''} onChange={(e) => {
                update('nickname', e.target.value.trim())
            }}/>
        </div>

        <div className='input-area'>
            <div className='input-area-title'>{lang['Profile_Edit_Location']}</div>
            <AppInput value={newProfile.location || ''} onChange={(e) => {
                update('location', e.target.value.trim())
            }}/>
        </div>

        <div className='input-area'>
            <div className='input-area-title'>{lang['Profile_Edit_Bio']}</div>
            <AppTextArea
                maxLength={200}
                value={newProfile.about || ''}
                onChange={(e) => {
                    update('about', e.target.value.trim())
                }}/>
        </div>
        { !props.profile.group_owner_id &&
            <div className='input-area'>
                <div className='input-area-title'>{lang['Profile_Edit_Social_Media']}</div>
                <EditSocialMedia
                    title={'Twitter'}
                    icon={'icon-twitter'}
                    value={newProfile.twitter || ''}
                    type={'twitter'}
                    onChange={(value) => {
                        update('twitter', value)
                    }}
                />
                <EditSocialMedia
                    title={'Telegram'}
                    icon={'icon-tg'}
                    value={newProfile.telegram || ''}
                    type={'telegram'}
                    onChange={(value) => {
                        update('telegram', value)
                    }}
                />
                <EditSocialMedia
                    title={'Github'}
                    icon={'icon-github'}
                    type={'github'}
                    value={newProfile.github || ''}
                    onChange={(value) => {
                        update('github', value)
                    }}
                />
                <EditSocialMedia
                    title={'Discord'}
                    icon={'icon-discord'}
                    type={'discord'}
                    value={newProfile.discord || ''}
                    onChange={(value) => {
                        update('discord', value)
                    }}
                />
                <EditSocialMedia
                    title={'ENS'}
                    type={'ens'}
                    icon={'icon-ens'}
                    value={newProfile.ens || ''}
                    onChange={(value) => {
                        update('ens', value)
                    }}
                />
                <EditSocialMedia
                    title={'Web'}
                    type={'web'}
                    icon={'icon-web2'}
                    value={newProfile.website || ''}
                    onChange={(value) => {
                        update('website', value)
                    }}
                />
                <EditSocialMedia
                    title={'Nostr'}
                    type={'nostr'}
                    icon={'icon-web2'}
                    value={newProfile.nostr || ''}
                    onChange={(value) => {
                        update('nostr', value)
                    }}
                />
                <EditSocialMedia
                    title={'Lens'}
                    type={'lens'}
                    icon={'icon-lens'}
                    value={newProfile.lens || ''}
                    onChange={(value) => {
                        update('lens', value)
                    }}
                />
            </div>
        }
    </div>)
}

export default FormProfileEdit
