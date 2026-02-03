import { Truck, RotateCcw, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DeliveryReturnPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* Header Banner */}
      <div className="bg-zinc-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-800 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Çatdırılma və Qaytarma</h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Sürətli çatdırılma xidmətimiz və rahat qaytarma siyasətimizlə alış-veriş təcrübənizi asanlaşdırırıq.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {/* Delivery Section */}
        <div className="mb-24">
          <div className="flex items-end gap-4 mb-10">
            <h2 className="text-3xl font-bold">Çatdırılma Seçimləri</h2>
            <div className="flex-1 h-px bg-zinc-200 mb-3"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Standard Delivery Card */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 hover:border-black transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-zinc-100 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                  <Truck className="w-8 h-8" />
                </div>
                <span className="bg-zinc-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pulsuz*</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Standard Çatdırılma</h3>
              <p className="text-zinc-500 mb-6">Bütün Azərbaycan üzrə kuryer və poçt vasitəsilə çatdırılma.</p>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  2-3 iş günü ərzində
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  Bölgələrə çatdırılma mövcuddur
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  50 AZN üzəri sifarişlərdə pulsuz
                </li>
              </ul>
            </div>

            {/* Express Delivery Card */}
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-200 hover:border-black transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                  <Truck className="w-8 h-8" />
                </div>
                <span className="bg-zinc-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">5 AZN</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Sürətli Çatdırılma</h3>
              <p className="text-zinc-500 mb-6">Bakı şəhəri daxilində eyni gün çatdırılma xidməti.</p>

              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  24 saat ərzində
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  Yalnız Bakı şəhəri
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-zinc-600">
                  <AlertCircle className="w-4 h-4" />
                  Saat 14:00-a qədər verilən sifarişlər
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Returns Section */}
        <div>
          <div className="flex items-end gap-4 mb-10">
            <h2 className="text-3xl font-bold">Qaytarma Siyasəti</h2>
            <div className="flex-1 h-px bg-zinc-200 mb-3"></div>
          </div>

          <div className="bg-zinc-900 text-white rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h3 className="text-3xl font-bold mb-6">Bəyənmədiniz? Problem yoxdur.</h3>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  Məhsulu təhvil aldığınız tarixdən etibarən <span className="text-white font-semibold">14 gün</span> ərzində heç bir səbəb göstərmədən geri qaytara bilərsiniz.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Məhsulu hazırlayın</h4>
                      <p className="text-zinc-400 text-sm mt-1">Məhsulun etiketi üzərində olmalı və istifadə edilməməlidir.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Kuryeri çağırın</h4>
                      <p className="text-zinc-400 text-sm mt-1">Hesabınızdan qaytarma tələbi yaradın.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Ödənişinizi geri alın</h4>
                      <p className="text-zinc-400 text-sm mt-1">Məhsul yoxlanıldıqdan sonra 3-5 iş günü ərzində.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <RotateCcw className="w-8 h-8 text-zinc-400" />
                  <h4 className="text-xl font-bold">Vacib Şərtlər</h4>
                </div>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    Məhsulun orijinal qablaşdırması zədələnməməlidir.
                  </li>
                  <li className="flex gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    Bütün aksesuarlar tam olmalıdır.
                  </li>
                  <li className="flex gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    Qəbz və ya hesab-faktura təqdim edilməlidir.
                  </li>
                </ul>
                <Button className="w-full mt-8 bg-white text-black hover:bg-zinc-200">
                  Qaytarma Tələbi Yarat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
