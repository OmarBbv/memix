'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import logoIcon from "@/public/logo.jpeg";
import searchIcon from "@/public/navbar/search.svg";
import { CircleUserRound, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CartDrawer } from "../home/CartDrawer";
import { TopBar } from "../home/TopBar";
import { Input } from "../ui/input";
import { AuthModal } from "./AuthModal";

const getSlugFromText = (text: string): string => {
    const slugMap: { [key: string]: string } = {
        'Bu gün əlavə edilənlər': 'added-today',
        'Ən aşağı qiymətlər': 'lowest-prices',
        'Ən çox bəyənilənlər': 'most-liked',
        '🔥 Günün tapıntıları': 'daily-finds',
        'Qış klassikləri': 'winter-classics',
        'Ceketlər, paltolar və jiletlər': 'jackets-coats',
        'Qışın rahatlığında': 'winter-comfort',
        '🇹🇭 Tommy Hilfiger Shop': 'tommy-hilfiger',
        'Trenco': 'tracksuits',
        'Üzgüçülük geyimləri': 'swimwear',
        'Alt geyim': 'underwear',
        'Bluzkalar': 'blouses',
        'Ponço və boksro': 'ponchos',
        'Kombinezonlar': 'jumpsuits',
        'Cins': 'jeans',
        'Yeleklər': 'vests',
        'Jiletlər': 'cardigans',
        'Yubkalar': 'skirts',
        'Dəri ceketlər': 'leather-jackets',
        'Kostyumlar': 'suits',
        'Şortlar': 'shorts',
        'Paltolar': 'coats',
        'Zara': 'zara',
        'Tommy Hilfiger': 'tommy-hilfiger',
        'Nike': 'nike',
        'Pinko': 'pinko',
        'Karl Lagerfeld': 'karl-lagerfeld',
        'Bütün brendləri gör': 'all-brands',
        'FRESH': 'fresh',
        'Sırt çantaları': 'backpacks',
        'Çiyin çantaları': 'shoulder-bags',
        'Biju': 'jewelry',
        'Saatlar': 'watches',
        'İdman ayaqqabıları': 'sport-shoes',
        'Zərif ayaqqabılar': 'elegant-shoes',
        'Körpələr': 'babies',
        'Kiçik uşaqlar': 'toddlers'
    }

    return slugMap[text] || text.toLowerCase().replace(/\s+/g, '-')
}

const navItems = [
    {
        id: 1,
        name: 'Qadınlar',
        url: '/category/women',
        categories: {
            'Populyar': [
                'Bu gün əlavə edilənlər',
                'Ən aşağı qiymətlər',
                'Ən çox bəyənilənlər',
                '🔥 Günün tapıntıları',
                'Qış klassikləri',
                'Ceketlər, paltolar və jiletlər',
                'Qışın rahatlığında',
                '🇹🇭 Tommy Hilfiger Shop'
            ],
            'Qadın geyimləri': [
                'Trenco',
                'Üzgüçülük geyimləri',
                'Alt geyim',
                'Bluzkalar',
                'Ponço və boksro',
                'Kombinezonlar',
                'Cins',
                'Yeleklər',
                'Jiletlər',
                'Yubkalar',
                'Dəri ceketlər',
                'Kostyumlar',
                'Şortlar',
                'Paltolar'
            ],
            'Brendlər': [
                'Zara',
                'Tommy Hilfiger',
                'Nike',
                'Pinko',
                'Karl Lagerfeld',
                'Bütün brendləri gör'
            ],
            'Şəxsi vaucherlər': [
                'FRESH'
            ],
            'Saxlanılmış filtrlər': [
                'Saxlanılmış filtrlərinizi görmək üçün profilə daxil olun.'
            ]
        }
    },
    {
        id: 2,
        name: 'Kişilər',
        url: '/category/men',
        categories: {
            'Populyar': [
                'Bu gün əlavə edilənlər',
                'Ən aşağı qiymətlər',
                'Ən çox bəyənilənlər'
            ],
            'Kişi geyimləri': [
                'Trenco',
                'Üzgüçülük geyimləri',
                'Alt geyim'
            ],
            'Brendlər': [
                'Zara',
                'Tommy Hilfiger',
                'Nike'
            ]
        }
    },
    {
        id: 3,
        name: 'Çantalar',
        url: '/category/bags',
        categories: {
            'Populyar': [
                'Bu gün əlavə edilənlər',
                'Ən aşağı qiymətlər'
            ],
            'Çanta növləri': [
                'Sırt çantaları',
                'Çiyin çantaları'
            ]
        }
    },
    {
        id: 4,
        name: 'Aksesuarlar',
        url: '/category/accessories',
        categories: {
            'Populyar': [
                'Bu gün əlavə edilənlər',
                'Ən aşağı qiymətlər'
            ],
            'Növlər': [
                'Biju',
                'Saatlar'
            ]
        }
    },
    {
        id: 5,
        name: 'Ayaqqabılar',
        url: '/category/shoes',
        categories: {
            'Populyar': [
                'Bu gün əlavə edilənlər',
                'Ən aşağı qiymətlər'
            ],
            'Növlər': [
                'İdman ayaqqabıları',
                'Zərif ayaqqabılar'
            ]
        }
    },
    {
        id: 6,
        name: 'Uşaqlar',
        url: '/category/children',
        categories: {
            'Populyar': [
                'Bu gün əlavə edilənlər',
                'Ən aşağı qiymətlər'
            ],
            'Yaş qrupları': [
                'Körpələr',
                'Kiçik uşaqlar'
            ]
        }
    }
]

export default function Navbar() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    return (
        <>
            <nav className="fixed top-0 w-full h-auto z-50 bg-white">
                <TopBar />
                <div className="max-w-7xl mx-auto h-full px-3 py-2 md:px-0  sm:py-3 flex items-center gap-2 w-full">
                    <div className="w-[85px] md:w-auto h-[47px] flex justify-center items-center gap-2 rounded-lg pl-[2px] pr-[3px] sm:mx-2">
                        <Link href="/">
                            <Image src={logoIcon} alt="Memix Logo" width={85} height={85} />
                        </Link>
                        <div className="hidden md:flex items-center gap-4 ml-5">
                            <Link href="/" className="flex h-full -translate-y-[2px] items-center font-bold tracking-tighter text-lg">ALIŞ</Link>
                            <Link href="/" className="flex h-full -translate-y-[2px] items-center font-bold tracking-tighter text-lg">SATIŞ</Link>
                        </div>
                    </div>
                    <div className="w-2/4 flex-1 shrink border-2 h-auto md:h-[40px] border-gray-300 rounded-[12px] flex items-center pl-1.5 sm:pl-2">
                        <Image src={searchIcon} alt={searchIcon} height={25} width={25} />
                        <Input
                            placeholder="Pambıq şalvar axtar"
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
                            <HoverCard
                                key={`${item.id}-${pathname}`}
                                openDelay={20}
                                closeDelay={100}
                            >
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
                                                                                categoryItem === 'Bütün brendləri gör' ? 'text-gray-600 underline hover:no-underline' :
                                                                                    'text-gray-600'
                                                                        }`}
                                                                >
                                                                    {categoryItem}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        {categoryName === 'Şəxsi vaucherlər' && (
                                                            <div className="space-y-2 mt-4">
                                                                <h4 className="font-semibold text-gray-900 text-base">Qiymət</h4>
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                    <div>10 €-a qədər</div>
                                                                    <div>30 €-a qədər</div>
                                                                    <div>50 €-a qədər</div>
                                                                    <div>70 €-a qədər</div>
                                                                    <div>100 €-a qədər</div>
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
