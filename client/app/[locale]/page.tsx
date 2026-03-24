'use client';

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/shared/Card";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Zap, ChevronRight, Star, TrendingUp, Heart } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useEffect, useState, useMemo } from "react";
import { useHomeCategories } from "@/hooks/useCategories";
import { useNewArrivals } from "@/hooks/useProducts";
import { Product as ApiProduct } from "@/services/product.service";
import { useBanners } from "@/hooks/useBanners";
import { useBrands } from "@/hooks/useBrands";
import { BannerLocation } from "@/services/banner.service";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
  const { data: categories = [], isLoading } = useHomeCategories();
  const { data: apiProducts = [], isLoading: isProductsLoading } = useNewArrivals(8);

  const products = useMemo(() => {
    if (!apiProducts.length) return Array.from({ length: 8 });

    return apiProducts.map((p: ApiProduct) => ({
      id: p.id,
      title: p.name,
      price: Number(p.price),
      image: p.images?.[0] || p.banner || "",
      brand: p.tags?.[0] || "Brand", // Fallback logic
      category: p.category?.name.toLowerCase() || "women",
      priceHistory: p.priceHistory?.map(h => Number(h.price)) || [],
      discount: p.discount,
      variants: p.variants,
      tags: p.tags
    }));
  }, [apiProducts]);

  const displayCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    
    return [
      { name: "Qadın", slug: "women", imageUrl: "/cat.jpeg", productsCount: "12.5K+" },
      { name: "Kişi", slug: "men", imageUrl: "/cat2.jpeg", productsCount: "8.2K+" },
      { name: "Uşaq", slug: "kids", imageUrl: "/cat3.jpeg", productsCount: "4.1K+" },
      { name: "Çantalar", slug: "bags", imageUrl: "/cat4.jpeg", productsCount: "3.8K+" },
      { name: "Ayaqqabılar", slug: "shoes", imageUrl: "/cat5.jpeg", productsCount: "6.5K+" },
      { name: "Aksesuarlar", slug: "accessories", imageUrl: "/cat6.jpeg", productsCount: "5.3K+" },
    ];
  }, [categories]);

  const { data: banners = [] } = useBanners(BannerLocation.HOME_MAIN_SLIDER);

  const staticHeroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "Yeni Mövsüm",
      subtitle: "2026 Kolleksiyası",
      description: "Ən son trendlərlə qarderobunuzu yeniləyin.",
      buttonText: "Kəşf Et",
      link: "/category",
      secondaryButtonText: "Daha Çox",
      secondaryLink: "/category"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      title: "Qış Stili",
      subtitle: "Premium Seçimlər",
      description: "Soyuq havalarda isti və şıq qalın.",
      buttonText: "Alış-verişə Başla",
      link: "/category",
      secondaryButtonText: "Daha Çox",
      secondaryLink: "/category"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: "Davamlı Moda",
      subtitle: "Eko-Dostu Geyim",
      description: "Gələcəyi düşünərək geyinin.",
      buttonText: "Kolleksiyanı Gör",
      link: "/category",
      secondaryButtonText: "Daha Çox",
      secondaryLink: "/category"
    }
  ];

  const heroSlides = banners.length > 0 ? banners.map(b => ({
    id: b.id,
    image: b.imageUrl,
    title: b.title,
    subtitle: b.tag || "Xüsusi",
    description: b.description,
    buttonText: b.buttonText || "İncələ",
    link: b.link || "/category",
    secondaryButtonText: b.secondaryButtonText || "Daha Çox",
    secondaryLink: b.secondaryLink || "/category"
  })) : staticHeroSlides;

  const { data: apiBrands = [] } = useBrands({ showOnHome: true });

  const staticBrands = [
    "Zara", "H&M", "Mango", "Nike", "Adidas", "Tommy Hilfiger", "Calvin Klein", "Gucci"
  ];

  const brandItems = apiBrands.length > 0 ? apiBrands : staticBrands.map((name, id) => ({ id, name, logoUrl: null }));

  const stats = [
    { number: "500K+", label: "Aktiv Üzv", icon: Heart },
    { number: "1M+", label: "Satılan Məhsul", icon: TrendingUp },
    { number: "4.9", label: "Orta Reytinq", icon: Star },
  ];

  const brands = useMemo(() => {
    if (apiBrands.length > 0) return apiBrands.map(b => b.name);
    return staticBrands;
  }, [apiBrands]);

  return (
    <main className="min-h-screen bg-white text-zinc-950">

      <section className="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] min-h-[450px] sm:min-h-[600px] w-full overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect={'fade'}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !bg-white/50 !opacity-100',
            bulletActiveClass: '!bg-white !w-8 !rounded-full transition-all duration-300',
          }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="max-w-2xl space-y-3 sm:space-y-6">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white/90">{slide.subtitle}</span>
                      </div>

                      {/* Title */}
                      <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                        {slide.title}
                      </h1>

                      {/* Description */}
                      <p className="text-sm sm:text-lg lg:text-xl text-white/80 max-w-lg leading-relaxed">
                        {slide.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <Link href={slide.link || '/category'}>
                          <Button
                            size="lg"
                            className="rounded-full bg-white text-zinc-900 hover:bg-white/90 px-6 sm:px-8 h-11 sm:h-14 text-sm sm:text-base font-semibold shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl"
                          >
                            {slide.buttonText}
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </Button>
                        </Link>
                        {slide.secondaryButtonText && (
                          <Link href={slide.secondaryLink || '/category'}>
                            <Button
                              size="lg"
                              className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-6 sm:px-8 h-11 sm:h-14 text-sm sm:text-base font-semibold transition-all duration-300"
                            >
                              {slide.secondaryButtonText}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Stats Card */}
        <div className="absolute bottom-8 right-8 hidden lg:block z-20">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
            <div className="flex gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-white drop-shadow-lg">{stat.number}</p>
                  <p className="text-xs text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Links (Mobile-first horizontal scroll) */}
      <section className="py-4 px-4 lg:hidden">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {displayCategories.map((cat: any, idx: number) => (
            <Link
              key={cat.id || idx}
              href={`/category/${cat.slug}`}
              className="shrink-0 px-4 py-2.5 rounded-full bg-zinc-100 text-sm font-medium text-zinc-700 hover:bg-black hover:text-white transition-colors active:scale-95"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-4 sm:py-6 border-y border-zinc-100 bg-zinc-50/50 overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          {[...brandItems, ...brandItems, ...brandItems].map((brand, idx) => (
            <div key={idx} className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer opacity-60 hover:opacity-100">
              {brand.logoUrl ? (
                <div className="relative w-24 h-12">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-lg font-semibold text-zinc-400 hover:text-zinc-700">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="space-y-2 sm:space-y-3">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-500">
                <span className="w-6 sm:w-8 h-px bg-zinc-300"></span>
                Kəşf Et
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight">Kateqoriyalar</h2>
              <p className="text-zinc-500 text-sm sm:text-lg max-w-md">İstədiyiniz kateqoriyanı seçin və minlərlə unikal məhsul arasından seçim edin.</p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="rounded-full px-6 h-12 text-sm font-medium border-zinc-200 hover:bg-zinc-50 group">
                Hamısını Gör
                <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-3/4 animate-pulse rounded-2xl bg-zinc-100" />
              ))
            ) : (
              displayCategories.map((cat: any, idx) => (
                <Link
                  key={cat.id || idx}
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-100"
                >
                  <Image
                    src={
                      cat.imageUrl
                        ? (cat.imageUrl.startsWith('http')
                          ? cat.imageUrl
                          : cat.imageUrl.startsWith('/uploads')
                            ? `http://localhost:4444${cat.imageUrl}`
                            : cat.imageUrl)
                        : "/placeholder-cat.jpg"
                    }
                    alt={cat.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-5">
                    <h3 className="text-white font-bold text-lg lg:text-xl mb-1 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      {cat.name}
                    </h3>
                    <span className="text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {cat.productsCount || 0} {typeof cat.productsCount === 'number' ? 'məhsul' : ''}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-6 sm:py-4 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <div className="absolute inset-0 opacity-30">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop"
                alt="Featured Banner"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-16 items-center min-h-[400px]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white/90">Xüsusi Təklif</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Payız Sərinliyi
                </h2>
                <p className="text-lg text-white/70 max-w-md leading-relaxed">
                  Yeni gələn gödəkçə və sviterlərimizlə həm üslubunuzu qoruyun, həm də isti qalın.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-zinc-900 hover:bg-white/90 px-8 h-14 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    Kolleksiyanı İncələ
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-white mb-2">50%</p>
                  <p className="text-white/60 text-sm">Seçilmiş məhsullarda endirim</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-white mb-2">24h</p>
                  <p className="text-white/60 text-sm">Sürətli çatdırılma</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-white mb-2">2K+</p>
                  <p className="text-white/60 text-sm">Yeni məhsul</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-white mb-2">100%</p>
                  <p className="text-white/60 text-sm">Orijinallıq zəmanəti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-10 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 lg:px-8">
            <div className="space-y-2 sm:space-y-3">
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-500">
                <span className="w-6 sm:w-8 h-px bg-zinc-300"></span>
                Vitrinimizdə
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight">Yeni Gələnlər</h2>
              <p className="text-zinc-500 text-sm sm:text-lg max-w-md">Hər gün yenilənən vitrinimizdən ən son parçaları seçin.</p>
            </div>
            <Link href="/search">
              <Button variant="outline" className="rounded-full px-6 h-12 text-sm font-medium border-zinc-200 hover:bg-zinc-50 group">
                Hamısına Bax
                <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="px-0">
            <Swiper
              slidesPerView={1.3}
              spaceBetween={16}
              navigation={{
                nextEl: '.products-next',
                prevEl: '.products-prev',
              }}
              modules={[Navigation]}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 16 },
                640: { slidesPerView: 2.5, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="w-full pb-4 px-4! md:px-0!"
            >
              {products.map((product: any, i: number) => (
                <SwiperSlide key={product?.id || i} className="h-auto">
                  <Card index={i} className="h-full" product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-3 mt-8 px-4 lg:px-8">
            <button className="products-prev w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 hover:border-zinc-300 transition-all disabled:opacity-30">
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
            <button className="products-next w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 hover:border-zinc-300 transition-all disabled:opacity-30">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-20 lg:py-28 bg-zinc-50/80">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">
              <span className="w-8 h-px bg-zinc-300"></span>
              Niyə Biz
              <span className="w-8 h-px bg-zinc-300"></span>
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">Memix Üstünlükləri</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Azərbaycanda ən etibarlı ikinci əl moda platforması ilə alış-veriş təcrübənizi yüksəldin.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-zinc-100 hover:shadow-lg hover:border-zinc-200 transition-all duration-500">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">24 Saatda Çatdırılma</h3>
              <p className="text-zinc-500 leading-relaxed">
                Şəhər daxili sürətli kuryer xidmətimizlə istədiyiniz məhsul qapınızda.
              </p>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-zinc-100 hover:shadow-lg hover:border-zinc-200 transition-all duration-500">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Orijinallıq Zəmanəti</h3>
              <p className="text-zinc-500 leading-relaxed">
                Bütün məhsullarımız ekspertlərimiz tərəfindən diqqətlə yoxlanılır.
              </p>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-zinc-100 hover:shadow-lg hover:border-zinc-200 transition-all duration-500">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-sky-100 to-sky-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Leaf className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ekoloji Təsir</h3>
              <p className="text-zinc-500 leading-relaxed">
                İkinci əl geyim alaraq su israfının qarşısını alın və təbiəti qoruyun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-8 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-linear-to-br from-white to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                Modern Geyim Seçimləri
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto">
                Memix-də keyfiyyətli və orijinal brend geyimlərini münasib qiymətlərlə əldə edin. Hər məhsul diqqətlə seçilir və yoxlanılır.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/category">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-zinc-900 hover:bg-white/90 px-10 h-14 text-base font-semibold shadow-lg transition-all duration-300"
                  >
                    Alış-verişə Başla
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-10 h-14 text-base font-semibold transition-all duration-300"
                  >
                    Haqqımızda
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
