'use client';

import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleWishlist } from "@/lib/redux/features/wishlistSlice";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { addToCart } from "@/lib/redux/features/cartSlice";

export default function WishlistPage() {
    const { items } = useAppSelector((state) => state.wishlist);
    const dispatch = useAppDispatch();

    if (items.length === 0) {
        return (
            <div className="min-h-[dvh] flex items-center justify-center px-4 max-w-7xl mx-auto ">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <div className="flex justify-center">
                        <Heart
                            className="w-32 h-32 text-gray-200 stroke-1"
                            fill="none"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
                            SEVİMLİLƏRİNİZ BOŞDUR
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 max-w-lg mx-auto">
                            Bəyəndiyiniz məhsulları ürək işarəsinə vuraraq bura əlavə edə bilərsiniz.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="px-8 cursor-pointer py-6 text-base font-bold uppercase border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                            >
                                ALIŞ-VERİŞƏ BAŞLA
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Sevimlilər ({items.length})</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="group relative flex flex-col gap-2">
                        <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <button
                                onClick={() => dispatch(toggleWishlist(item))}
                                className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow-sm transition-all hover:scale-110 active:scale-95 z-10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 p-1">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-sm md:text-base">{item.price} ₼</span>
                                <span className="text-xs font-semibold text-gray-500">{item.brand}</span>
                            </div>
                            <h3 className="text-sm text-gray-700 line-clamp-1 font-medium hover:underline cursor-pointer">
                                <Link href={`/product/${item.id}`}>{item.title}</Link>
                            </h3>
                            <Button
                                onClick={() => dispatch(addToCart({
                                    id: String(item.id),
                                    title: item.title,
                                    price: item.price,
                                    image: item.image,
                                    size: item.size || 'M',
                                    seller: { name: 'Memix' }
                                }))}
                                size="sm"
                                className="w-full mt-2 gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Səbətə at
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
