'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import Link from "next/link"
import Image from "next/image"

import 'swiper/css'
import 'swiper/css/pagination'

const categoryItems = [
    {
        id: 1,
        name: 'Cins',
        slug: 'jeans',
        image: '/placeholder-jeans.jpg'
    },
    {
        id: 2,
        name: 'Şalvar',
        slug: 'pants',
        image: '/placeholder-pants.jpg'
    },
    {
        id: 3,
        name: 'Köynəklər',
        slug: 'shirts',
        image: '/placeholder-shirts.jpg'
    },
    {
        id: 4,
        name: 'T-shirtlər',
        slug: 'tshirts',
        image: '/placeholder-tshirts.jpg'
    },
    {
        id: 5,
        name: 'Svetr və hoodielər',
        slug: 'sweaters',
        image: '/placeholder-sweaters.jpg'
    },
    {
        id: 6,
        name: 'Ceketlər',
        slug: 'jackets',
        image: '/placeholder-jackets.jpg'
    },
    {
        id: 7,
        name: 'Ayaqqabılar',
        slug: 'shoes',
        image: '/placeholder-shoes.jpg'
    }
]

interface CategorySelectorProps {
    currentCategory?: string
}

export const CategorySelector = ({ currentCategory }: CategorySelectorProps) => {
    return (
        <div className="w-full mb-8">
            {/* Mobile Swiper */}
            <div className="md:hidden">
                <Swiper
                    spaceBetween={16}
                    slidesPerView="auto"
                    className="w-full pb-12"
                >
                    {categoryItems.map((item) => (
                        <SwiperSlide key={item.id} style={{ width: 'auto' }}>
                            <Link href={`/category/${item.slug}`}>
                                <div className={`flex flex-col items-center gap-3 p-2 transition-all ${currentCategory === item.slug ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                    }`}>
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200">
                                        {/* Placeholder div - gerçek Image component'i ile değiştirilecek */}
                                        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                            <span className="text-xs text-gray-500">IMG</span>
                                        </div>
                                        {/*
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                        */}
                                    </div>
                                    <div className="h-8 flex items-center justify-center">
                                        <p className="text-xs text-center text-gray-700 font-medium max-w-[80px] leading-tight">
                                            {item.name}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:flex justify-center">
                <div className="flex items-end gap-8 lg:gap-12">
                    {categoryItems.map((item) => (
                        <Link key={item.id} href={`/category/${item.slug}`}>
                            <div className={`flex flex-col items-center gap-3 p-2 transition-all ${currentCategory === item.slug ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                                }`}>
                                <div className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200 hover:ring-gray-300 transition-all">
                                    {/* Placeholder div - gerçek Image component'i ile değiştirilecek */}
                                    <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <span className="text-sm text-gray-500">IMG</span>
                                    </div>
                                    {/*
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 1024px) 96px, 112px"
                                        className="object-cover"
                                    />
                                    */}
                                </div>
                                <div className="h-10 flex items-center justify-center">
                                    <p className="text-sm text-center text-gray-700 font-medium max-w-[100px] leading-tight">
                                        {item.name}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
