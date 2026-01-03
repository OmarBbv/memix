'use client'

import Image from "next/image"
import logoIcon from "@/public/navbar/logo-remix.svg"
import { X } from 'lucide-react';
import React from "react";
import { cn } from "@/lib/utils";

export const TopBar = () => {
    const [topHidden, setTopHidden] = React.useState(true);

    return <div className={cn(
        ' bg-[#FAFAFA] w-full',
        !topHidden && 'hidden'
    )}>
        <div className="flex items-center gap-2 justify-between py-2 px-3 md:px-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 ">
                <div className="w-[50px] h-[47px] bg-success flex justify-center items-center rounded-lg px-[3px]">
                    <Image src={logoIcon} alt={logoIcon} width={50} height={50} />
                </div>
                <div className="flex flex-col leading-3">
                    <h1 className="text-[13px]">Remix</h1>
                    <p className="text-[10px]">Свалете приложението за Android</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="text-[10px] md:text-xs p-[2px] sm:py-2 sm:px-4 bg-gray-300 rounded-lg">Изтегли</button>
                <button
                    onClick={() => setTopHidden(prev => !prev)}
                    className="cursor-pointer select-none hover:bg-gray-100 p-1 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
}