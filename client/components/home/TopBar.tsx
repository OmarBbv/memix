'use client'

import { cn } from "@/lib/utils";
import logoIcon from "@/public/logo.jpeg";
import { X } from 'lucide-react';
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { close } from "@/lib/redux/features/topBarSlice";

export const TopBar = () => {
    const isOpen = useAppSelector((state) => state.topBar.isOpen);
    const dispatch = useAppDispatch();

    return (
        <div className={cn(
            'fixed bottom-[64px] md:bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-100 transition-all duration-300 ease-in-out',
            !isOpen ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'
        )}>
            <div id="top-bar" className="flex items-center gap-4 justify-between py-3 px-4 max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-[45px] h-[45px] bg-[#f5f5f5] flex justify-center items-center rounded-xl overflow-hidden shadow-sm">
                        <Image src={logoIcon} alt={'logoIcon'} width={45} height={45} className="object-cover" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-[14px] font-bold text-black leading-tight">Memix</h1>
                        <p className="text-[11px] text-gray-500 font-medium">Mobil tətbiqini yükləyin</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-[12px] font-semibold py-1.5 px-5 bg-black text-white rounded-full transition-transform active:scale-95">Yüklə</button>
                    <button
                        onClick={() => dispatch(close())}
                        className="p-1.5 text-gray-400 hover:text-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
