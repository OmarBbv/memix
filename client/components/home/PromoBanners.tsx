import img from '@/public/home/promo-banners/img.jpg'
import img1 from '@/public/home/promo-banners/img1.jpg'
import Image from "next/image"

export const PromoBanners = () => {
    return (
        <div className="flex flex-col gap-2 md:gap-6 mb-6 mt-4 md:mt-6">
            <div className="text-center space-y-1">
                <p className="flex flex-col gap-1 md:flex-row items-center justify-center text-lg font-medium">
                    <span>İkinci əl və etiketli yeni məhsulları al.</span>
                    <span>Asanlıqla sat. Yaxşılıq et.</span>
                </p>
            </div>
            <div className="relative w-full rounded-lg overflow-hidden">
                <Image src={img1} alt="promo-logo" className="w-full object-cover rounded-lg h-[150px]" />
            </div>
            <div className="relative w-full rounded-lg overflow-hidden">
                <Image src={img} alt="promo-logo" />
            </div>
        </div>
    )
}
