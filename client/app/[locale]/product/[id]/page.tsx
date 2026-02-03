'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import {
  Heart,
  Share2,
  ShieldCheck,
  ChevronRight,
  Star,
  MessageCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { addToCart } from '@/lib/redux/features/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Mock data
  const product = {
    title: "Vintage Oversize Qəhvəyi Dəri Gödəkçə",
    price: 85.00,
    originalPrice: 120.00,
    currency: "₼",
    brand: "Zara",
    condition: "Yeni",
    size: "M / 38",
    description: "Az istifadə olunub, heç bir defekti yoxdur. Oversize modeldir, S-L bədənlərə uyğundur. İçi astarlıdır, payız və qış üçün idealdır. Rəngi tünd şokolad qəhvəyidir.",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80"
    ],
    seller: {
      name: "Aysel M.",
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      lastActive: "10 dəqiqə əvvəl"
    },
    tags: ["Vintage", "Dəri", "Payız", "Qış", "Zara"],
    sizes: ["XS", "S", "M", "L", "XL"]
  };

  const dispatch = useAppDispatch();
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    dispatch(addToCart({
      id: params.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      seller: {
        name: product.seller.name
      }
    }));
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumb
        items={[
          { label: "Qadın", href: "/category/women" },
          { label: "Gödəkçələr", href: "/category/women/jackets" },
          { label: product.title }
        ]}
      />

      <div className="max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
                >
                  <Heart
                    className={cn("w-6 h-6", isLiked ? "fill-red-500 text-red-500" : "text-gray-700")}
                  />
                </button>
                <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 text-gray-700">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all min-w-[60px]",
                    mainImage === img ? "border-black ring-2 ring-black/10" : "border-transparent hover:border-gray-200"
                  )}
                >
                  <Image
                    src={img}
                    alt={`View ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{product.price}.00 {product.currency}</div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 rounded-full text-xs font-semibold text-green-700">
                    {product.condition}
                  </span>
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 overflow-x-auto scrollbar-hide whitespace-nowrap">
                <span>Bakı, Azərbaycan</span>
                <span>•</span>
                <span>2 gün əvvəl yüklənib</span>
                <span>•</span>
                <span>142 baxış</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Ölçü seçin</h3>
                <button className="text-sm underline text-gray-500 hover:text-black">Ölçü cədvəli</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-12 w-16 rounded-xl border-2 font-medium transition-all active:scale-95 flex items-center justify-center",
                      selectedSize === size
                        ? "border-black bg-black text-white shadow-lg shadow-black/20"
                        : "border-gray-200 text-gray-600 hover:border-black/30 hover:bg-gray-50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {/* {!selectedSize && (
                <p className="text-sm text-red-500 mt-1 animate-pulse">
                  Zəhmət olmasa ölçü seçin
                </p>
              )} */}
            </div>

            {/* Seller Info Card */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={product.seller.image}
                      alt={product.seller.name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:underline truncate">{product.seller.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.seller.rating}</span>
                    <span className="text-gray-400">({product.seller.reviews} rəy)</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={cn(
                  "h-12 lg:h-14 text-base lg:text-lg rounded-xl shadow-xl transition-all",
                  selectedSize
                    ? "bg-black hover:bg-gray-800 shadow-black/10"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                )}
              >
                Səbətə əlavə et
              </Button>
              <Button variant="outline" className="h-12 lg:h-14 text-base lg:text-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-gray-700 gap-2">
                <MessageCircle className="w-5 h-5" />
                Söhbət et
              </Button>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Məhsul haqqında</h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Protection Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 text-blue-900">
                <ShieldCheck className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Alıcı müdafiəsi</p>
                  <p className="text-xs text-blue-700/80">Pulunuz bizimlə güvəndədir</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 text-purple-900">
                <RotateCcw className="w-8 h-8 text-purple-600 shrink-0" />
                <div>
                  <p className="font-bold text-sm">2 gün geri qaytarma</p>
                  <p className="text-xs text-purple-700/80">Məhsulu bəyənməsəniz</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-24 mb-12">
          <h2 className="text-2xl font-bold mb-8">Bənzər məhsullar</h2>
          {/* Placeholder for similar products slider/grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
