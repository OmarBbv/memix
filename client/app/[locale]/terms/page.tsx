import { Separator } from "@/components/ui/separator"
import { Shield, FileText, Lock, Scale } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-zinc-500 font-medium tracking-widest text-sm uppercase mb-3 block">Hüquqi Məlumat</span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-6">
            İstifadə Şərtləri
          </h1>
          <p className="text-lg text-zinc-500 leading-relaxed">
            Memix platformasından istifadə qaydaları və tərəflərin öhdəlikləri haqqında ətraflı məlumat.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation - Sticky */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-2">
              <a href="#general" className="block px-4 py-3 text-sm font-medium text-zinc-900 bg-white rounded-xl shadow-sm border border-zinc-200 hover:border-zinc-300 transition-colors">
                1. Ümumi Müddəalar
              </a>
              <a href="#privacy" className="block px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-white/50 rounded-xl transition-colors">
                2. Məxfilik Siyasəti
              </a>
              <a href="#products" className="block px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-white/50 rounded-xl transition-colors">
                3. Məhsul Öhdəlikləri
              </a>
              <a href="#payment" className="block px-4 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-white/50 rounded-xl transition-colors">
                4. Ödəniş və Çatdırılma
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Section 1 */}
            <div id="general" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-zinc-900" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">1. Ümumi Müddəalar</h2>
              </div>
              <div className="prose prose-zinc max-w-none text-zinc-500">
                <p>
                  Memix platformasına xoş gəlmisiniz. Bu saytdan istifadə etməklə siz aşağıdakı şərtləri qəbul etmiş sayılırsınız.
                  Memix, bu şərtləri istənilən vaxt xəbərdarlıq etmədən dəyişdirmək hüququnu özündə saxlayır.
                </p>
                <p>
                  Platformadan istifadə edərkən Azərbaycan Respublikasının qanunvericiliyinə riayət etmək hər bir istifadəçinin borcudur.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="privacy" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-zinc-900" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">2. Məxfilik</h2>
              </div>
              <div className="prose prose-zinc max-w-none text-zinc-500">
                <p>
                  İstifadəçilərin şəxsi məlumatlarının təhlükəsizliyi bizim üçün prioritetdir. Toplanan məlumatlar:
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Ad, soyad və əlaqə vasitələri</li>
                  <li>Çatdırılma ünvanları</li>
                  <li>Sifariş tarixçəsi</li>
                </ul>
                <p className="mt-4">
                  Bu məlumatlar üçüncü tərəflərlə paylaşılmır və yalnız xidmət keyfiyyətinin artırılması üçün istifadə olunur.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div id="products" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-zinc-900" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">3. Məhsulun Vəziyyəti</h2>
              </div>
              <div className="prose prose-zinc max-w-none text-zinc-500">
                <p>
                  Memix-də satılan bütün məhsullar (xüsusilə ikinci əl) mütəxəssislərimiz tərəfindən 3 mərhələli yoxlamadan keçir:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-zinc-50 p-4 rounded-xl">
                    <div className="font-semibold text-zinc-900 mb-1">Orijinallıq</div>
                    <div className="text-sm">Brend məhsulların orijinallığı təsdiqlənir.</div>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-xl">
                    <div className="font-semibold text-zinc-900 mb-1">Gigiyena</div>
                    <div className="text-sm">Bütün geyimlər xüsusi təmizləmədən keçir.</div>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-xl">
                    <div className="font-semibold text-zinc-900 mb-1">Keyfiyyət</div>
                    <div className="text-sm">Cırıq, ləkə və ya digər qüsurlar yoxlanılır.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="payment" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-zinc-900" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">4. Ödəniş və Təhlükəsizlik</h2>
              </div>
              <div className="prose prose-zinc max-w-none text-zinc-500">
                <p>
                  Ödənişlər SSL sertifikatı ilə qorunan təhlükəsiz kanallar vasitəsilə həyata keçirilir.
                  Kart məlumatlarınız tərəfimizdən saxlanılmır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
