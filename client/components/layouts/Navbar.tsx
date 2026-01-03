'use client'

import Image from "next/image"
import { TopBar } from "../home/TopBar";
import { Input } from "../ui/input";
import logoIcon from "@/public/logo-Cr-ALXoK.svg"
import searchIcon from "@/public/navbar/search.svg"
import { ShoppingBag } from "lucide-react"

export default function Navbar() {
    return <nav className="fixed top-0 w-full h-auto z-50 bg-white">
        <TopBar />
        <div className="max-w-7xl mx-auto h-full px-3 py-2 sm:py-3 flex items-center gap-2 w-full">
            <div className="w-[85px] h-[47px] flex justify-center items-center rounded-lg pl-[2px] pr-[3px]">
                <Image src={logoIcon} alt={logoIcon} width={85} height={85} />
            </div>
            <div className="w-2/4 flex-1 shrink border border-gray-300 rounded-lg flex items-center pl-1.5 sm:pl-2">
                <Image src={searchIcon} alt={searchIcon} height={25} width={25} />
                <Input
                    placeholder="Търси ленени панталони"
                    className="focus-visible:outline-none focus-visible:ring-0 focus-visible:border-input border-none shadow-none"
                />
            </div>
            <button className="flex items-center justify-center pl-1.5">
                <ShoppingBag className="w-6 h-6" />
            </button>
        </div>
    </nav>
}