'use client';

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
          alt="Memix About"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Haqqımızda</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            Biz sadəcə geyim satmırıq, biz stilin və davamlılığın hekayəsini yazırıq.
            Memix - Sizin premium ikinci əl moda tərəfdaşınız.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Biz Kimik?</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">
                Memix, keyfiyyətli və orijinal brend geyimləri əlçatan qiymətlərlə təklif edən Azərbaycandakı ilk premium ikinci əl platformasıdır. Biz, modanın sadəcə geyinmək deyil, həm də gələcəyi düşünmək olduğuna inanırıq.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Vizyonumuz</h3>
                <p className="text-zinc-600">
                  Davamlı moda anlayışını cəmiyyətimizdə formalaşdırmaq və hər kəs üçün lüksü əlçatan etmək.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Missiyamız</h3>
                <p className="text-zinc-600">
                  Geyimlərin ömrünü uzadaraq təbiəti qorumaq və müştərilərimizə unikal üslub təcrübəsi yaşatmaq.
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80"
              alt="Fashion Mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-amber-500">500K+</p>
              <p className="text-white/70">Aktiv İstifadəçi</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-emerald-500">1M+</p>
              <p className="text-white/70">Satılan Məhsul</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-blue-500">24/7</p>
              <p className="text-white/70">Müştəri Dəstəyi</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-purple-500">%100</p>
              <p className="text-white/70">Orijinallıq Zəmanəti</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
