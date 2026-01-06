'use client'
import { Globe, Leaf, RefreshCw, ShoppingBag, Tag, Truck, Wallet } from "lucide-react"
import { Button } from "../ui/button"

const features = [
    {
        id: 1,
        title: "Hər Gün Yeni Tapıntılar",
        description: "H&M-dən Gucci-yə qədər ən sevilən brendlərin minlərlə yeni ikinci əl moda məhsulunu hər gün əlavə edirik.",
        icon: <ShoppingBag className="w-6 h-6 text-rose-500" />,
        bgColor: "bg-rose-50"
    },
    {
        id: 2,
        title: "Xoşbəxt Edən Qiymətlər",
        description: "Hər bir tapıntının qiyməti, yeni məhsulların mağaza qiymətinə nisbətən 90%-ə qədər endirimlə təklif olunur.",
        icon: <Tag className="w-6 h-6 text-indigo-500" />,
        bgColor: "bg-indigo-50"
    },
    {
        id: 3,
        title: "Wear&Share ilə Asan Satış",
        description: "Artıq geyinmədiyin paltarları sataraq qardirobunda yer aç və qazanc əldə et.",
        icon: <RefreshCw className="w-6 h-6 text-emerald-500" />,
        bgColor: "bg-emerald-50"
    },
    {
        id: 4,
        title: "Sürətli Çatdırılma",
        description: "Adətən 3 iş günü ərzində çatdırılma. Saat 16:00-a qədər verilən sifarişlər həmin gün kargoya verilir.",
        icon: <Truck className="w-6 h-6 text-amber-500" />,
        bgColor: "bg-amber-50"
    }
]

const sustainabilityFeatures = [
    {
        id: 1,
        title: "Stilini Azad Et, Təbiəti Qoru",
        description: "Sevdiyin ikinci əl parçalar sadəcə tərzini əks etdirmir, həm də dəyərli təbii resursları qoruyur.",
        icon: <Leaf className="w-8 h-8 text-teal-600" />
    },
    {
        id: 2,
        title: "Dövrü Modaya Töhfə Ver",
        description: "Wear&Share ilə paltarlarını göndərdikdə, istifadə ömrünü uzadır və yeni istehsal ehtiyacını azaldırsan.",
        icon: <RefreshCw className="w-8 h-8 text-teal-600" />
    },
    {
        id: 3,
        title: "Büdcə və Təbiət Dostu Qardirob",
        description: "Büdcəni, vicdanını və ya təbiəti yormadan tamamilə yenilənmiş bir qardiroba sahib ol.",
        icon: <Wallet className="w-8 h-8 text-teal-600" />
    }
]

export const FeaturesSection = () => {
    return (
        <section className="w-full space-y-24 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-sm font-semibold tracking-wider text-rose-500 uppercase mb-2 block">Avantajlarımız</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Modanın Yaxşı Tərəfi
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.id} className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                            <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative overflow-hidden w-full">
                <div className="absolute inset-0 bg-linear-to-br from-teal-50 to-emerald-50 -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
                            <Globe className="w-6 h-6 text-teal-600" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-teal-900 tracking-tight">
                            Gələcəyin Modası Davamlıdır
                        </h2>
                        <p className="text-teal-700/80 text-lg max-w-2xl mx-auto">
                            Planetimizə hörmətli seçimlərlə modanın gələcəyini birlikdə formalaşdırırıq.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
                        {sustainabilityFeatures.map((feature) => (
                            <div key={feature.id} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-sm hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto text-teal-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-teal-900 text-center mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-teal-800/70 text-center leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            className="bg-transparent border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white px-10 py-6 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-teal-600/20"
                        >
                            Haqqımızda Daha Çox
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
