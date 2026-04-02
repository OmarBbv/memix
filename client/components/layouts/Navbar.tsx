'use client'

import logoIcon from "@/public/memi.svg";
import searchIcon from "@/public/navbar/search.svg";
import { Heart, ShoppingBag, User, Menu, ChevronRight, Globe, Search, X, Sparkles, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { MobileSearch } from "../ui/MobileSearch";

import { useState, useEffect } from "react";
import { TopBar } from "../home/TopBar";
import { Input } from "../ui/input";
import { DesktopCategoryNav } from "./DesktopCategoryNav";
import { AuthModal } from "./AuthModal";
import { useCategoryTree } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchSuggestions } from "../ui/SearchSuggestions";
import { Category } from "@/types/category.types";
import { openCart, fetchCart } from "@/lib/redux/features/cartSlice";
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
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const router = useRouter()

    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const debouncedSearch = useDebounce(searchQuery, 300)

    const { data: searchResults, isLoading: isSearchLoading } = useProducts(
        debouncedSearch ? { search: debouncedSearch.toLowerCase() } : undefined
    )

    const { data: popularProducts, isLoading: isPopularLoading } = useProducts({
        limit: 5,
        sort: 'popular'
    })

    const suggestions = searchQuery
        ? (searchResults?.data?.slice(0, 7) || [])
        : (popularProducts?.data?.slice(0, 5) || [])
    const isLoading = searchQuery ? isSearchLoading : isPopularLoading

    const pathname = usePathname()
    const locale = useLocale()

    const dispatch = useAppDispatch();
    const cartItemsCount = useAppSelector((state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const profileName = user?.name && user.name !== 'undefined'
        ? user.name
        : (user?.email?.split('@')[0] ?? "İstifadəçi");

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [isAuthenticated, dispatch]);

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
            <MobileSearch isOpen={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
            <nav className="fixed top-0 w-full h-auto z-50 bg-white">
                <TopBar />
                <div className="max-w-7xl mx-auto h-full px-3 py-2 md:px-0 sm:py-2 flex items-center gap-2 w-full">
                    {/* Logo */}
                    <div className="w-[90px] md:w-auto h-[45px] md:h-[55px] flex justify-center items-center gap-2 rounded-lg pl-[2px] pr-[3px] sm:mr-2 overflow-hidden shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image src={logoIcon} alt="Memix Logo" width={110} height={55} className="object-contain" />
                        </Link>
                    </div>

                    {/* Mobile Search Trigger */}
                    <button
                        className="flex-1 md:hidden h-[38px] border-2 border-gray-300 rounded-[12px] flex items-center pl-3 text-gray-400 text-sm gap-2"
                        onClick={() => setMobileSearchOpen(true)}
                    >
                        <Search className="w-4 h-4" />
                        <span className="truncate">Axtarış edin...</span>
                    </button>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 border-2 h-[38px] md:h-[40px] border-gray-300 rounded-[12px] items-center pl-1.5 sm:pl-2 relative">
                        <Image src={searchIcon} alt={searchIcon} height={22} width={22} className="md:w-[25px] md:h-[25px]" />
                        <Input
                            placeholder="Pambıq şalvar axtar"
                            className="border-none shadow-none focus-visible:ring-0 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.push(`/search?q=${searchQuery}`);
                                    setIsSearchFocused(false);
                                }
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                onMouseDown={(e) => e.preventDefault()}
                                className="mr-2 text-gray-400 hover:text-gray-600 outline-none"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        <SearchSuggestions
                            open={isSearchFocused}
                            query={searchQuery}
                            suggestions={suggestions}
                            loading={isLoading}
                            onClose={() => setIsSearchFocused(false)}
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
                                    localStorage.removeItem('token');
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
                                        <Link
                                            href="/search?listingType=new"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Sparkles className="w-5 h-5 text-[#d02424]" />
                                                Yeni Məhsullar
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </Link>
                                        <Link
                                            href="/search?listingType=used"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-black hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <RefreshCw className="w-5 h-5 text-blue-600" />
                                                İkinci əl
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </Link>
                                        <DropdownMenuSeparator className="my-2 bg-gray-100" />
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

                            {isAuthenticated && (
                                <div className="border-t px-5 py-4">
                                    <button
                                        onClick={() => { localStorage.removeItem('token'); dispatch(logout()); setMobileMenuOpen(false); router.push('/'); }}
                                        className="w-full text-center text-sm font-medium text-red-500 py-2"
                                    >
                                        Çıxış et
                                    </button>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>

                <DesktopCategoryNav categories={categories} show={showCategories} />
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    )
}

