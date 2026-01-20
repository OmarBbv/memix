'use client'

import { cn } from "@/lib/utils";
import logoIcon from "@/public/logo.jpeg";
import { X } from 'lucide-react';
import Image from "next/image";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { close } from "@/lib/redux/features/topBarSlice";

export const TopBar = () => {
    const isOpen = useAppSelector((state) => state.topBar.isOpen);
    const dispatch = useAppDispatch();

    return <div className={cn(
        ' bg-[#FAFAFA] w-full',
        !isOpen && 'hidden'
    )}>
        <div id="top-bar" className="flex items-center gap-2 justify-between py-2 px-3 md:px-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 ">
                <div className="w-[50px] h-[47px] bg-success flex justify-center items-center rounded-lg px-[3px]">
                    <Image src={logoIcon} alt={'logoIcon'} width={50} height={50} />
                </div>
                <div className="flex flex-col leading-3">
                    <h1 className="text-[13px]">Memix</h1>
                    <p className="text-[10px]">Android tətbiqini yükləyin</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="text-[10px] md:text-xs p-[2px] sm:py-2 sm:px-4 bg-gray-300 rounded-lg">Yüklə</button>
                <button
                    onClick={() => dispatch(close())}
                    className="cursor-pointer select-none hover:bg-gray-100 p-1 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
}
