import { Facebook, Instagram, Mail, MessageSquare, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-white text-[#2d2d2d] pt-16 pb-6 text-sm">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20">
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base mb-2">Mağaza</h3>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Şərtlər
                        </Link>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Çatdırılma və qaytarma
                        </Link>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Promosiyalar
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base mb-2">Xidmət</h3>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Wear&Share ilə sat
                        </Link>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Wear&Share necə işləyir?
                        </Link>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Satışlarım
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base mb-2">Əlavə məlumat üçün</h3>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Suallar
                        </Link>
                        <Link href="#" className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>Bizimlə əlaqə</span>
                        </Link>
                        <Link href="mailto:bg@Memixshop.com" className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                            <Mail className="w-4 h-4" />
                            <span>bg@Memixshop.com</span>
                        </Link>
                        <Link href="tel:024932555" className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                            <Phone className="w-4 h-4" />
                            <span>02 4932 555</span>
                        </Link>
                        <p className="text-gray-500 text-xs mt-1">
                            Bazar ertəsi - Cümə, 09:00 - 18:00
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-base mb-2">Şirkət</h3>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Memix haqqında
                        </Link>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Karyera imkanları
                        </Link>
                        <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                            Memix Blog
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 pb-16 border-b border-gray-200">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <Image src="/logo-Cr-ALXoK.svg" alt="Memix Logo" width={120} height={45} className="mb-2" />
                            <span className="text-[11px] tracking-[0.2em] font-normal text-gray-600 ml-1">
                                PRELOVED FASHION
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <Facebook className="w-5 h-5 text-gray-700" />
                            </Link>
                            <Link
                                href="#"
                                className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                <Instagram className="w-5 h-5 text-gray-700" />
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-4">
                        <h3 className="font-semibold text-base">Memix App</h3>
                        <div className="flex gap-4">
                            <div className="w-28 h-28 bg-black p-2 hidden sm:block">
                                <svg
                                    viewBox="0 0 100 100"
                                    className="w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect width="100" height="100" fill="white" />
                                    <rect x="10" y="10" width="25" height="25" fill="black" />
                                    <rect x="65" y="10" width="25" height="25" fill="black" />
                                    <rect x="10" y="65" width="25" height="25" fill="black" />
                                    <rect x="15" y="15" width="15" height="15" fill="white" />
                                    <rect x="70" y="15" width="15" height="15" fill="white" />
                                    <rect x="15" y="70" width="15" height="15" fill="white" />
                                    <rect x="20" y="20" width="5" height="5" fill="black" />
                                    <rect x="75" y="20" width="5" height="5" fill="black" />
                                    <rect x="20" y="75" width="5" height="5" fill="black" />
                                    <rect x="45" y="12" width="4" height="4" fill="black" />
                                    <rect x="50" y="12" width="4" height="4" fill="black" />
                                    <rect x="55" y="12" width="4" height="4" fill="black" />
                                    <rect x="42" y="20" width="4" height="4" fill="black" />
                                    <rect x="50" y="20" width="4" height="4" fill="black" />
                                    <rect x="45" y="45" width="4" height="4" fill="black" />
                                    <rect x="55" y="45" width="4" height="4" fill="black" />
                                    <rect x="65" y="45" width="4" height="4" fill="black" />
                                    <rect x="45" y="55" width="4" height="4" fill="black" />
                                    <rect x="50" y="60" width="4" height="4" fill="black" />
                                    <rect x="42" y="70" width="4" height="4" fill="black" />
                                    <rect x="50" y="75" width="4" height="4" fill="black" />
                                    <rect x="60" y="70" width="4" height="4" fill="black" />
                                    <rect x="70" y="50" width="4" height="4" fill="black" />
                                    <rect x="75" y="60" width="4" height="4" fill="black" />
                                    <rect x="65" y="80" width="4" height="4" fill="black" />
                                    <rect x="80" y="75" width="4" height="4" fill="black" />
                                </svg>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Link
                                    href="#"
                                    className="h-10 bg-black text-white rounded-lg px-4 flex items-center gap-3 hover:bg-gray-800 transition-colors min-w-[160px]"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] leading-tight">Download on the</span>
                                        <span className="text-xs font-semibold leading-tight">App Store</span>
                                    </div>
                                </Link>

                                <Link
                                    href="#"
                                    className="h-10 bg-black text-white rounded-lg px-4 flex items-center gap-3 hover:bg-gray-800 transition-colors min-w-[160px]"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] leading-tight">GET IT ON</span>
                                        <span className="text-xs font-semibold leading-tight">Google Play</span>
                                    </div>
                                </Link>

                                <Link
                                    href="#"
                                    className="h-10 bg-black text-white rounded-lg px-4 flex items-center gap-3 hover:bg-gray-800 transition-colors min-w-[160px]"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                                    </svg>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] leading-tight">EXPLORE IT ON</span>
                                        <span className="text-xs font-semibold leading-tight">AppGallery</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 text-xs">
                    <div className="text-gray-600 whitespace-nowrap">
                        © Copyright 2026 Memix Global EAD
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600">
                        <Link href="#" className="hover:text-black transition-colors whitespace-nowrap">
                            İstifadə şərtləri
                        </Link>
                        <Link href="#" className="hover:text-black transition-colors whitespace-nowrap">
                            Hüquqi məlumat
                        </Link>
                        <Link href="#" className="hover:text-black transition-colors whitespace-nowrap">
                            AB onlayn mübahisə həlli platforması
                        </Link>
                        <Link href="#" className="hover:text-black transition-colors whitespace-nowrap">
                            Sayt xəritəsi
                        </Link>
                        <Link href="#" className="hover:text-black transition-colors whitespace-nowrap">
                            Məxfilik və cookie siyasəti
                        </Link>
                        <Link href="#" className="hover:text-black transition-colors whitespace-nowrap">
                            Cookie parametrləri
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="h-6 px-2 flex items-center">
                            <span className="font-bold text-[#1A1F71] text-base">VISA</span>
                        </div>

                        <div className="h-6 px-2 flex items-center bg-[#00579F] rounded">
                            <span className="font-semibold text-white text-[10px]">electron</span>
                        </div>

                        <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-[#EB001B] flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-[#EB001B]"></div>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-[#F79E1B] -ml-3 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-[#F79E1B]"></div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-7 h-7 rounded-full bg-[#0099DF] flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-[#0099DF]"></div>
                            </div>
                            <div className="w-7 h-7 rounded-full bg-[#E61C24] -ml-3 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-[#E61C24]"></div>
                            </div>
                        </div>

                        <div className="h-6 px-2 flex items-center bg-[#0061A8] rounded">
                            <span className="font-bold text-white text-xs">ePay.bg</span>
                        </div>

                        <div className="h-6 px-2 flex items-center bg-[#006FCF] rounded">
                            <span className="font-bold text-white text-[10px]">AMERICAN<br />EXPRESS</span>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00B67A">
                                <path d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
                            </svg>
                            <span className="font-bold text-gray-800 text-sm">Trustpilot</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
