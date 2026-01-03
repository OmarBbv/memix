import Image from "next/image"
import img1 from "@/public/home/promo-grid/img1.jpg"
import img2 from "@/public/home/promo-grid/img2.jpg"
import img3 from "@/public/home/promo-grid/img3.jpg"
import img4 from "@/public/home/promo-grid/img4.jpg"
import img5 from "@/public/home/promo-grid/img5.jpg"
import img6 from "@/public/home/promo-grid/img6.jpg"

const promoGrid = [img1, img2, img3, img4, img5, img6]

export const PromoGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promoGrid.map((banner) => (
                <Image key={banner.src} loading="lazy" src={banner} alt="promo banner" width={600} height={600} className="w-full h-full object-cover rounded-lg" />
            ))}
        </div>
    )
}

