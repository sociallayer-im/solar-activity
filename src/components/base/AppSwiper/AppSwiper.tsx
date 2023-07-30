import { ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Virtual } from 'swiper'

interface AppSwiperProps {
    items: ReactNode[]
    space: number,
    itemWidth: number,
    endEnhancer?: ReactNode
}

function AppSwiper(props: AppSwiperProps) {
    return (<Swiper
        data-testid='AppSwiper'
        modules={[Virtual]}
        spaceBetween={ props.space }
        freeMode={ true }
        slidesPerView={'auto'} >
        { props.items.map((item, index) => {
            return <SwiperSlide style={{width: props.itemWidth + 'px'}} key={index}>{ item }</SwiperSlide>
        })}

        {
            <SwiperSlide style={{width: 10 + 'px'}}>{ props.endEnhancer }</SwiperSlide>
        }
    </Swiper>)
}

export default AppSwiper
