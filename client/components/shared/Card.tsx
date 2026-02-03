'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Heart, Info } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleWishlist } from '@/lib/redux/features/wishlistSlice';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PRODUCTS, Product } from '@/lib/products';

interface CardProps {
  className?: string;
  index?: number;
  category?: string;
  product?: Product;
}

export const Card = ({ className, index = 0, category, product: propProduct }: CardProps) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  let productData = propProduct;

  // Fallback logic for backward compatibility (e.g. Home page)
  if (!productData) {
    // Create a filtered list if category is present to pick a random item from that category
    let sourceList = PRODUCTS;
    if (category) {
      const lowerCat = category.toLowerCase();
      if (lowerCat.includes('accessor')) sourceList = PRODUCTS.filter(p => p.category === 'accessories');
      else if (lowerCat.includes('kid') || lowerCat.includes('child')) sourceList = PRODUCTS.filter(p => p.category === 'kids');
      else if (lowerCat.includes('bag')) sourceList = PRODUCTS.filter(p => p.category === 'bags');
      else if (lowerCat.includes('shoe')) sourceList = PRODUCTS.filter(p => p.category === 'shoes');
      else if (lowerCat.includes('men') && !lowerCat.includes('women')) sourceList = PRODUCTS.filter(p => p.category === 'men');
      else if (lowerCat.includes('women')) sourceList = PRODUCTS.filter(p => p.category === 'women');
    }

    // Safe access
    if (sourceList.length > 0) {
      productData = sourceList[index % sourceList.length];
    }
  }

  if (!productData) return null;

  const { id, title, image: imageSrc, brand, price } = productData;
  const oldPrice = productData.oldPrice || Math.floor(price * 1.25);
  const storePrice = productData.storePriceFactor
    ? Math.floor(price * productData.storePriceFactor)
    : Math.floor(price * 1.5);

  // Construct for Redux
  const productObj: Product = {
    ...productData,
    oldPrice,
    size: productData.size || 'S',
    condition: productData.condition || 'Çox yaxşı',
    city: productData.city || 'Bakı'
  };

  const isWishlisted = wishlistItems.some((item) => item.id === id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(productObj));
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <div className={cn("group relative flex flex-col gap-2 cursor-pointer w-full", className)}>
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95 z-10",
              isWishlisted && "text-red-500 bg-white"
            )}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </button>
          {(oldPrice && price < oldPrice) && (
            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm z-10">
              -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 p-1">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 relative z-20">
                <span className="font-bold text-lg text-gray-900">{price}.00 ₼</span>

                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <div className="p-0.5 -ml-1 rounded-full hover:bg-gray-100 cursor-help transition-colors">
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-48 p-3" align="start">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-900 border-b pb-1">Qiymət Tarixçəsi</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">10 Yanvar</span>
                          <span className="font-medium text-gray-400 line-through">{Math.floor(price * 1.2)}.00 ₼</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">25 Yanvar</span>
                          <span className="font-medium text-gray-400 line-through">{Math.floor(price * 1.1)}.00 ₼</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">01 Fevral</span>
                          <span className="font-medium text-gray-400 line-through">{price + 2}.00 ₼</span>
                        </div>
                        <div className="flex justify-between items-center text-xs bg-green-50 p-1 rounded">
                          <span className="text-green-700 font-medium">Bu gün</span>
                          <span className="font-bold text-green-700">{price}.00 ₼</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {oldPrice && (
                  <span className="text-xs text-gray-400 line-through">{oldPrice}.00 ₼</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 mt-1 px-2 py-1 bg-indigo-50/50 rounded-md border border-indigo-100/50 w-fit">
                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">Orijinal Qiymət:</span>
                <span className="text-xs font-semibold text-gray-600 decoration-gray-400/50 line-through">
                  {storePrice}.00 ₼
                </span>
              </div>
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
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{productData.size || 'S'} ölçü</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-[10px] text-gray-500">{productData.city || 'Bakı'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
