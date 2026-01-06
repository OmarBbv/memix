'use client'

import { Home, Shirt, RefreshCw, Heart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
    {
        name: "Ana səhifə",
        href: "/",
        icon: Home
    },
    {
        name: "Məhsullar",
        href: "/products",
        icon: Shirt
    },
    {
        name: "Wear&Share",
        href: "/wear-share",
        icon: RefreshCw
    },
    {
        name: "Sevimlilər",
        href: "/favorites",
        icon: Heart
    },
    {
        name: "Profil",
        href: "/profile",
        icon: User
    }
]

export default function MobileNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium leading-none">
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

