'use client'

import { useState } from "react"
import Image from "next/image"
import { TopBar } from "../home/TopBar";
import { Input } from "../ui/input";
import logoIcon from "@/public/logo-Cr-ALXoK.svg"
import searchIcon from "@/public/navbar/search.svg"
import { CircleUserRound, Heart, ShoppingBag } from "lucide-react"
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AuthModal } from "./AuthModal";
import { useRouter } from "next/navigation";
import { CartDrawer } from "../home/CartDrawer";

// URL mapping fonksiyonu
const getSlugFromText = (text: string): string => {
    const slugMap: { [key: string]: string } = {
        'Добавени днес': 'added-today',
        'Най-ниски цени': 'lowest-prices',
        'Най-харесвани': 'most-liked',
        '🔥 Находките на деня': 'daily-finds',
        'Зимни класики': 'winter-classics',
        'Сака, якета и жилетки': 'jackets-coats',
        'В уюта на зимата': 'winter-comfort',
        '🇹🇭 Tommy Hilfiger Shop': 'tommy-hilfiger',
        'Анцузи': 'tracksuits',
        'Бански': 'swimwear',
        'Бельо': 'underwear',
        'Блузи': 'blouses',
        'Боксро и пончо': 'ponchos',
        'Гащеризони': 'jumpsuits',
        'Дънки': 'jeans',
        'Елеци': 'vests',
        'Жилетки': 'cardigans',
        'Клинове': 'skirts',
        'Кожени якета': 'leather-jackets',
        'Костюми': 'suits',
        'Къси панталони': 'shorts',
        'Палта': 'coats',
        'Zara': 'zara',
        'Tommy Hilfiger': 'tommy-hilfiger',
        'Nike': 'nike',
        'Pinko': 'pinko',
        'Karl Lagerfeld': 'karl-lagerfeld',
        'Вижте всички марки': 'all-brands',
        'FRESH': 'fresh',
        'Раници': 'backpacks',
        'Чанти за рамо': 'shoulder-bags',
        'Бижута': 'jewelry',
        'Часовници': 'watches',
        'Спортни обувки': 'sport-shoes',
        'Елегантни обувки': 'elegant-shoes',
        'Бебета': 'babies',
        'Малки деца': 'toddlers'
    }

    return slugMap[text] || text.toLowerCase().replace(/\s+/g, '-')
}

const navItems = [
    {
        id: 1,
        name: 'Жени',
        url: '/category/women',
        categories: {
            'Популярни': [
                'Добавени днес',
                'Най-ниски цени',
                'Най-харесвани',
                '🔥 Находките на деня',
                'Зимни класики',
                'Сака, якета и жилетки',
                'В уюта на зимата',
                '🇹🇭 Tommy Hilfiger Shop'
            ],
            'Дамски дрехи': [
                'Анцузи',
                'Бански',
                'Бельо',
                'Блузи',
                'Боксро и пончо',
                'Гащеризони',
                'Дънки',
                'Елеци',
                'Жилетки',
                'Клинове',
                'Кожени якета',
                'Костюми',
                'Къси панталони',
                'Палта'
            ],
            'Марки': [
                'Zara',
                'Tommy Hilfiger',
                'Nike',
                'Pinko',
                'Karl Lagerfeld',
                'Вижте всички марки'
            ],
            'Персонални ваучери': [
                'FRESH'
            ],
            'Запазени филтри': [
                'За да видиш запазените си филтри, влез в профила си.'
            ]
        }
    },
    {
        id: 2,
        name: 'Мъже',
        url: '/category/men',
        categories: {
            'Популярни': [
                'Добавени днес',
                'Най-ниски цени',
                'Най-харесвани'
            ],
            'Мъжки дрехи': [
                'Анцузи',
                'Бански',
                'Бельо'
            ],
            'Марки': [
                'Zara',
                'Tommy Hilfiger',
                'Nike'
            ]
        }
    },
    {
        id: 3,
        name: 'Чанти',
        url: '/category/bags',
        categories: {
            'Популярни': [
                'Добавени днес',
                'Най-ниски цени'
            ],
            'Видове чанти': [
                'Раници',
                'Чанти за рамо'
            ]
        }
    },
    {
        id: 4,
        name: 'Аксесоари',
        url: '/category/accessories',
        categories: {
            'Популярни': [
                'Добавени днес',
                'Най-ниски цени'
            ],
            'Видове': [
                'Бижута',
                'Часовници'
            ]
        }
    },
    {
        id: 5,
        name: 'Обувки',
        url: '/category/shoes',
        categories: {
            'Популярни': [
                'Добавени днес',
                'Най-ниски цени'
            ],
            'Видове': [
                'Спортни обувки',
                'Елегантни обувки'
            ]
        }
    },
    {
        id: 6,
        name: 'Деца',
        url: '/category/children',
        categories: {
            'Популярни': [
                'Добавени днес',
                'Най-ниски цени'
            ],
            'Възрастови групи': [
                'Бебета',
                'Малки деца'
            ]
        }
    }
]

