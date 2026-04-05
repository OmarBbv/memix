'use client';

import { Button } from "@/components/ui/button";
import { Heart, Loader2, ArrowRight } from "lucide-react"; // Import Loader2
import { Link } from "@/i18n/routing";
import { Card } from "@/components/shared/Card";
import { useWishlist } from "@/hooks/useWishlist";
import { Loading } from "@/components/shared/Loading";

export default function WishlistPage() {
    const { wishlistItems, isLoading } = useWishlist();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

                <div className="max-w-2xl w-full mx-auto text-center space-y-10 relative">
                    <div className="relative inline-flex flex-col items-center">
                        <div className="absolute inset-0 bg-linear-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-2xl scale-150 animate-pulse" />

                        <div className="relative bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center justify-center animate-bounce duration-3000">
                            <Heart
                                className="w-16 h-16 text-pink-500 fill-pink-50/50"
                                strokeWidth={1.5}
                            />
                        </div>

                        <Heart className="absolute -top-4 -right-4 w-6 h-6 text-pink-200 fill-pink-100/50 animate-bounce delay-150" />
                        <Heart className="absolute bottom-4 -left-6 w-4 h-4 text-purple-200 fill-purple-100/50 animate-bounce delay-300" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
                            Sevimliləriniz boşdur
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                            Bəyəndiyiniz məhsulları ürək işarəsinə vuraraq bura əlavə edə bilərsiniz.
                        </p>
                    </div>

                    <div className="pt-6">
                        <Link href="/">
                            <Button
                                className="rounded-xl h-14 px-10 text-lg font-bold bg-zinc-950 text-white hover:bg-zinc-900 shadow-2xl transition-all duration-500 relative overflow-hidden group active:scale-95"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    Alış-verişə Başla
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Sevimlilər ({wishlistItems.length})</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                    <Card key={item.id} product={item.product} showTrashIcon={true} />
                ))}
            </div>
        </div>
    );
}
