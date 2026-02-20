import { Card } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { Timer, Copy, Tag, ArrowRight, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-black text-white px-4 py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2115&auto=format&fit=crop"
            alt="Sale Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-widest border border-rose-500/30 mb-6">
            <Zap className="w-3 h-3" strokeWidth={3} />
            Mövsümün Ən Böyük Endirimi
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-[0.9]">
            Qış <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-amber-500">Endirimləri</span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-xl mb-10 leading-relaxed">
            Seçilmiş brendlərdə 70%-ə qədər endirimlər başladı. Qış kolleksiyasını yeniləmək üçün indi tam zamanıdır.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-semibold">
              Kampaniyaya qoşul
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-black hover:bg-white/10 hover:text-white/50 text-lg font-medium backdrop-blur-sm">
              Kataloqu yüklə
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        {/* Active Promo Codes */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {/* Promo Card 1 */}
          <div className="bg-white p-2 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 items-center overflow-hidden">
            <div className="bg-rose-500 w-full md:w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-5xl font-black">50%</span>
              <span className="text-sm font-medium uppercase tracking-wider">Endirim</span>
            </div>
            <div className="flex-1 px-4 md:px-0 pb-4 md:pb-0 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">Xüsusi Hədiyyə Kuponu</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                  <Timer className="w-3 h-3" />
                  2 gün qaldı
                </div>
              </div>
              <p className="text-zinc-500 text-sm mb-4">Yeni istifadəçilər üçün ilk alış-verişdə keçərli endirim kodu.</p>

              <div className="flex items-center gap-2 p-2 bg-zinc-100 rounded-xl border border-zinc-200 border-dashed">
                <div className="flex-1 font-mono font-bold text-center text-zinc-700 tracking-widest text-lg">
                  MEMIXNEW50
                </div>
                <Button size="icon" variant="ghost" className="rounded-lg hover:bg-white hover:shadow-sm">
                  <Copy className="w-4 h-4 text-zinc-500" />
                </Button>
              </div>
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="bg-zinc-900 p-2 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 items-center overflow-hidden text-white">
            <div className="bg-amber-400 w-full md:w-40 h-40 rounded-2xl flex flex-col items-center justify-center text-black shrink-0 relative overflow-hidden group">
              <span className="text-5xl font-black">3+1</span>
              <span className="text-sm font-bold uppercase tracking-wider">Hədiyyə</span>
            </div>
            <div className="flex-1 px-4 md:px-0 pb-4 md:pb-0 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">3 Al 1 Hədiyyə</h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">
                  <Sparkles className="w-3 h-3" />
                  VIP
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">İstənilən kateqoriyadan 3 məhsul alın, ən ucuzu hədiyyə olsun.</p>

              <div className="flex items-center gap-2 p-2 bg-white/10 rounded-xl border border-white/10 border-dashed">
                <div className="flex-1 font-mono font-bold text-center text-amber-400 tracking-widest text-lg">
                  FREEGIFT
                </div>
                <Button size="icon" variant="ghost" className="rounded-lg hover:bg-white/10 text-white">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Tabs */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
          <Button variant="default" className="rounded-full bg-black hover:bg-zinc-800">Hamısı</Button>
          <Button variant="secondary" className="rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 shadow-sm">Qadın Geyimləri</Button>
          <Button variant="secondary" className="rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 shadow-sm">Kişi Geyimləri</Button>
          <Button variant="secondary" className="rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 shadow-sm">Elektronika</Button>
        </div>

        {/* Deals Grid */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5 text-rose-500" />
          Günün Təklifləri
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} index={i} className="bg-white" />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="rounded-full px-10 h-14 border-zinc-300 hover:bg-white text-base">
            Daha çox göstər
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