export default function Navbar() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const router = useRouter()

    return (
        <>
            <nav className="fixed top-0 w-full h-auto z-50 bg-white">
                <TopBar />
                <div className="max-w-7xl mx-auto h-full px-3 py-2 md:px-0  sm:py-3 flex items-center gap-2 w-full">
                    <div className="w-[85px] md:w-auto h-[47px] flex justify-center items-center gap-2 rounded-lg pl-[2px] pr-[3px] sm:mx-2">
                        <Link href="/">
                            <Image src={logoIcon} alt={logoIcon} width={85} height={85} />
                        </Link>
                        <div className="hidden md:flex items-center gap-4 ml-5">
                            <Link href="/" className="flex h-full -translate-y-[2px] items-center font-bold tracking-tighter text-lg">ПАЗАРУВАЙ</Link>
                            <Link href="/" className="flex h-full -translate-y-[2px] items-center font-bold tracking-tighter text-lg">ПРОДАЙ</Link>
                        </div>
                    </div>
                    <div className="w-2/4 flex-1 shrink border-2 h-auto md:h-[40px] border-gray-300 rounded-[12px] flex items-center pl-1.5 sm:pl-2">
                        <Image src={searchIcon} alt={searchIcon} height={25} width={25} />
                        <Input
                            placeholder="Търси ленени панталони"
                            className="border-none shadow-none"
                        />
                    </div>
                    <button
                        className="hidden md:flex items-center justify-center pl-1.5 cursor-pointer"
                        onClick={() => setIsAuthModalOpen(true)}
                    >
                        <CircleUserRound className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => router.push('/wishlist')}
                        className="hidden md:flex items-center justify-center pl-1.5 cursor-pointer">
                        <Heart className="w-6 h-6" />
                    </button>
                    <CartDrawer>
                        <button className="flex items-center justify-center pl-1.5 pr-1.5 cursor-pointer">
                            <ShoppingBag className="w-6 h-6" />
                        </button>
                    </CartDrawer>
                </div>

                <div className="hidden md:block w-full h-auto bg-[#F9F9F9] py-4 px-2">
                    <div className="max-w-7xl flex mx-auto items-center gap-4">
                        {navItems.map((item) => (
                            <HoverCard key={item.id} openDelay={20} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <Link href={item.url} className="text-base font-normal text-gray-700 hover:text-gray-900 flex items-center gap-2">
                                        {item.name}
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-screen max-w-none p-0 rounded-none border-0 shadow-lg" style={{ width: '100vw', maxWidth: 'none', left: 0, right: 0 }}>
                                    <div className="w-full bg-white min-h-[60vh]">
                                        <div className="max-w-7xl mx-auto py-8">
                                            <div className="grid grid-cols-5 gap-8">
                                                {Object.entries(item.categories).map(([categoryName, categoryItems]) => (
                                                    <div key={categoryName} className="space-y-4">
                                                        <h3 className="font-semibold text-gray-900 text-base">
                                                            {categoryName}
                                                        </h3>
                                                        <div className="space-y-2">
                                                            {categoryItems.map((categoryItem: string, index: number) => (
                                                                <Link
                                                                    key={index}
                                                                    href={`/category/${getSlugFromText(categoryItem)}`}
                                                                    className={`block text-sm hover:text-gray-900 transition-colors ${categoryItem.includes('🔥') ? 'text-red-500 hover:text-red-600' :
                                                                        categoryItem.includes('🇹🇭') ? 'text-blue-600 hover:text-blue-700' :
                                                                            categoryItem === 'FRESH' ? 'bg-black text-white px-2 py-1 rounded text-xs font-medium inline-block' :
                                                                                categoryItem === 'Вижте всички марки' ? 'text-gray-600 underline hover:no-underline' :
                                                                                    'text-gray-600'
                                                                        }`}
                                                                >
                                                                    {categoryItem}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        {categoryName === 'Персонални ваучери' && (
                                                            <div className="space-y-2 mt-4">
                                                                <h4 className="font-semibold text-gray-900 text-base">Цена</h4>
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                    <div>до 10 €</div>
                                                                    <div>до 30 €</div>
                                                                    <div>до 50 €</div>
                                                                    <div>до 70 €</div>
                                                                    <div>до 100 €</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        ))}
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    )
}