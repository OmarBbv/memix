'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import logoIcon from "@/public/memi.svg";
import searchIcon from "@/public/navbar/search.svg";
import { Heart, ShoppingBag, User, Menu, ChevronRight, Globe } from "lucide-react";
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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from 'next-intl';

export default function Navbar() {
    const { data: categories = [] } = useCategoryTree();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [showCategories, setShowCategories] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()

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

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        setMobileMenuOpen(false);
    };

    const languages = [
        { code: 'az', label: 'Azərbaycan', flag: '🇦🇿' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full overflow-hidden h-auto z-50 bg-white">
                <TopBar />
                <div className="max-w-7xl mx-auto h-full px-3 py-2 md:px-0 sm:py-2 flex items-center gap-2 w-full">
                    {/* Logo */}
                    <div className="w-[90px] md:w-auto h-[45px] md:h-[55px] flex justify-center items-center gap-2 rounded-lg pl-[2px] pr-[3px] sm:mr-2 overflow-hidden shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image src={logoIcon} alt="Memix Logo" width={110} height={55} className="object-contain" />
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="flex-1 border-2 h-[38px] md:h-[40px] border-gray-300 rounded-[12px] flex items-center pl-1.5 sm:pl-2">
                        <Image src={searchIcon} alt={searchIcon} height={22} width={22} className="md:w-[25px] md:h-[25px]" />
                        <Input
                            placeholder="Pambıq şalvar axtar"
                            className="border-none shadow-none focus-visible:ring-0 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const target = e.target as HTMLInputElement;
                                    router.push(`/search?q=${target.value}`);
                                }
                            }}
                        />
                    </div>

                    {/* Desktop: user, wishlist, lang, cart */}
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
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    {/* Cart (both mobile & desktop) */}
                    <button
                        onClick={() => dispatch(openCart())}
                        className="flex items-center justify-center pl-1 pr-0.5 cursor-pointer relative"
                    >
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartItemsCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile burger menu */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <button className="flex md:hidden items-center justify-center cursor-pointer">
                                <Menu className="w-5 h-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col">
                            <SheetTitle className="sr-only">Menyu</SheetTitle>

                            {/* Menu header */}
                            <div className="px-5 pt-6 pb-4 border-b">
                                {isAuthenticated ? (
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
                                            {user?.avatar ? (
                                                <Image src={user.avatar} alt={profileName} fill sizes="40px" className="object-cover" />
                                            ) : (
                                                <span className="font-semibold text-base text-zinc-700">
                                                    {profileName?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{profileName}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                                        className="flex items-center gap-3 w-full"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-zinc-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm">Daxil ol</p>
                                            <p className="text-xs text-gray-500">Hesabına giriş et</p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="px-5 pt-4 pb-2">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Kateqoriyalar</h3>
                                    <div className="space-y-0.5">
                                        {categories?.map((item: Category) => (
                                            <Link
                                                key={item.id}
                                                href={`/category/${item.slug}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                {item.name}
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick links */}
                                <div className="px-5 pt-2 pb-2 border-t mt-2">
                                    <div className="space-y-0.5 pt-3">
                                        <button
                                            onClick={() => { router.push('/wishlist'); setMobileMenuOpen(false); }}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Heart className="w-5 h-5" />
                                            Sevimlilər
                                        </button>
                                        {isAuthenticated && (
                                            <button
                                                onClick={() => { router.push('/profile'); setMobileMenuOpen(false); }}
                                                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <User className="w-5 h-5" />
                                                Profil
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="px-5 pt-2 pb-4 border-t mt-2">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 pt-3">Dil</h3>
                                    <div className="flex gap-2">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLocaleChange(lang.code)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${locale === lang.code
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span>{lang.flag}</span>
                                                <span>{lang.code.toUpperCase()}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom actions */}
                            {isAuthenticated && (
                                <div className="border-t px-5 py-4">
                                    <button
                                        onClick={() => { dispatch(logout()); setMobileMenuOpen(false); router.push('/'); }}
                                        className="w-full text-center text-sm font-medium text-red-500 py-2"
                                    >
                                        Çıxış et
                                    </button>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
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

