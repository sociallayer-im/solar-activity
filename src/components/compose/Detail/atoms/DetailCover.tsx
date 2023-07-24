import { styled, useStyletron } from 'baseui'

const DetailCover = styled('img', ()=> {
    return {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        border: '2px solid #FFFFFF',
        filter: 'drop-shadow(0px 11.4365px 16.7736px rgba(0, 0, 0, 0.08))',
        margin: '0 auto'
}
})

export default DetailCover
