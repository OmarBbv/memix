'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import { Button } from "../ui/button"
import Link from "next/link"

import 'swiper/css'
import 'swiper/css/pagination'

const categories = [
    {
        id: "budget",
        title: "Budget",
        brands: [
            { id: 1, name: "H&M" },
            { id: 2, name: "Zara" },
            { id: 3, name: "Mango" },
            { id: 4, name: "ONLY" },
            { id: 5, name: "S.Oliver" },
            { id: 6, name: "Edited" },
        ]
    },
    {
        id: "mid-range",
        title: "Mid Range",
        brands: [
            { id: 7, name: "Pepe Jeans" },
            { id: 8, name: "Nike" },
            { id: 9, name: "Levi's" },
            { id: 10, name: "Tommy Hilfiger" },
            { id: 11, name: "Guess" },
            { id: 12, name: "Desigual" },
        ]
    },
    {
        id: "luxury",
        title: "Luxury",
        brands: [
            { id: 13, name: "Pinko" },
            { id: 14, name: "Karl Lagerfeld" },
            { id: 15, name: "Hugo Boss" },
            { id: 16, name: "Max Mara" },
            { id: 17, name: "Patrizia Pepe" },
            { id: 18, name: "Michael Kors" },
        ]
    }
]

export const BrandSelector = () => {
    const brandButtonClass =
        "w-full py-6 md:py-5 rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-base md:text-lg font-medium"

    return (
        <div className="w-full py-10 bg-[#EDE7FC] mb-8">
            <div className="max-w-7xl mx-auto px-3 flex flex-col gap-8">
                <h2 className="text-xl md:text-2xl font-semibold text-center">
                    Най-търсените брандове
                </h2>

                <div className="w-full md:hidden">
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        spaceBetween={24}
                        slidesPerView={1}
                        className="w-full pb-12"
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <div className="flex flex-col items-center">
                                    <p className="text-lg text-center mb-5">
                                        {category.title}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 w-full px-4 mx-auto">
                                        {category.brands.map((brand) => (
                                            <Button
                                                key={brand.id}
                                                variant="outline"
                                                className={brandButtonClass}
                                            >
                                                {brand.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="hidden md:grid grid-cols-3 gap-24 max-w-6xl mx-auto w-full px-6">
                    {categories.map((category) => (
                        <div key={category.id} className="flex flex-col items-center">
                            <p className="text-2xl text-center mb-8">
                                {category.title}
                            </p>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-4 w-full">
                                {category.brands.map((brand) => (
                                    <Button
                                        key={brand.id}
                                        variant="outline"
                                        className={brandButtonClass}
                                    >
                                        {brand.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Link href="#" className="mx-auto mt-2 text-sm md:text-base font-medium underline hover:no-underline transition-all flex items-center gap-2">
                    Вижте всички
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block"
                    >
                        <path
                            d="M7.5 15L12.5 10L7.5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
