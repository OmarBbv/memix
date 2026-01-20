'use client';

import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function ProfileWishlistPage() {
  const wishlistItems = [
    {
      id: 1,
      name: "Oversize Pambıq T-shirt",
      brand: "Zara",
      price: "45.00 ₼",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
      inStock: true
    },
    {
      id: 2,
      name: "Yüksək Belli Cins Şalvar",
      brand: "Mango",
      price: "89.90 ₼",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
      inStock: true
    },
    {
      id: 3,
      name: "Klassik Dəri Kəmər",
      brand: "Massimo Dutti",
      price: "55.00 ₼",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
      inStock: true
    },
    {
      id: 4,
      name: "Günəş Eynəyi",
      brand: "Ray-Ban",
      price: "220.00 ₼",
      oldPrice: "280.00 ₼",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
      inStock: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">İstək Siyahısı ({wishlistItems.length})</h1>
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
          <Trash2 className="w-4 h-4 mr-2" />
          Siyahını Təmizlə
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group bg-white border border-zinc-200 rounded-2xl p-4 flex gap-4 hover:border-zinc-400 transition-all relative">
            {/* Image */}
            <div className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {!item.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xs font-bold px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm">Tükəndi</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 mb-1">{item.brand}</p>
                    <Link href={`/product/${item.id}`} className="font-medium text-zinc-900 line-clamp-2 hover:underline">
                      {item.name}
                    </Link>
                  </div>
                  <button className="text-zinc-400 hover:text-red-500 transition-colors p-1 -mr-1">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  {item.oldPrice && (
                    <p className="text-xs text-zinc-400 line-through mb-0.5">{item.oldPrice}</p>
                  )}
                  <p className="font-bold text-lg text-zinc-900">{item.price}</p>
                </div>

                <Button
                  disabled={!item.inStock}
                  className={`rounded-lg h-10 px-4 gap-2 transition-all ${!item.inStock ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10'}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Səbətə At</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
