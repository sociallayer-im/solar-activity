import { useNavigate } from 'react-router-dom'
import { styled, useStyletron } from 'baseui'
import { useState, useContext, useEffect } from 'react'
import LangContext from '../../provider/LangProvider/LangContext'
import chooseFile from '../../../utils/chooseFile'
import solas from '../../../service/solas'
import UserContext from '../../provider/UserProvider/UserContext'
import DialogsContext from '../../provider/DialogProvider/DialogsContext'
import DialogPublicImage from '../../base/Dialog/DialogPublicImage/DialogPublicImage'

const Wrapper = styled('div', () => {
    return {
        width: '100%',
        height: '214px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8F9F8',
        borderRadius: '16px',
        userSelect: 'none',
    }
})

const Pic = styled('img', () => {
    return {
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        display: 'block',
        cursor: 'pointer',
    }
})

const Pic2 = styled('img', () => {
    return {
        maxWidth: '90%',
        width: 'auto',
        maxHeight: '210px',
        display: 'block',
        cursor: 'pointer',
    }
})

export interface UploadImageProps {
    confirm: (url: string) => any
    imageSelect?: string,
    cropper?: boolean
}

function UploadImage ({cropper=true, ...props}: UploadImageProps) {
    const defaultImg = '/images/upload_default.png'
    const [css] = useStyletron()
    const navigate = useNavigate()
    const [imageSelect, setImageSelect] = useState(props.imageSelect)
    const { lang } = useContext(LangContext)
    const { user } = useContext(UserContext)
    const { showToast, showLoading, showCropper, openDialog } = useContext(DialogsContext)

    const showPublicImageDialog = () => {
        const dialog = openDialog({
            content: (close: any) => <DialogPublicImage cropper={cropper} handleClose={close} onConfirm={(image) => { props.confirm(image); setImageSelect(image) }} />,
            position: 'bottom',
            size: [360, 'auto']
        })
    }

    useEffect(() => {
        if (props.imageSelect) {
            setImageSelect(props.imageSelect)
        }
    }, [props.imageSelect])

    return (<Wrapper>
        { cropper ?
            <Pic onClick={ () => { showPublicImageDialog() } } src={ imageSelect || defaultImg } alt=""/>
            : imageSelect ? <Pic2 onClick={ () => { showPublicImageDialog() } } src={ imageSelect  } alt=""/>
                : <Pic onClick={ () => { showPublicImageDialog() } } src={ defaultImg } alt=""/>
        }
    </Wrapper>)
}

export default UploadImage
