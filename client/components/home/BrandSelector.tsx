'use client'
import { ArrowRight, Gem, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Button } from "../ui/button"

import 'swiper/css'
import 'swiper/css/pagination'

const categories = [
    {
        id: "budget",
        title: "Sərfəli Tapıntılar",
        icon: <TrendingUp className="w-5 h-5" />,
        color: "bg-blue-50 text-blue-600 border-blue-100",
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
        title: "Orta Seqment",
        icon: <Sparkles className="w-5 h-5" />,
        color: "bg-purple-50 text-purple-600 border-purple-100",
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
        title: "Lüks Brendlər",
        icon: <Gem className="w-5 h-5" />,
        color: "bg-amber-50 text-amber-600 border-amber-100",
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
    return (
        <section className="w-full py-16 bg-slate-50/50 mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Brendləri Kəşf Et
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Büdcəyə uyğun seçimlərdən lüks brendlərə qədər axtardığın hər şey burada.
                    </p>
                </div>

                {/* Mobile View with Swiper */}
                <div className="block lg:hidden">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        spaceBetween={20}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        loop={true}
                        className="w-full pb-14 px-4"
                        breakpoints={{
                            640: {
                                slidesPerView: 1.5,
                                spaceBetween: 24,
                            },
                            768: {
                                slidesPerView: 2.2,
                                spaceBetween: 30,
                            }
                        }}
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.id} className="h-full">
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full flex flex-col">
                                    <div className={`flex items-center gap-3 mb-6 p-3 rounded-xl w-fit ${category.color}`}>
                                        {category.icon}
                                        <h3 className="font-bold text-lg">{category.title}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {category.brands.map((brand) => (
                                            <Button
                                                key={brand.id}
                                                variant="ghost"
                                                className="w-full justify-start h-auto py-3 px-4 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all text-sm font-medium"
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

                {/* Desktop View Grid */}
                <div className="hidden lg:grid grid-cols-3 gap-8 xl:gap-12">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
                            <div className={`flex items-center gap-3 mb-8 p-3 rounded-2xl w-fit ${category.color}`}>
                                {category.icon}
                                <h3 className="font-bold text-xl">{category.title}</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {category.brands.map((brand) => (
                                    <Button
                                        key={brand.id}
                                        variant="outline"
                                        className="w-full h-auto py-4 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 rounded-xl text-base font-medium transition-all duration-200 hover:shadow-sm"
                                    >
                                        {brand.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                    <Link
                        href="#"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Bütün Brendləri Gör
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
