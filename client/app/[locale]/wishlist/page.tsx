'use client';

import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleWishlist } from "@/lib/redux/features/wishlistSlice";
import { Link } from "@/i18n/routing";
import { addToCart } from "@/lib/redux/features/cartSlice";
import { Card } from "@/components/shared/Card";

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
                                className="px-8 cursor-pointer py-5 text-base font-bold uppercase border-2 border-gray-900 hover:bg-gray-50 transition-colors"
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
                    <Card key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
}
