'use client'
import img1 from "@/public/home/features/Ekran şəkli 2026-01-04 170358.png"
import img2 from "@/public/home/features/Ekran şəkli 2026-01-04 170413.png"
import img3 from "@/public/home/features/Ekran şəkli 2026-01-04 170418.png"
import img4 from "@/public/home/features/Ekran şəkli 2026-01-04 170425.png"
import { Button } from "../ui/button"

const features = [
    {
        id: 1,
        title: "Нови находки всеки ден",
        description: "Ежедневно добавяме хиляди нови secondhand модни находки на любими светски брандове от H&M до Gucci.",
        imgSrc: img1
    },
    {
        id: 2,
        title: "Цени, които носят щастие",
        description: "Цената на всяка находка може да достигне до 90% по-ниска от препоръчителната в търговската мрежа като нова.",
        imgSrc: img2
    },
    {
        id: 3,
        title: "Продаваш лесно с Wear&Share",
        description: "Освободи място в гардероба си и спечели пари, като продаваш в службите, които вече не носиш.",
        imgSrc: img3,
    },
    {
        id: 4,
        title: "Бърза доставка",
        description: "Обикновено доставяме до 3 работни дни до всяка точка на страната. При поръчка до 16:00 се изпраща в същия ден или най-късно.",
        imgSrc: img4
    }
]

const sustainabilityFeatures = [
    {
        id: 1,
        title: "Secondhand находките, които обичаш, не само осъвбождават стила ти, но и спестяват ценни природни ресурси.",
        description: "",
        imgSrc: ""
    },
    {
        id: 2,
        title: "Когато изпращаш дрехи с Wear&Share, намаляваш живота им и се укрепства нуждата от производство на нови.",
        description: "",
        imgSrc: ""
    },
    {
        id: 3,
        title: "Имаш изцяло обновен гардероб, без това да тежи на бюджета ти, съвестта ти или на природата.",
        description: "",
        imgSrc: ""
    }
]

export const FeaturesSection = () => {
    return (
        <div className="w-full space-y-16">
            <div className="max-w-7xl mx-auto px-3">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
                    Добрата страна на модата
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.id} className="text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                {feature.imgSrc ? (
                                    <img
                                        src={feature.imgSrc.src}
                                        alt={feature.title}
                                        className="w-12 h-12"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-green-200 rounded-full"></div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sürdürülebilirlik bölümü */}
            <div className="w-full py-16 bg-green-100 rounded-lg">
                <div className="max-w-7xl mx-auto px-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
                        Устойчивото бъдеще на модата е тук
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {sustainabilityFeatures.map((feature) => (
                            <div key={feature.id} className="text-center space-y-6">
                                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm">
                                    {feature.imgSrc ? (
                                        <img
                                            src={feature.imgSrc}
                                            alt="Sustainability icon"
                                            className="w-14 h-14"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-green-200 rounded-full"></div>
                                    )}
                                </div>
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-sm mx-auto">
                                    {feature.title}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button className="w-[110px] h-[44px] rounded-md bg-transparent hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium transition-colors">
                            За нас
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
