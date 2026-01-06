'use client'

import img1 from '@/public/home/category-preview/img1.webp'
import img10 from '@/public/home/category-preview/img10.webp'
import img11 from '@/public/home/category-preview/img11.webp'
import img12 from '@/public/home/category-preview/img12.webp'
import img2 from '@/public/home/category-preview/img2.webp'
import img3 from '@/public/home/category-preview/img3.webp'
import img4 from '@/public/home/category-preview/img4.webp'
import img5 from '@/public/home/category-preview/img5.webp'
import img6 from '@/public/home/category-preview/img6.webp'
import img7 from '@/public/home/category-preview/img7.webp'
import img8 from '@/public/home/category-preview/img8.webp'
import img9 from '@/public/home/category-preview/img9.webp'
import Image from "next/image"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { CategoryTabs } from "./CategoryTabs"

const categoryItems = [
    {
        id: 1,
        name: "Gödəkcələr",
        image: img1,
    },
    {
        id: 2,
        name: "Paltolar",
        image: img2,
    },
    {
        id: 3,
        name: "Tommy Hilfiger",
        image: img3,
    },
    {
        id: 4,
        name: "Sviterlər",
        image: img4,
    },
    {
        id: 5,
        name: "Geyimlər",
        image: img5,
    },
    {
        id: 6,
        name: "Ayaqqabılar",
        image: img6,
    },
    {
        id: 7,
        name: "Çantalar",
        image: img7,
    },
    {
        id: 8,
        name: "Aksesuarlar",
        image: img8,
    },
    {
        id: 9,
        name: "İdman",
        image: img9,
    },
    {
        id: 10,
        name: "Kosmetika",
        image: img10,
    },
    {
        id: 11,
        name: "Zərgərlik",
        image: img11,
    },
    {
        id: 12,
        name: "Saatlar",
        image: img12,
    },
]

export const CategoryPreview = () => {
    return (
        <div>
            <CategoryTabs />
            <div className="flex flex-col gap-2 md:gap-6 mb-6 max-w-full overflow-hidden">
                <Swiper
                    modules={[FreeMode]}
                    freeMode={true}
                    spaceBetween={20}
                    slidesPerView={'auto'}
                    loop={false}
                    loopAdditionalSlides={0}
                    centeredSlides={false}
                    centerInsufficientSlides={false}
                    className="w-full overflow-visible!"
                    wrapperClass="!ease-out"
                    watchSlidesProgress={true}
                >
                    {categoryItems.map((item) => (
                        <SwiperSlide key={item.id} style={{ width: 'auto' }}>
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 80px, 96px"
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xs md:text-sm text-center whitespace-nowrap">
                                    {item.name}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                    <SwiperSlide style={{ width: 'auto' }} className="select-none cursor-pointer">
                        <div className="flex flex-col items-center gap-2 select-none">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                                <p className="text-xs md:text-sm text-center px-2 text-gray-700 font-medium select-none">
                                    Daha çox göstər
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}
