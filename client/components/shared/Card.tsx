'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Heart, Info } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { toggleWishlist } from '@/lib/redux/features/wishlistSlice';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Product } from '@/services/product.service';
import { useWishlist } from '@/hooks/useWishlist';

interface CardProps {
  className?: string;
  index?: number;
  category?: string;
  product?: Product;
}

export const Card = ({ className, index = 0, category, product: propProduct }: CardProps) => {
  /* const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items); */
  const { isInWishlist, toggleWishlist } = useWishlist();
  const productData = propProduct;

  if (!productData) return null;

  const { id, discount, priceHistory } = productData;
  const title = productData.title || productData.name || '';
  const imageSrc = productData.image || productData.banner || '';
  const brandValue = productData.variants?.brand || productData.brand || '';
  const brand = (brandValue && typeof brandValue === 'object') ? (brandValue as any).name : brandValue;

  const basePrice = typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price;

  let currentPrice = basePrice;
  let originalPrice = productData.oldPrice || basePrice;
  let discountPercentage = 0;

  if (discount && discount.isActive) {
    originalPrice = basePrice;
    if (discount.type === 'percentage') {
      currentPrice = basePrice * (1 - discount.value / 100);
      discountPercentage = Math.round(discount.value);
    } else {
      currentPrice = basePrice - discount.value;
      discountPercentage = Math.round((discount.value / basePrice) * 100);
    }
  } else if (originalPrice > basePrice) {
    discountPercentage = Math.round(((originalPrice - basePrice) / originalPrice) * 100);
  }

  const storePrice = productData.storePriceFactor
    ? Math.floor(originalPrice * productData.storePriceFactor)
    : 0;

  const rawSize = productData.variants?.size || productData.size;
  const size = Array.isArray(rawSize) ? rawSize.join(', ') : rawSize;
  const city = productData.variants?.city || productData.city;
  const condition = productData.variants?.condition || productData.condition || 'Çox yaxşı';

  const productObj: Product = {
    ...productData,
    oldPrice: originalPrice,
    size,
    condition,
    city
  };

  const isWishlisted = isInWishlist(id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const numericHistory: number[] = [];
  if (priceHistory && priceHistory.length > 0) {
    priceHistory.forEach((ph) => {
      const val = ph.price ?? ph.newPrice ?? ph.oldPrice;
      if (val != null) numericHistory.push(typeof val === 'string' ? parseFloat(val) : val);
    });
  }

  return (
    <div className={cn("group relative flex flex-col gap-2 w-full", className)}>
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-gray-100">
        <Link href={`/product/${id}`} className="block h-full w-full">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              quality={85}
              fill
              unoptimized
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
              No Image
            </div>
          )}
        </Link>
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-md transition-all hover:bg-white z-30",
            isWishlisted && "text-red-500 bg-white"
          )}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm z-10">
            -{discountPercentage}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-1">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1.5 relative z-20">
              <span className="font-bold text-base sm:text-lg text-gray-900 whitespace-nowrap">{currentPrice.toFixed(2)} ₼</span>
              <div className="flex items-center gap-1.5">
                <HoverCard openDelay={0} closeDelay={0}>
                  <HoverCardTrigger asChild>
                    <div className="p-0.5 rounded-full hover:bg-gray-100 cursor-help transition-colors">
                      <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-48 p-3" align="start">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-900 border-b pb-1">Qiymət Tarixçəsi</h4>
                      <div className="space-y-1">
                        {(() => {
                          let historyList = numericHistory.length > 0 ? [...numericHistory] : [];

                          if (historyList.length === 0 && originalPrice > currentPrice) {
                            historyList = [originalPrice];
                          }

                          if (historyList.length === 0 || Math.abs(historyList[historyList.length - 1] - currentPrice) > 0.01) {
                            historyList.push(currentPrice);
                          }

                          return historyList.map((price, idx) => {
                            const isLast = idx === historyList.length - 1;
                            const isFirst = idx === 0;

                            return (
                              <div
                                key={idx}
                                className={cn(
                                  "flex justify-between items-center text-xs p-1 rounded",
                                  isLast ? "bg-green-50" : ""
                                )}
                              >
                                <span className={isLast ? "text-green-700 font-medium" : "text-gray-500 font-medium"}>
                                  {isLast ? "Bu gün" : (isFirst ? "Başlanğıc" : `${idx}. Dəyişim`)}
                                </span>
                                <span className={isLast ? "font-bold text-green-700" : "text-gray-400 line-through"}>
                                  {price.toFixed(2)} ₼
                                </span>
                              </div>
                            );
                          });
                        })()}

                        {storePrice > 0 && (
                          <div className="flex justify-between items-center text-xs text-indigo-500 px-1 pt-1 border-t border-dashed border-gray-100 mt-1">
                            <span className="font-medium">Mağaza</span>
                            <span className="line-through opacity-70">{storePrice.toFixed(2)} ₼</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {originalPrice > currentPrice && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through whitespace-nowrap">{originalPrice.toFixed(2)} ₼</span>
                )}
              </div>
            </div>

            {storePrice > 0 && (
              <div className="flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-indigo-50/50 rounded border border-indigo-100/50 w-fit">
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium whitespace-nowrap">Orijinal:</span>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-600 decoration-gray-400/50 line-through whitespace-nowrap">
                  {storePrice.toFixed(2)} ₼
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start sm:items-end shrink-0">

            <span className="text-[9px] sm:text-[10px] text-gray-500">{condition}</span>
          </div>
        </div>

        <Link href={`/product/${id}`} className="block">
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-1 font-medium group-hover:text-black transition-colors">
            {brand && <span className="font-bold text-black mr-1">{brand}</span>}
            {title}
          </p>
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          {size && (
            <>
              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{size} ölçü</span>
              {city && <div className="w-1 h-1 bg-gray-300 rounded-full"></div>}
            </>
          )}
          {city && <span className="text-[9px] sm:text-[10px] text-gray-500">{city}</span>}
        </div>
      </div>
    </div>
  );
};
