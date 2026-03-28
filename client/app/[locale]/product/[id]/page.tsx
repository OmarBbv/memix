'use client';

import { useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/shared/Card';
import { ImageGallery } from './components/ImageGallery';
import { ContentState } from '@/components/shared/ContentState';
import {
  ShieldCheck,
  RotateCcw,
  Star,
  Truck,
  MapPin,
  Heart
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

  if (isLoading || isError || !product || !product.colorVariants) {
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

  // Available Colors
  const availableColors = product.colorVariants.map((cv: any) => cv.color) || [];
  
  // Selected Variant
  const selectedVariant = product.colorVariants.find((cv: any) => cv.color === selectedColor) || product.colorVariants[0];

  // Gallery Images
  const allImages: string[] = [];
  if (product.banner) allImages.push(getImageUrl(product.banner));
  const variantImages = selectedVariant?.images?.map((img: string) => getImageUrl(img)) || [];
  const displayImages = variantImages.length > 0 ? variantImages : allImages;
  if (displayImages.length === 0) displayImages.push('https://via.placeholder.com/800x800?text=No+Image');

  const categorySizeType = (product.category as any)?.sizeType || null;
  const sizes = selectedVariant?.stocks?.filter((s: any) => s.size).map((s: any) => s.size) || [];

  const brandValue = product.brand || '';
  const brand = (brandValue && typeof brandValue === 'object') ? (brandValue as any).name : brandValue;
  const productName = product.name || '';
  const tags = product.tags || [];

  const totalStock = product.colorVariants.reduce((acc: number, cv: any) => 
    acc + (cv.stocks?.reduce((sAcc: number, s: any) => sAcc + s.stock, 0) || 0)
  , 0);
  const isOutOfStock = totalStock <= 0;

  const getSizeStock = (size: string): number => {
    if (!selectedVariant) return 0;
    const stockItem = selectedVariant.stocks?.find((s: any) => s.size === size);
    return stockItem ? stockItem.stock : 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    dispatch(addToCartAsync({
      id: id,
      title: productName,
      price: currentPrice,
      image: displayImages[0],
      size: selectedSize,
      color: selectedColor || selectedVariant?.color,
      seller: { name: brand || 'Satıcı' }
    }));
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Breadcrumb
        items={[
          { label: product.category?.name || 'Kataloq', href: `/category/${product.category?.slug}` },
          { label: productName }
        ]}
      />

      <div className="max-w-7xl mx-auto py-8 px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <ImageGallery
            allImages={displayImages}
            productName={productName}
            isLiked={isLiked}
            onToggleWishlist={() => toggleWishlist(Number(id))}
          />

          <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {brand && <span className="text-brand-500 mr-2 uppercase">{brand}</span>}
                  {productName}
                </h1>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Stokda: {totalStock} ədəd</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">
                    {currentPrice.toFixed(2)} <span className="text-2xl font-medium ml-0.5">₼</span>
                  </span>
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-gray-400 line-through font-medium">
                        {originalPrice.toFixed(2)} ₼
                      </span>
                      <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase">
                        -{discountPercentage}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="h-px bg-zinc-100" />

            {/* Seçimlər Bölməsi */}
            <div className="space-y-8 py-8 border-y border-gray-100">
              {/* Rəng Seçimi */}
              {availableColors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase">
                      Rəng: <span className="text-gray-900 ml-2">{selectedColor || selectedVariant?.color || 'Seçin'}</span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colorVariants.map((cv: any) => {
                      const variantStock = cv.stocks?.reduce((acc: number, s: any) => acc + s.stock, 0) || 0;
                      const isOut = variantStock <= 0;
                      const isSelected = (selectedColor || selectedVariant?.color) === cv.color;
                      const thumb = cv.images?.[0];

                      return (
                        <button
                          key={cv.color}
                          onClick={() => {
                            if (!isOut) {
                              setSelectedColor(cv.color);
                              setSelectedSize('');
                            }
                          }}
                          disabled={isOut}
                          className={cn(
                            "group relative w-16 h-20 rounded-xl border-2 transition-all duration-300",
                            isSelected 
                              ? "border-brand-500 shadow-xl shadow-brand-500/10 scale-105" 
                              : "border-gray-100 hover:border-gray-300 hover:scale-102"
                          )}
                        >
                          {thumb ? (
                            <img src={getImageUrl(thumb)} className="w-full h-full object-cover rounded-lg" alt={cv.color} />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[9px] text-gray-500 px-1 text-center font-black uppercase">
                              {cv.color}
                            </div>
                          )}
                          {isOut && (
                            <div className="absolute inset-0 bg-white/40 flex items-center justify-center backdrop-blur-[1px]">
                              <div className="w-full h-0.5 bg-red-400/50 -rotate-45" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ölçü Seçimi */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase">
                    Ölçü: <span className="text-gray-900 ml-2">{selectedSize ? getSizeLabel(categorySizeType, selectedSize) : 'Seçin'}</span>
                  </h3>
                  <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                    Ölçü Cədvəli
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {sizes.map((size: string) => {
                    const sizeStock = getSizeStock(size);
                    const isSizeOut = sizeStock <= 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        onClick={() => !isSizeOut && setSelectedSize(size)}
                        disabled={isSizeOut}
                        className={cn(
                          "min-w-[64px] h-12 flex items-center justify-center rounded-xl border-2 text-xs font-black transition-all duration-300",
                          isSizeOut
                            ? "border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                            : isSelected
                              ? "border-brand-500 text-brand-500 bg-brand-50/30 shadow-lg shadow-brand-500/5 scale-105"
                              : "border-gray-100 text-gray-700 hover:border-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {getSizeLabel(categorySizeType, size)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                disabled={isOutOfStock || !selectedSize || (!!selectedSize && getSizeStock(selectedSize) <= 0)}
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-16 text-md font-black rounded-2xl transition-all shadow-2xl shadow-brand-500/10 uppercase tracking-widest",
                  isOutOfStock 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gray-900 hover:bg-black text-white active:scale-95"
                )}
              >
                {isOutOfStock ? "Tükəndi" : "Səbətə Əlavə Et"}
              </Button>
              <button
                onClick={() => toggleWishlist(Number(id))}
                className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-2xl border-2 transition-all duration-300",
                  isLiked 
                    ? "border-red-500 bg-red-50 text-red-500 shadow-lg shadow-red-500/5 rotate-12" 
                    : "border-gray-100 hover:border-gray-900 text-gray-400"
                )}
              >
                <Heart className={cn("w-7 h-7 transition-transform", isLiked && "fill-current animate-pulse")} />
              </button>
            </div>

            <div className="space-y-6 pt-10">
              <div className="space-y-4">
                <h3 className="text-[11px] font-black tracking-[0.2em] text-gray-400 uppercase">Məhsul Təsviri</h3>
                <p className="text-gray-600 leading-relaxed text-sm antialiased whitespace-pre-line font-medium">
                  {product.description || 'Təsvir daxil edilməyib.'}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {tags.map((tag: string, idx: number) => (
                    <span key={`${tag}-${idx}`} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black text-gray-400 hover:text-brand-500 cursor-pointer transition-all hover:-translate-y-0.5 uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="group flex items-center gap-4 p-5 rounded-3xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] text-gray-900 uppercase tracking-widest leading-none">Zəmanət</h4>
                    <p className="text-[10px] text-gray-500 mt-1.5 font-medium">100% Orijinal və keyfiyyətli məhsul</p>
                  </div>
                </div>
                <div className="group flex items-center gap-4 p-5 rounded-3xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-[11px] text-gray-900 uppercase tracking-widest leading-none">Dəyişmə</h4>
                    <p className="text-[10px] text-gray-500 mt-1.5 font-medium">14 gün ərzində asan geri qaytarma</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-24 mb-12 px-4 md:px-0">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tighter">Bənzər Məhsullar</h2>
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
                    image: p.banner || p.colorVariants?.[0]?.images?.[0] || "",
                    price: Number(p.price)
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
