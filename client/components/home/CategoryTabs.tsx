'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { Button } from "../ui/button"
import { FreeMode } from "swiper/modules"
import { cn } from "@/lib/utils"

const categories = [
    {
        id: 1,
        name: "Жени",
    },
    {
        id: 2,
        name: "Мажи",
    },
    {
        id: 3,
        name: "Детско",
    },
    {
        id: 4,
        name: "Дом и живот",
    },
    {
        id: 5,
        name: "Техника",
    },
    {
        id: 6,
        name: "Спорт и отдих",
    }
]

export const CategoryTabs = () => {
    return (
        <div className="flex flex-col gap-2 md:gap-6 mb-6 max-w-full overflow-hidden">
            <Swiper
                modules={[FreeMode]}
                freeMode={true}
                spaceBetween={16}
                slidesPerView={'auto'}
                loop={false}
                loopAdditionalSlides={0}
                centeredSlides={false}
                centerInsufficientSlides={false}
                className="w-full overflow-visible!"
                wrapperClass="!ease-out"
                watchSlidesProgress={true}
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} style={{ width: 'auto' }}>
                        <Button
                            variant="outline"
                            className={cn(
                                'whitespace-nowrap px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors',
                                category.id === 1 && 'bg-primary text-primary-foreground',
                                'border-gray-300'
                            )}
                        >
                            {category.name}
                        </Button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}