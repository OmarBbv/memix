'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/shared/Card';
import { ImageGallery } from './components/ImageGallery';
import { ContentState } from '@/components/shared/ContentState';
import {
  ShieldCheck,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { addToCartAsync } from '@/lib/redux/features/cartSlice';
import { useAppDispatch } from '@/lib/redux/hooks';
import { useProduct, useSimilarProducts } from '@/hooks/useProducts';
import { baseUrl } from '@/lib/httpClient';
import { useWishlist } from '@/hooks/useWishlist';
import { getSizeLabel } from '@/constants/sizes';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const { data: product, isLoading, isError } = useProduct(Number(id));
  const { data: similarProducts, isLoading: isSimilarLoading } = useSimilarProducts(Number(id), 8);
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
    const normalizedPath = img.startsWith('/') ? img : `/${img}`;
    return `${baseUrl}${normalizedPath}`;
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
  const sizeTypeTitle = categorySizeType;

  const availableSizes: string[] = product.stocks && product.stocks.length > 0
    ? [...new Set(product.stocks.filter((s: any) => s.size).map((s: any) => s.size))]
    : (product.variants?.size ? (Array.isArray(product.variants.size) ? product.variants.size : [product.variants.size]) : ['S', 'M', 'L', 'XL']);

  const sizes = availableSizes;

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

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                {brand && (
                  <span className="text-zinc-400 font-bold text-xs tracking-wider uppercase">
                    {brand}
                  </span>
                )}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {productName}
                </h1>
              </div>

              <div className="flex items-center gap-4 text-[13px] text-gray-500">
                <span className="flex items-center gap-1">Bakı, Azərbaycan</span>
                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                <span>{product.createdAt ? getTimeAgo(product.createdAt) : ''}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-baseline gap-3">
                <div className="text-3xl font-black text-gray-900 tracking-tight">{currentPrice.toFixed(2)} ₼</div>
                {discountPercentage > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through decoration-gray-300">{originalPrice.toFixed(2)} ₼</span>
                    <span className="px-2 py-1 bg-red-500 text-white text-[11px] font-bold rounded-lg">
                      -{discountPercentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Rəng Seçimi — Trendyol Modeli */}
            {availableColors.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-900">
                    Rəng
                    {selectedColor && (
                      <span className="ml-2 font-medium text-gray-500">: {selectedColor}</span>
                    )}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
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
                          "min-w-[70px] h-11 px-4 rounded-lg border text-[13px] font-semibold transition-all duration-200",
                          isColorOut
                            ? "border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through"
                            : isColorSelected
                              ? "border-black bg-black text-white shadow-lg shadow-black/10"
                              : "border-zinc-200 text-zinc-600 hover:border-black hover:bg-zinc-50"
                        )}
                      >
                        {colorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ölçü Seçimi */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900">
                  {sizeTypeTitle === 'ayaqqabi' ? 'Nömrə' :
                    sizeTypeTitle === 'uzuk' ? 'Üzük ölçüsü' :
                      sizeTypeTitle === 'yas-grupu' ? 'Yaş qrupu' :
                        sizeTypeTitle === 'beden-numeric' ? 'Bədən nömrəsi' :
                          'Ölçü'}
                  {selectedSize && (
                    <span className="ml-2 font-medium text-gray-500">: {getSizeLabel(categorySizeType, selectedSize)}</span>
                  )}
                </h3>
                <button className="text-[13px] font-medium text-zinc-400 hover:text-zinc-600 flex items-center gap-1">
                  Ölçü cədvəli
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size: string) => {
                  const sizeStock = getSizeStock(size);
                  const isSizeOut = sizeStock <= 0;
                  const isSelected = selectedSize === size;

                  return (
                    <div key={size} className="relative">
                      <button
                        onClick={() => !isSizeOut && setSelectedSize(size)}
                        disabled={isSizeOut}
                        className={cn(
                          "min-w-[60px] h-11 px-3 rounded-lg border text-[13px] font-semibold transition-all duration-200",
                          isSizeOut
                            ? "border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through"
                            : isSelected
                              ? "border-black bg-black text-white shadow-lg shadow-black/10"
                              : "border-zinc-200 text-zinc-600 hover:border-black hover:bg-zinc-50"
                        )}
                      >
                        {getSizeLabel(categorySizeType, size)}
                      </button>
                      {isSizeOut && (
                        <span className="absolute -top-2 -right-1 bg-zinc-400 text-white text-[8px] font-black px-1 rounded-sm uppercase">
                          Bitib
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                disabled={isOutOfStock || !selectedSize || (!!selectedSize && getSizeStock(selectedSize) <= 0)}
                onClick={handleAddToCart}
                className={cn(
                  "h-14 text-base font-bold rounded-xl transition-all duration-300",
                  isOutOfStock || (selectedSize && getSizeStock(selectedSize) <= 0)
                    ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                    : selectedSize
                      ? "bg-black hover:bg-zinc-800 text-white shadow-xl shadow-black/10 active:scale-[0.98]"
                      : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                )}
              >
                {isOutOfStock ? "Məhsul Bitib" : "Səbətə əlavə et"}
              </Button>
              <Button variant="outline" className="h-14 text-base border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl text-zinc-700 font-bold gap-2 active:scale-[0.98] transition-all">
                <MessageCircle className="w-5 h-5 text-zinc-400" />
                Söhbət et
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[13px] font-bold text-zinc-600">Stok Məlumatı</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.stocks?.map((s) => (
                  <span
                    key={s.id}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors",
                      s.stock > 0
                        ? "bg-zinc-50 text-zinc-600 border-zinc-100"
                        : "bg-red-50 text-red-500 border-red-100 opacity-60"
                    )}
                  >
                    {s.branch.name}: {s.stock > 0 ? `${s.stock} ədəd` : 'Bitib'}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 py-6 border-t border-zinc-100 mt-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Məhsul Təsviri</h3>
              <p className="text-gray-500 leading-relaxed text-sm antialiased">
                {product.description || 'Bu unikal parça qarderobunuzun əvəzolunmaz hissəsi olacaq. Həm gündəlik, həm də özəl günlər üçün uyğundur.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="text-[11px] font-bold text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                <ShieldCheck className="w-8 h-8 text-zinc-400" />
                <div>
                  <p className="font-bold text-xs text-zinc-900">Alıcı Müdafiəsi</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Pulunuz bizimlə güvəndədir</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-zinc-100">
                <RotateCcw className="w-8 h-8 text-zinc-400" />
                <div>
                  <p className="font-bold text-xs text-zinc-900">Geri Qaytarma</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">2 gün ərzində asan geri qaytarma</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 mb-12 px-4 md:px-0">
          <h2 className="text-2xl font-bold mb-8">Sizə həmçinin maraqlı ola bilər</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {isSimilarLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
