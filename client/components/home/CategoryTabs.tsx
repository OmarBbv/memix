'use client'
import { cn } from "@/lib/utils"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Button } from "../ui/button"

const categories = [
    {
        id: 1,
        name: "Qadınlar",
    },
    {
        id: 2,
        name: "Kişilər",
    },
    {
        id: 3,
        name: "Uşaq",
    },
    {
        id: 4,
        name: "Ev və Həyat",
    },
    {
        id: 5,
        name: "Texnika",
    },
    {
        id: 6,
        name: "İdman və İstirahət",
    }
]

export const CategoryTabs = () => {
    return (
        <div className="flex flex-col gap-2 md:gap-6 mb-6 max-w-full overflow-hidden">
            <Swiper
                modules={[FreeMode]}
                freeMode={true}
                spaceBetween={16}
                slidesPerView="auto"
                className="w-full"
                breakpoints={{
                    320: {
                        slidesPerView: 2.5,
                        spaceBetween: 12,
                    },
                    640: {
                        slidesPerView: 3.5,
                        spaceBetween: 16,
                    },
                    768: {
                        slidesPerView: 4.5,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 24,
                    },
                }}
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} className="w-auto!">
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
