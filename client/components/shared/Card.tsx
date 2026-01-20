'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleWishlist } from '@/lib/redux/features/wishlistSlice';


interface CardProps {
  className?: string;
  index?: number;
}

export interface Product {
  id: string | number;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  size?: string;
  condition?: string;
  city?: string;
}

export const Card = ({ className, index = 0 }: CardProps) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60", // Fashion 1
    "https://images.unsplash.com/photo-1529139574466-a302d27f6054?w=500&auto=format&fit=crop&q=60", // Fashion 2
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60", // Fashion 3
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&auto=format&fit=crop&q=60", // Fashion 4
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=60", // Fashion 5
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60", // Fashion 6
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&auto=format&fit=crop&q=60", // Fashion 7
    "https://images.unsplash.com/photo-1550614000-4b9519e09d43?w=500&auto=format&fit=crop&q=60", // Fashion 8
  ];

  const imageIndex = Math.abs(index) % images.length;
  const imageSrc = images[imageIndex];

  const generatePrice = (idx: number) => {
    const prices = [25, 45, 120, 30, 85, 60, 15, 200];
    return prices[idx % prices.length];
  }

  const price = generatePrice(index);
  const oldPrice = Math.floor(price * 1.5);

  const brands = ['Zara', 'H&M', 'Mango', 'Nike', 'Bershka', 'Stradivarius', 'Pull&Bear', 'Massimo Dutti'];
  const brand = brands[index % brands.length];

  const titles = [
    'Qara rəngli ziyafət donu',
    'Oversize pambıq köynək',
    'Klassik bej rəngli trençkot',
    'Yüksək belli cins şalvar',
    'Dəri gödəkçə',
    'İdman üslublu krossovka',
    'Zərif axşam çantası',
    'Yün toxunma sviter'
  ];
  const title = titles[index % titles.length];

  const product: Product = {
    id: index + 1,
    title,
    price,
    oldPrice,
    image: imageSrc,
    brand,
    size: 'S',
    condition: 'Çox yaxşı',
    city: 'Bakı'
  };

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <Link href={`/product/${index + 1}`} className="block">
      <div className={cn("group relative flex flex-col gap-2 cursor-pointer w-full", className)}>
        {/* Image Container */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges/Icons */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95 z-10",
              isWishlisted && "text-red-500 bg-white"
            )}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </button>
          {index % 3 === 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm z-10">
              -33%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 p-1">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-bold text-base text-gray-900">{price}.00 ₼</span>
              {index % 3 === 0 && (
                <span className="text-xs text-gray-400 line-through">{oldPrice}.00 ₼</span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-gray-900">{brand}</span>
              <span className="text-[10px] text-gray-500">Çox yaxşı</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 line-clamp-1 font-medium group-hover:text-black transition-colors">
            {title}
          </p>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">S ölçü</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-[10px] text-gray-500">Bakı</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
