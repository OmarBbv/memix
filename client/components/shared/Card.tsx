'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Heart, Info } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleWishlist } from '@/lib/redux/features/wishlistSlice';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';


interface CardProps {
  className?: string;
  index?: number;
  category?: string;
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
  storePriceFactor?: number;
}

export const Card = ({ className, index = 0, category }: CardProps) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const WOMEN_PRODUCTS = [
    {
      title: 'Qara rəngli ziyafət donu',
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      price: 25,
      brand: 'Zara',
      storePriceFactor: 1.5
    },
    {
      title: 'Oversize pambıq köynək',
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&auto=format&fit=crop&q=80",
      price: 45,
      brand: 'H&M',
      storePriceFactor: 1.8
    },
    {
      title: 'Klassik bej rəngli trençkot',
      image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=800&auto=format&fit=crop&q=80",
      price: 120,
      brand: 'Mango',
      storePriceFactor: 2.5
    },
    {
      title: 'Yüksək belli cins şalvar',
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
      price: 35,
      brand: 'Stradivarius',
      storePriceFactor: 1.6
    },
    {
      title: 'Qışlıq Yün Palto',
      image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&auto=format&fit=crop&q=80",
      price: 85,
      brand: 'Massimo Dutti',
      storePriceFactor: 2.2
    }
  ];

  const MEN_PRODUCTS = [
    {
      title: 'Klassik Kostyum',
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
      price: 150,
      brand: 'Zara Man',
      storePriceFactor: 1.8
    },
    {
      title: 'Cin Gödəkçə',
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
      price: 60,
      brand: 'Pull&Bear',
      storePriceFactor: 1.5
    },
    {
      title: 'Klassik Köynək',
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      price: 30,
      brand: 'H&M',
      storePriceFactor: 1.4
    },
    {
      title: 'Bej Şalvar',
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
      price: 40,
      brand: 'Bershka',
      storePriceFactor: 1.6
    }
  ];

  const KIDS_PRODUCTS = [
    {
      title: 'Körpə üçün bodi',
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80",
      price: 12,
      brand: 'Zara Kids',
      storePriceFactor: 1.5
    },
    {
      title: 'Zolaqlı Tişört',
      image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=80",
      price: 15,
      brand: 'H&M Kids',
      storePriceFactor: 1.3
    },
    {
      title: 'Çiçəkli yay donu',
      image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80",
      price: 35,
      brand: 'Mango Kids',
      storePriceFactor: 1.7
    },
    {
      title: 'Qışlıq Gödəkçə',
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop&q=80",
      price: 45,
      brand: 'Gap',
      storePriceFactor: 1.9
    },
    {
      title: 'Qırmızı Yağmurluq',
      image: "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=800&auto=format&fit=crop&q=80",
      price: 50,
      brand: 'Next',
      storePriceFactor: 1.6
    },
    {
      title: 'Pambıq Pijama Dəsti',
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80",
      price: 20,
      brand: 'Carter\'s',
      storePriceFactor: 1.4
    },
    {
      title: 'Uşaq Kedləri',
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      price: 40,
      brand: 'Converse',
      storePriceFactor: 1.8
    },
    {
      title: 'Rəngli Papaq',
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80",
      price: 10,
      brand: 'Benetton',
      storePriceFactor: 2.0
    }
  ];

  const BAGS_PRODUCTS = [
    {
      title: 'Dəri Əl Çantası',
      image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=80",
      price: 55,
      brand: 'Zara',
      storePriceFactor: 1.6
    },
    {
      title: 'Məxmər Çanta',
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
      price: 40,
      brand: 'Parfois',
      storePriceFactor: 1.4
    },
    {
      title: "Sarı Sırt Çantası",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      price: 35,
      brand: "Kanken",
      storePriceFactor: 2.0
    }
  ];

  const SHOES_PRODUCTS = [
    {
      title: 'Qəhvəyi Klassik Ayaqqabı',
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
      price: 65,
      brand: 'Massimo Dutti',
      storePriceFactor: 2.1
    },
    {
      title: 'Dəri Çəkmə',
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
      price: 90,
      brand: 'Dr. Martens',
      storePriceFactor: 1.8
    },
    {
      title: "Qırmızı İdman Ayaqqabısı",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
      price: 80,
      brand: "Nike",
      storePriceFactor: 1.7
    }
  ];

  const ACCESSORIES_PRODUCTS = [
    {
      title: 'Günəş Eynəyi',
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      price: 30,
      brand: 'RayBan',
      storePriceFactor: 2.5
    },
    {
      title: 'Gümüş Qol Saatı',
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop&q=80",
      price: 120,
      brand: 'Casio',
      storePriceFactor: 1.3
    },
    {
      title: "Zərif Boyunbağı",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80",
      price: 25,
      brand: "Pandora",
      storePriceFactor: 2.0
    }
  ];

  // Kategoriye göre liste seçimi
  let selectedProducts = WOMEN_PRODUCTS; // Default

  if (category) {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('men') && !lowerCat.includes('women')) {
      selectedProducts = MEN_PRODUCTS;
    } else if (lowerCat.includes('kid') || lowerCat.includes('child') || lowerCat.includes('baby')) {
      selectedProducts = KIDS_PRODUCTS;
    } else if (lowerCat.includes('bag')) {
      selectedProducts = BAGS_PRODUCTS;
    } else if (lowerCat.includes('shoe') || lowerCat.includes('foot')) {
      selectedProducts = SHOES_PRODUCTS;
    } else if (lowerCat.includes('accessory') || lowerCat.includes('watch') || lowerCat.includes('jewelry')) {
      selectedProducts = ACCESSORIES_PRODUCTS;
    }
  }

  const productData = selectedProducts[index % selectedProducts.length];

  const price = productData.price;
  const oldPrice = Math.floor(price * 1.25);
  const storePrice = Math.floor(price * productData.storePriceFactor);

  const product: Product = {
    id: index + 1,
    title: productData.title,
    price,
    oldPrice,
    image: productData.image,
    brand: productData.brand,
    size: 'S',
    condition: 'Çox yaxşı',
    city: 'Bakı'
  };

  const { title, image: imageSrc, brand } = product;

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <Link href={`/product/${index + 1}`} className="block">
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
          {index % 3 === 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm z-10">
              -33%
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
                          <span className="font-medium text-gray-600">{Math.floor(price * 1.1)}.00 ₼</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">01 Fevral</span>
                          <span className="font-medium text-gray-800">{price + 2}.00 ₼</span>
                        </div>
                        <div className="flex justify-between items-center text-xs bg-green-50 p-1 rounded">
                          <span className="text-green-700 font-medium">Bu gün</span>
                          <span className="font-bold text-green-700">{price}.00 ₼</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {index % 3 === 0 && (
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
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">S ölçü</span>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <span className="text-[10px] text-gray-500">Bakı</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
