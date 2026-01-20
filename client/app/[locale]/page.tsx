'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/shared/Card";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Zap, ChevronRight, Star, TrendingUp, Heart } from "lucide-react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
  const newArrivals = Array.from({ length: 8 });

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "Yeni Mövsüm",
      subtitle: "2026 Kolleksiyası",
      description: "Ən son trendlərlə qarderobunuzu yeniləyin.",
      buttonText: "Kəşf Et"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
      title: "Qış Stili",
      subtitle: "Premium Seçimlər",
      description: "Soyuq havalarda isti və şıq qalın.",
      buttonText: "Alış-verişə Başla"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: "Davamlı Moda",
      subtitle: "Eko-Dostu Geyim",
      description: "Gələcəyi düşünərək geyinin.",
      buttonText: "Kolleksiyanı Gör"
    }
  ];

  const categories = [
    { name: "Qadın", image: "https://images.unsplash.com/photo-1525845859779-54d477ff291f?auto=format&fit=crop&q=80&w=800", count: "12.5K+" },
    { name: "Kişi", image: "https://images.unsplash.com/photo-1617137968427-85924c809a10?auto=format&fit=crop&q=80&w=800", count: "8.2K+" },
    { name: "Uşaq", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800", count: "4.1K+" },
    { name: "Çantalar", image: "https://images.unsplash.com/photo-1590874102752-ce22d84f5fa1?auto=format&fit=crop&q=80&w=800", count: "3.8K+" },
    { name: "Ayaqqabılar", image: "https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&q=80&w=800", count: "6.5K+" },
    { name: "Aksesuarlar", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800", count: "5.3K+" },
  ];

  const stats = [
    { number: "500K+", label: "Aktiv Üzv", icon: Heart },
    { number: "1M+", label: "Satılan Məhsul", icon: TrendingUp },
    { number: "4.9", label: "Orta Reytinq", icon: Star },
  ];

  const brands = [
    "Zara", "H&M", "Mango", "Nike", "Adidas", "Tommy Hilfiger", "Calvin Klein", "Gucci"
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-950">

      {/* Hero Section - Full Width Elegant */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl space-y-6">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-white/90">{slide.subtitle}</span>
                      </div>

                      {/* Title */}
                      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                        {slide.title}
                      </h1>

                      {/* Description */}
                      <p className="text-lg sm:text-xl text-white/80 max-w-lg leading-relaxed">
                        {slide.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Button
                          size="lg"
                          className="rounded-full bg-white text-zinc-900 hover:bg-white/90 px-8 h-14 text-base font-semibold shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                        >
                          {slide.buttonText}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                          size="lg"
                          className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-8 h-14 text-base font-semibold transition-all duration-300"
                        >
                          Daha Çox
                        </Button>
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

      {/* Brands Marquee */}
      <section className="py-6 border-y border-zinc-100 bg-zinc-50/50 overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          {[...brands, ...brands, ...brands].map((brand, idx) => (
            <span key={idx} className="mx-8 text-lg font-semibold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                <span className="w-8 h-px bg-zinc-300"></span>
                Kəşf Et
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Kateqoriyalar</h2>
              <p className="text-zinc-500 text-lg max-w-md">İstədiyiniz kateqoriyanı seçin və minlərlə unikal məhsul arasından seçim edin.</p>
            </div>
            <Link href="/categories">
              <Button variant="outline" className="rounded-full px-6 h-12 text-sm font-medium border-zinc-200 hover:bg-zinc-50 group">
                Hamısını Gör
                <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`/search?category=${cat.name}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-5">
                  <h3 className="text-white font-bold text-lg lg:text-xl mb-1 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  <span className="text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {cat.count} məhsul
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-4 lg:py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <div className="absolute inset-0 opacity-30">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop"
                alt="Featured Banner"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl" />

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
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                <span className="w-8 h-px bg-zinc-300"></span>
                Vitrinimizdə
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Yeni Gələnlər</h2>
              <p className="text-zinc-500 text-lg max-w-md">Hər gün yenilənən vitrinimizdən ən son parçaları seçin.</p>
            </div>
            <Link href="/search">
              <Button variant="outline" className="rounded-full px-6 h-12 text-sm font-medium border-zinc-200 hover:bg-zinc-50 group">
                Hamısına Bax
                <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Products Grid with Swiper */}
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
            className="w-full pb-4"
          >
            {newArrivals.map((_, i) => (
              <SwiperSlide key={i} className="h-auto">
                <Card index={i} className="h-full" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-3 mt-8">
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
      <section className="py-20 lg:py-28 bg-zinc-50/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">24 Saatda Çatdırılma</h3>
              <p className="text-zinc-500 leading-relaxed">
                Şəhər daxili sürətli kuryer xidmətimizlə istədiyiniz məhsul qapınızda.
              </p>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-zinc-100 hover:shadow-lg hover:border-zinc-200 transition-all duration-500">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Orijinallıq Zəmanəti</h3>
              <p className="text-zinc-500 leading-relaxed">
                Bütün məhsullarımız ekspertlərimiz tərəfindən diqqətlə yoxlanılır.
              </p>
            </div>

            <div className="group relative bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-zinc-100 hover:shadow-lg hover:border-zinc-200 transition-all duration-500">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
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
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-950 p-8 lg:p-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                Modern Geyim Seçimləri
              </h2>
              <p className="text-lg text-white/70 max-w-xl mx-auto">
                Memix-də keyfiyyətli və orijinal brend geyimlərini münasib qiymətlərlə əldə edin. Hər məhsul diqqətlə seçilir və yoxlanılır.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-zinc-900 hover:bg-white/90 px-10 h-14 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Alış-verişə Başla
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 px-10 h-14 text-base font-semibold transition-all duration-300"
                >
                  Haqqımızda
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
