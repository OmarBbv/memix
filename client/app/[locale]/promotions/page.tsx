'use client';

import { Card } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Timer, Copy, Tag, ArrowRight, Zap, AlertCircle } from "lucide-react";
import Image from "next/image";
import { usePromotions } from "@/hooks/usePromotions";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromotionsPage() {
  const { data, isLoading, isError } = usePromotions();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 pb-20 pt-24 px-4 max-w-7xl mx-auto space-y-12">
        <Skeleton className="w-full h-80 rounded-3xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="w-full h-40 rounded-3xl" />
          <Skeleton className="w-full h-40 rounded-3xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-3/4 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Xəta baş verdi</h2>
          <p className="text-zinc-500">Məlumatları yükləyərkən problem yaşandı.</p>
        </div>
      </div>
    );
  }

  const heroCampaign = data.campaigns && data.campaigns.length > 0 ? data.campaigns[0] : null;
  const secondaryCampaigns = data.campaigns && data.campaigns.length > 1 ? data.campaigns.slice(1) : [];

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="relative bg-black text-white px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroCampaign?.imageUrl || "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2115&auto=format&fit=crop"}
            alt={heroCampaign?.title || "Sale Background"}
            fill
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {heroCampaign?.badgeText && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white font-bold text-xs uppercase tracking-widest border mb-6"
              style={{
                backgroundColor: heroCampaign.badgeColor ? `${heroCampaign.badgeColor}33` : 'rgba(244, 63, 94, 0.2)',
                color: heroCampaign.badgeColor || '#fda4af',
                borderColor: heroCampaign.badgeColor ? `${heroCampaign.badgeColor}4D` : 'rgba(244, 63, 94, 0.3)',
              }}
            >
              <Zap className="w-3 h-3" strokeWidth={3} />
              {heroCampaign.badgeText}
            </div>
          )}
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[0.9]">
            {heroCampaign?.title ? (
              <>{heroCampaign.title}</>
            ) : (
              <>Qış <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-amber-500">Endirimləri</span></>
            )}
          </h1>
          <p className="text-xl text-zinc-300 max-w-xl mb-10 leading-relaxed">
            {heroCampaign?.description || "Seçilmiş brendlərdə 70%-ə qədər endirimlər başladı. Qış kolleksiyasını yeniləmək üçün indi tam zamanıdır."}
          </p>
          <div className="flex flex-wrap gap-4">
            {heroCampaign?.link && (
              <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-semibold" asChild>
                <a href={heroCampaign.link}>Kampaniyaya qoşul</a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">

        {secondaryCampaigns.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {secondaryCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-6 rounded-3xl shadow-xl flex flex-col justify-between text-white overflow-hidden relative"
                style={{
                  backgroundColor: campaign.backgroundColor || '#18181b',
                  minHeight: '200px'
                }}
              >
                {campaign.imageUrl && (
                  <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                    <img src={campaign.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-br from-black/80 to-transparent z-0" />

                <div className="relative z-10 flex flex-col gap-2">
                  {campaign.badgeText && (
                    <span
                      className="inline-flex w-fit items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md"
                      style={{
                        color: campaign.badgeColor || '#fbbf24',
                        backgroundColor: campaign.badgeColor ? `${campaign.badgeColor}1A` : 'rgba(251, 191, 36, 0.1)'
                      }}
                    >
                      <Zap className="w-3 h-3" />
                      {campaign.badgeText}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{campaign.title}</h3>
                  <p className="text-zinc-300 text-sm max-w-sm">{campaign.description}</p>
                </div>

                {campaign.link && (
                  <Button variant="outline" className="relative z-10 w-fit mt-4 rounded-full border-white/20 hover:bg-white/10 text-black hover:text-white" asChild>
                    <a href={campaign.link}>Ətraflı <ArrowRight className="ml-2 w-4 h-4" /></a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {data.coupons && data.coupons.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Aktiv Promo Kodlar
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.coupons.map((coupon, index) => {
                const colors = index % 2 === 0 ? 'bg-rose-500 text-rose-500 bg-rose-50' : 'bg-indigo-500 text-indigo-500 bg-indigo-50';

                return (
                  <div key={coupon.id} className="bg-white p-2 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 items-center overflow-hidden">
                    <div className={index % 2 === 0 ? "bg-rose-500 w-full md:w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden group" : "bg-indigo-500 w-full md:w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden group"}>
                      <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-4xl sm:text-5xl font-black">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}₼`}
                      </span>
                      <span className="text-xs sm:text-sm font-medium uppercase tracking-wider text-center px-1">Endirim</span>
                    </div>

                    <div className="flex-1 px-4 md:px-0 pb-4 md:pb-0 w-full">
                      <div className="flex justify-between items-start outline-hidden mb-2">
                        <h3 className="text-lg font-bold line-clamp-1">{coupon.type === 'percentage' ? 'Faiz endirimi' : 'Sabit məbləğ endirimi'}</h3>
                        {coupon.expiresAt && (
                          <div className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md ${index % 2 === 0 ? 'text-rose-500 bg-rose-50' : 'text-indigo-500 bg-indigo-50'}`}>
                            <Timer className="w-3 h-3" />
                            {new Intl.DateTimeFormat('az-AZ', { day: '2-digit', month: 'short' }).format(new Date(coupon.expiresAt))} qədər
                          </div>
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
                        {coupon.minOrderAmount ? `Minimum ${coupon.minOrderAmount}₼ sifarişlərdə keçərlidir.` : "Bütün sifarişlərdə keçərlidir."}
                      </p>

                      <div className="flex items-center gap-2 p-2 bg-zinc-100 rounded-xl border border-zinc-200 border-dashed">
                        <div className="flex-1 font-mono font-bold text-center text-zinc-700 tracking-widest text-lg">
                          {coupon.code}
                        </div>
                        <Button size="icon" variant="ghost" className="rounded-lg hover:bg-white hover:shadow-sm" onClick={() => handleCopy(coupon.code)}>
                          <Copy className="w-4 h-4 text-zinc-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {data.discountedProducts && data.discountedProducts.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-rose-500" />
              Günün Təklifləri
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {data.discountedProducts.map((item, i) => {
                const productWithDiscount = {
                  ...item.product,
                  discount: item.discount
                };

                return (
                  <Card key={item.product.id || i} index={i} product={productWithDiscount as any} className="bg-white" />
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Button variant="outline" size="lg" className="rounded-full px-10 h-14 border-zinc-300 hover:bg-white text-base">
                Bütün endirimləri göstər
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
