'use client';

import React, { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/shared/Card';
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
import { addToCartAsync } from '@/lib/redux/features/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { baseUrl } from '@/lib/httpClient';
import { useWishlist } from '@/hooks/useWishlist';
import { getSizesForCategory, getSizeLabel } from '@/constants/sizes';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { data: similarProducts, isLoading: isSimilarLoading } = useSimilarProducts(Number(id));
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
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

  const categorySizeType = (product.category as any)?.sizeType || null;
  const categorySizes = getSizesForCategory(categorySizeType);
  const sizes: string[] = categorySizes
    ? categorySizes.map(s => s.value)
    : (product.variants?.size || ['S', 'M', 'L', 'XL']);
  const sizeTypeTitle = categorySizes ? categorySizeType : null;

  // Stoklardakı mövcud rəngləri çıxarırıq
  const availableColors: string[] = product.stocks && product.stocks.length > 0
    ? [...new Set(product.stocks.filter((s: any) => s.color).map((s: any) => s.color))]
    : (product.variants?.color ? (Array.isArray(product.variants.color) ? product.variants.color : [product.variants.color]) : []);

  const brand = product.variants?.brand || product.brand || '';
  const condition = product.variants?.condition || product.condition || 'Yeni';
  const categoryName = product.category?.name || '';
  const categorySlug = product.category?.slug || '';
  const productName = product.name || product.title || '';
  const tags = product.tags || [categoryName, brand].filter(Boolean);

  const totalStock = product.stocks?.reduce((acc: number, s: any) => acc + s.stock, 0) || 0;
  const isOutOfStock = product.stocks && product.stocks.length > 0 ? totalStock <= 0 : false;

  // Per-color+size stock hesablanması (Trendyol modeli)
  const getSizeStock = (size: string): number => {
    if (!product.stocks || product.stocks.length === 0) return 999;

    // 1. Rəng + Ölçü üzrə stok
    if (selectedColor) {
      const colorSizeStocks = product.stocks.filter((s: any) => s.color === selectedColor && s.size === size);
      if (colorSizeStocks.length > 0) {
        return colorSizeStocks.reduce((acc: number, s: any) => acc + s.stock, 0);
      }
    }

    // 2. Yalnız ölçü üzrə stok
    const sizeStocks = product.stocks.filter((s: any) => s.size === size && !s.color);
    if (sizeStocks.length > 0) {
      return sizeStocks.reduce((acc: number, s: any) => acc + s.stock, 0);
    }
    return totalStock;
  };

  // Rəng üzrə ümumi stok
  const getColorStock = (color: string): number => {
    if (!product.stocks || product.stocks.length === 0) return 999;
    const colorStocks = product.stocks.filter((s: any) => s.color === color);
    return colorStocks.reduce((acc: number, s: any) => acc + s.stock, 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    dispatch(addToCartAsync({
      id: id,
      title: productName,
      price: currentPrice,
      image: allImages[0],
      size: selectedSize,
      color: selectedColor || undefined,
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

          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8">
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
                  {selectedColor && (
                    <span className="px-3 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-600">
                      {selectedColor}
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

            {/* Rəng Seçimi — Trendyol modeli */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">
                    Rəng seçin
                    {selectedColor && (
                      <span className="ml-2 text-sm font-normal text-gray-500">— {selectedColor}</span>
                    )}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((colorName) => {
                    const colorStock = getColorStock(colorName);
                    const isColorOut = colorStock <= 0;
                    const isColorSelected = selectedColor === colorName;

                    return (
                      <button
                        key={colorName}
                        onClick={() => {
                          if (!isColorOut) {
                            setSelectedColor(isColorSelected ? '' : colorName);
                            setSelectedSize('');
                          }
                        }}
                        disabled={isColorOut}
                        className={cn(
                          "h-12 px-5 rounded-xl border-2 font-medium transition-all flex items-center justify-center relative",
                          isColorOut
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                            : isColorSelected
                              ? "border-black bg-black text-white shadow-lg shadow-black/20 active:scale-95"
                              : "border-gray-200 text-gray-600 hover:border-black/30 hover:bg-gray-50 active:scale-95"
                        )}
                      >
                        {colorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <hr className="border-gray-100" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">
                  {sizeTypeTitle === 'ayaqqabi' ? 'Nömrə seçin' :
                    sizeTypeTitle === 'uzuk' ? 'Üzük ölçüsü seçin' :
                      sizeTypeTitle === 'yas-grupu' ? 'Yaş qrupu seçin' :
                        sizeTypeTitle === 'beden-numeric' ? 'Bədən nömrəsi seçin' :
                          'Ölçü seçin'}
                </h3>
                <button className="text-sm underline text-gray-500 hover:text-black">Ölçü cədvəli</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size: string) => {
                  const sizeStock = getSizeStock(size);
                  const isSizeOut = sizeStock <= 0;
                  const isLowStock = sizeStock > 0 && sizeStock <= 3;

                  return (
                    <div key={size} className="relative">
                      <button
                        onClick={() => !isSizeOut && setSelectedSize(size)}
                        disabled={isSizeOut}
                        className={cn(
                          "h-12 min-w-16 px-3 rounded-xl border-2 font-medium transition-all flex items-center justify-center relative",
                          isSizeOut
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                            : selectedSize === size
                              ? "border-black bg-black text-white shadow-lg shadow-black/20 active:scale-95"
                              : "border-gray-200 text-gray-600 hover:border-black/30 hover:bg-gray-50 active:scale-95"
                        )}
                      >
                        {getSizeLabel(categorySizeType, size)}
                      </button>
                      {isSizeOut && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                          Bitib
                        </span>
                      )}
                      {isLowStock && (
                        <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                          {sizeStock}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <Button
                disabled={isOutOfStock || !selectedSize || (!!selectedSize && getSizeStock(selectedSize) <= 0)}
                onClick={handleAddToCart}
                className={cn(
                  "h-12 lg:h-14 text-base lg:text-lg rounded-xl transition-all",
                  isOutOfStock || (selectedSize && getSizeStock(selectedSize) <= 0)
                    ? "bg-red-50 text-red-500 font-bold border border-red-200 cursor-not-allowed shadow-none hover:bg-red-50"
                    : selectedSize
                      ? "bg-black hover:bg-gray-800 shadow-xl shadow-black/10"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                )}
              >
                {isOutOfStock ? "İndi məhsul bitib" : (selectedSize && getSizeStock(selectedSize) <= 0) ? "Bu ölçü bitib" : "Səbətə əlavə et"}
              </Button>
              <Button variant="outline" className="h-12 lg:h-14 text-base lg:text-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-gray-700 gap-2">
                <MessageCircle className="w-5 h-5" />
                Söhbət et
              </Button>
            </div>

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

        <div className="mt-24 mb-12 px-4 md:px-0">
          <h2 className="text-2xl font-bold mb-8">Sizə həmçinin maraqlı ola bilər</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isSimilarLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-3/4 bg-gray-100 rounded-xl animate-pulse"></div>
              ))
            ) : (
              similarProducts?.map((p: any) => (
                <Card 
                  key={p.id} 
                  product={{
                    ...p,
                    title: p.name,
                    image: p.banner || p.images?.[0] || "",
                    price: Number(p.price)
                  }} 
                />
              ))
            )}
            {!isSimilarLoading && (!similarProducts || similarProducts.length === 0) && (
              <p className="col-span-full text-gray-500 text-center py-10 italic">
                Bənzər məhsul tapılmadı.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
