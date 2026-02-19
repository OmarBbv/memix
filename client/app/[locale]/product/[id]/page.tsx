'use client';

import React, { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { ImageGallery } from './components/ImageGallery';
import { ContentState } from '@/components/shared/ContentState';

import {
  ShieldCheck,
  Star,
  MessageCircle,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { addToCart } from '@/lib/redux/features/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useProduct } from '@/hooks/useProducts';
import { baseUrl } from '@/lib/httpClient';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const isLiked = isInWishlist(Number(id));

  if (isLoading || isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ContentState
          isLoading={isLoading}
          isError={isError || !product}
          errorMessage="Məhsul tapılmadı"
        >
          <></>
        </ContentState>
      </div>
    );
  }

  const basePrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const discount = product.discount;
  let currentPrice = basePrice;
  let originalPrice = basePrice;
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
  }

  const getImageUrl = (img: string) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${baseUrl}${img}`;
  };

  const allImages: string[] = [];
  if (product.banner) allImages.push(getImageUrl(product.banner));
  if (product.images) {
    product.images.forEach(img => {
      const url = getImageUrl(img);
      if (!allImages.includes(url)) allImages.push(url);
    });
  }
  if (allImages.length === 0) {
    allImages.push('https://via.placeholder.com/800x800?text=No+Image');
  }
  const baseImages = [...allImages];
  while (allImages.length < 8 && baseImages.length > 0) {
    for (const img of baseImages) {
      if (allImages.length >= 8) break;
      allImages.push(img);
    }
  }

  const sizes = product.variants?.size || ['S', 'M', 'L', 'XL'];
  const brand = product.variants?.brand || product.brand || '';
  const condition = product.variants?.condition || product.condition || 'Yeni';
  const color = product.variants?.color || '';
  const categoryName = product.category?.name || '';
  const categorySlug = product.category?.slug || '';
  const productName = product.name || product.title || '';
  const tags = product.tags || [categoryName, brand].filter(Boolean);

  const handleAddToCart = () => {
    if (!selectedSize) return;

    dispatch(addToCart({
      id: id,
      title: productName,
      price: currentPrice,
      image: allImages[0],
      size: selectedSize,
      seller: {
        name: brand || 'Satıcı'
      }
    }));
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Bu gün yüklənib';
    if (diffDays === 1) return '1 gün əvvəl yüklənib';
    return `${diffDays} gün əvvəl yüklənib`;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumb
        items={[
          { label: categoryName, href: `/category/${categorySlug}` },
          { label: productName }
        ]}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <ImageGallery
            allImages={allImages}
            productName={productName}
            isLiked={isLiked}
            onToggleWishlist={() => toggleWishlist(Number(id))}
          />

          {/* Right Column - Product Info */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-3xl font-bold text-gray-900">{currentPrice.toFixed(2)} ₼</div>
                  {discountPercentage > 0 && (
                    <>
                      <div className="text-xl text-gray-400 line-through">{originalPrice.toFixed(2)} ₼</div>
                      <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg leading-none">
                        -{discountPercentage}%
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 rounded-full text-xs font-semibold text-green-700">
                    {condition}
                  </span>
                  {color && (
                    <span className="px-3 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-600">
                      {color}
                    </span>
                  )}
                  {brand && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-xs font-semibold text-blue-700">
                      {brand}
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {productName}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 overflow-x-auto scrollbar-hide whitespace-nowrap">
                <span>Bakı, Azərbaycan</span>
                <span>•</span>
                <span>{product.createdAt ? getTimeAgo(product.createdAt) : ''}</span>
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
                {sizes.map((size) => (
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
            </div>

            {/* Stock Info */}
            {product.stocks && product.stocks.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-sm">Stok məlumatı</h3>
                <div className="flex flex-wrap gap-2">
                  {product.stocks.map((s) => (
                    <span
                      key={s.id}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        s.stock > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      )}
                    >
                      {s.branch.name}: {s.stock > 0 ? `${s.stock} ədəd` : 'Bitib'}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                {product.description || 'Bu unikal parça qarderobunuzun əvəzolunmaz hissəsi olacaq. Həm gündəlik, həm də özəl günlər üçün uyğundur.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price History */}
            {product.priceHistory && product.priceHistory.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900">Qiymət tarixçəsi</h3>
                <div className="space-y-2">
                  {product.priceHistory.map((ph) => (
                    <div key={ph.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                      <span className="text-gray-500">
                        {new Date(ph.changedAt).toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        {ph.oldPrice && (
                          <span className="text-gray-400 line-through">{parseFloat(String(ph.oldPrice)).toFixed(2)} ₼</span>
                        )}
                        {ph.newPrice && (
                          <span className="text-gray-900 font-semibold">{parseFloat(String(ph.newPrice)).toFixed(2)} ₼</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-3/4 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
