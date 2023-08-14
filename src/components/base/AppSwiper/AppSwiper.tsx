import {ReactNode} from 'react'
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react'
import {Virtual} from 'swiper'
import 'swiper/css/virtual';
import {Swiper as SwiperClass} from "swiper/types";

interface AppSwiperProps {
    items: ReactNode[]
    space: number,
    itemWidth: number,
    initIndex?: number,
    endEnhancer?: ReactNode
}

function Wrapper(props: { children: ReactNode, index: number, width: number, space: number }) {
    const swiper = useSwiper()
    return <div className='swiper-inside-wrapper'  style={{width: props.width + 'px'}} onClick={e => {
        setTimeout(() => {
            const windowWidth = window.innerWidth
            const offset = Math.floor(windowWidth / (props.width + props.space) / 2)
            const index = props.index - offset
            console.log('swiper', swiper)
            console.log('offset', offset)
            console.log('index', index)
            swiper.slideTo(index, 500, false)
        }, 0)
    }}>{props.children}</div>

}

function AppSwiper(props: AppSwiperProps) {
    return (<Swiper
        data-testid='AppSwiper'
        modules={[Virtual]}
        spaceBetween={props.space}
        freeMode={true}
        onSwiper={
            (swiper: SwiperClass) => {
                if (props.initIndex) {
                    const windowWidth = window.innerWidth
                    const offset = Math.floor(windowWidth / (props.itemWidth + props.space) / 2)
                    swiper.slideTo(props.initIndex! - (offset - 5), 0, false)
                }
            }
        }
        slidesPerView={'auto'}>
        {props.items.map((item, index) => {
            return <SwiperSlide style={{width: props.itemWidth + 'px'}} key={index} virtualIndex={index}>
                <Wrapper
                    space={props.space}
                    index={index}
                    width={props.itemWidth}>
                    {item}
                </Wrapper>
            </SwiperSlide>
        })}

        {
            <SwiperSlide style={{width: 10 + 'px'}}>{props.endEnhancer}</SwiperSlide>
        }
    </Swiper>)
}

export default AppSwiper
