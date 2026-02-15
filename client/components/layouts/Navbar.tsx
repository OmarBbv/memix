'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import logoIcon from "@/public/memi.svg";
import searchIcon from "@/public/navbar/search.svg";
import { Heart, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

import { useState, useEffect } from "react";
import { TopBar } from "../home/TopBar";
import { Input } from "../ui/input";
import { AuthModal } from "./AuthModal";
import { useCategoryTree } from "@/hooks/useCategories";
import { Category } from "@/types/category.types";
import { openCart } from "@/lib/redux/features/cartSlice";
import { logout } from "@/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

export default function Navbar() {
    const { data: categories = [] } = useCategoryTree();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [showCategories, setShowCategories] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const router = useRouter()
    const pathname = usePathname()

    const dispatch = useAppDispatch();
    const cartItemsCount = useAppSelector((state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const profileName = user?.name && user.name !== 'undefined'
        ? user.name
        : (user?.email?.split('@')[0] ?? "İstifadəçi");

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowCategories(false);
            } else if (currentScrollY < lastScrollY) {
                setShowCategories(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <nav className="fixed top-0 w-full overflow-hidden h-auto z-50 bg-white">
                <TopBar />
                <div className="max-w-7xl mx-auto h-full px-3 py-2 md:px-0  sm:py-2 flex items-center gap-2 w-full">
                    <div className="w-[110px] md:w-auto h-[55px] flex justify-center items-center gap-2 rounded-lg pl-[2px] pr-[3px] sm:mr-2 overflow-hidden shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image src={logoIcon} alt="Memix Logo" width={110} height={55} className="object-contain" />
                        </Link>
                    </div>
                    <div className="flex-1 border-2 h-auto md:h-[40px] border-gray-300 rounded-[12px] flex items-center pl-1.5 sm:pl-2">
                        <Image src={searchIcon} alt={searchIcon} height={25} width={25} />
                        <Input
                            placeholder="Pambıq şalvar axtar"
                            className="border-none shadow-none focus-visible:ring-0"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const target = e.target as HTMLInputElement;
                                    router.push(`/search?q=${target.value}`);
                                }
                            }}
                        />
                    </div>
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="hidden md:flex items-center justify-center pl-1.5 cursor-pointer outline-none"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center">
                                        {user?.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={profileName}
                                                fill
                                                sizes="32px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="font-medium text-sm text-zinc-700">
                                                {profileName?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white z-9999">
                                <DropdownMenuLabel>Xoş gəldin, {profileName}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                                    Profil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    dispatch(logout());
                                    router.push('/');
                                }} className="cursor-pointer text-red-600 focus:text-red-600">
                                    Çıxış et
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <button
                            className="hidden md:flex items-center justify-center pl-1.5 cursor-pointer"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            <User className="w-6 h-6 text-gray-700" />
                        </button>
                    )}
                    <button
                        onClick={() => router.push('/wishlist')}
                        className="hidden md:flex items-center justify-center pl-1.5 cursor-pointer">
                        <Heart className="w-6 h-6" />
                    </button>
                    <LanguageSwitcher />

                    <button
                        onClick={() => dispatch(openCart())}
                        className="flex items-center justify-center pl-1.5 pr-1.5 cursor-pointer relative"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartItemsCount}
                            </span>
                        )}
                    </button>
                </div>

                <div
                    className={`hidden md:block w-full bg-white px-2 transition-all duration-300 ease-in-out overflow-hidden ${showCategories
                        ? 'h-auto pt-1 pb-0 opacity-100'
                        : 'max-h-0 py-0 opacity-0'
                        }`}
                >
                    <div className="max-w-7xl flex mx-auto items-center gap-4 pb-4">
                        {categories?.map((item: Category) => (
                            <HoverCard
                                key={`${item.id}-${pathname}`}
                                openDelay={20}
                                closeDelay={100}
                            >
                                <HoverCardTrigger asChild>
                                    <Link href={`/category/${item.slug}`} className="text-sm font-medium text-zinc-700 hover:text-black flex items-center gap-2 transition-colors">
                                        {item.name}
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-screen max-w-none p-0 rounded-none border-0 shadow-lg" style={{ width: '100vw', maxWidth: 'none', left: 0, right: 0 }}>
                                    <div className="w-full bg-white min-h-[60vh]">
                                        <div className="max-w-7xl mx-auto py-8">
                                            <div className="grid grid-cols-5 gap-8">
                                                {item.children?.map((subCategory: Category) => (
                                                    <div key={subCategory.id} className="space-y-4">
                                                        <h3 className="font-semibold text-gray-900 text-base">
                                                            {subCategory.name}
                                                        </h3>
                                                        <div className="space-y-2">
                                                            {subCategory.children?.map((leaf: Category) => (
                                                                <Link
                                                                    key={leaf.id}
                                                                    href={`/category/${leaf.slug}`}
                                                                    className={`block text-sm hover:text-gray-900 transition-colors ${leaf.name.includes('🔥') ? 'text-red-500 hover:text-red-600' :
                                                                        leaf.name.includes('🇹🇭') ? 'text-blue-600 hover:text-blue-700' :
                                                                            leaf.name === 'FRESH' ? 'bg-black text-white px-2 py-1 rounded text-xs font-medium inline-block' :
                                                                                leaf.name === 'Bütün brendləri gör' ? 'text-gray-600 underline hover:no-underline' :
                                                                                    'text-gray-600'
                                                                        }`}
                                                                >
                                                                    {leaf.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        {subCategory.name === 'Şəxsi vaucherlər' && (
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
