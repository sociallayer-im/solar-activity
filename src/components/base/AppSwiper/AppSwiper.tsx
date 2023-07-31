import { ReactNode } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Virtual } from 'swiper'
import 'swiper/css/virtual';
import {Swiper as SwiperClass} from "swiper/types";

interface AppSwiperProps {
    items: ReactNode[]
    space: number,
    itemWidth: number,
    initIndex?:number,
    endEnhancer?: ReactNode
}

function AppSwiper(props: AppSwiperProps) {
    return (<Swiper
        data-testid='AppSwiper'
        modules={[Virtual]}
        spaceBetween={ props.space }
        freeMode={ true }
        onSwiper={
            (swiper: SwiperClass) => {
                if (props.initIndex) {
                    swiper.slideTo(props.initIndex, 0, false)
                }
            }
        }
        slidesPerView={'auto'} >
        { props.items.map((item, index) => {
            return <SwiperSlide style={{width: props.itemWidth + 'px'}} key={index} virtualIndex={index}>{ item }</SwiperSlide>
        })}

        {
            <SwiperSlide style={{width: 10 + 'px'}}>{ props.endEnhancer }</SwiperSlide>
        }
    </Swiper>)
}

export default AppSwiper
