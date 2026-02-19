'use client';

import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useWishlist } from "@/hooks/useWishlist";
import { baseUrl } from "@/lib/httpClient";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addToCart } from "@/lib/redux/features/cartSlice";
import { Loading } from "@/components/shared/Loading";

export default function ProfileWishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading } = useWishlist();
  const dispatch = useAppDispatch();

  const getImageUrl = (img: string) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${baseUrl}${img}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">İstək Siyahısı (0)</h1>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Siyahınız boşdur</h3>
          <p className="text-gray-500 mt-2 mb-6">Bəyəndiyiniz məhsulları buraya əlavə edin</p>
          <Link href="/">
            <Button variant="outline">Alış-verişə Başla</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">İstək Siyahısı ({wishlistItems.length})</h1>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={() => clearWishlist()}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Siyahını Təmizlə
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {wishlistItems.map((item) => {
          const product = item.product;
          // Price logic
          const basePrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
          let currentPrice = basePrice;
          let oldPrice = product.oldPrice;

          if (product.discount && product.discount.isActive) {
            oldPrice = basePrice;
            if (product.discount.type === 'percentage') {
              currentPrice = basePrice * (1 - product.discount.value / 100);
            } else {
              currentPrice = basePrice - product.discount.value;
            }
          }

          const imageSrc = product.image || product.banner ? getImageUrl(product.image || product.banner!) : '/placeholder.png';

          return (
            <div key={item.id} className="group bg-white border border-zinc-200 rounded-2xl p-4 flex gap-4 hover:border-zinc-400 transition-all relative">
              {/* Image */}
              <div className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
                <Image
                  src={imageSrc}
                  alt={product.name || ''}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Assuming inStock is calculated based on stocks array if needed, for now ignoring */}
                {/* 
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xs font-bold px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm">Tükəndi</span>
                </div>
              )}
               */}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 mb-1">{product.brand || product.variants?.brand}</p>
                      <Link href={`/product/${product.id}`} className="font-medium text-zinc-900 line-clamp-2 hover:underline">
                        {product.name || product.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-red-500 hover:text-red-600 transition-colors p-1 -mr-1"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    {oldPrice && oldPrice > currentPrice && (
                      <p className="text-xs text-zinc-400 line-through mb-0.5">{oldPrice} ₼</p>
                    )}
                    <p className="font-bold text-lg text-zinc-900">{currentPrice.toFixed(2)} ₼</p>
                  </div>

                  <Button
                    onClick={() => dispatch(addToCart({
                      id: String(product.id),
                      title: product.name || product.title || '',
                      price: currentPrice,
                      image: imageSrc,
                      size: Array.isArray(product.size) ? product.size[0] : (product.size || 'M'), // Default size logic
                      seller: { name: product.brand || 'Satıcı' }
                    }))}
                    className={`rounded-lg h-10 px-4 gap-2 transition-all bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="hidden sm:inline">Səbətə At</span>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
