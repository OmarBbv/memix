import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Mousewheel, FreeMode, Navigation } from 'swiper/modules';
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

interface ImageGalleryProps {
  allImages: string[];
  productName: string;
  isLiked: boolean;
  onToggleWishlist: () => void;
}

export const ImageGallery = ({ allImages, productName, isLiked, onToggleWishlist }: ImageGalleryProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    if (allImages.length > 0) {
      setActiveIndex(0);
      swiperInstance?.slideTo(0);
    }
  }, [allImages[0], swiperInstance]);

  useEffect(() => {
    const updateHeight = () => {
      if (mainImageRef.current) {
        setImageHeight(mainImageRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleThumbnailClick = (idx: number) => {
    setActiveIndex(idx);
    swiperInstance?.slideTo(idx);
  };

  return (
    <div className="lg:col-span-6">
      <div className="flex gap-[2px]">
        {allImages.length > 1 && imageHeight > 0 && (
          <div
            className="hidden lg:block w-[72px] shrink-0 overflow-hidden"
            style={{ height: imageHeight }}
          >
            <Swiper
              direction="vertical"
              slidesPerView="auto"
              spaceBetween={6}
              mousewheel={{
                sensitivity: 1.5,
                releaseOnEdges: false,
                forceToAxis: true,
              }}
              freeMode={true}
              modules={[Mousewheel, FreeMode]}
              style={{ height: '100%', width: '100%' }}
            >
              {allImages.map((img, idx) => (
                <SwiperSlide key={idx} style={{ height: 'auto', marginBottom: '6px' }}>
                  <button
                    onClick={() => handleThumbnailClick(idx)}
                    className={cn(
                      "relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                      activeIndex === idx ? "border-black ring-2 ring-black/10" : "border-gray-100 hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Main Image Swiper */}
        <div
          ref={mainImageRef}
          className="group flex-1 relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
        >
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="w-full h-full"
            navigation={{
              prevEl: '.custom-prev-button',
              nextEl: '.custom-next-button',
            }}
          >
            {allImages.map((img, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full">
                <div className="absolute inset-4 lg:inset-8">
                  <Image
                    src={img}
                    alt={`${productName} - ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-contain"
                    priority={idx === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons (Desktop Only) */}
          <button className="custom-prev-button hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white disabled:opacity-0 disabled:cursor-not-allowed">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button className="custom-next-button hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white disabled:opacity-0 disabled:cursor-not-allowed">
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Top Right Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
            <button
              onClick={onToggleWishlist}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-all hover:bg-white text-gray-700"
            >
              <Heart
                className={cn("w-6 h-6", isLiked ? "fill-red-500 text-red-500" : "text-gray-700")}
              />
            </button>
            <button className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-all hover:bg-white text-gray-700">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Thumbnails (Mobile) */}
      {allImages.length > 1 && (
        <div className="lg:hidden mt-3">
          <div className="flex gap-[2px] overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={cn(
                  "relative w-16 h-16 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                  activeIndex === idx ? "border-black ring-2 ring-black/10" : "border-transparent hover:border-gray-200"
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
