import { ShieldCheck, Lock, Eye, Bell, Globe, Database } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-zinc-50 border-b border-zinc-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 border border-zinc-200">
            <ShieldCheck className="w-8 h-8 text-zinc-900" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">Məxfilik Siyasəti</h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Sizin məlumatlarınızın təhlükəsizliyi Memix üçün ən vacib öncəlikdir. Verilənlərinizi necə qoruduğumuz haqqında ətraflı məlumat aşağıda qeyd olunub.
          </p>
          <div className="mt-8 text-sm text-zinc-400">Son yenilənmə: 24 Mart 2026</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="space-y-16">
          {/* Section 1 */}
          <section className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-zinc-900 text-white items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900">1. Hansı məlumatları toplayırıq?</h2>
                <p className="text-zinc-500 leading-relaxed">
                  Sizə daha yaxşı xidmət göstərmək üçün aşağıdakı növ məlumatları toplayırıq:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4 mt-6">
                  <li className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <span className="font-bold text-zinc-900 block">Şəxsi Məlumatlar</span>
                    <span className="text-sm text-zinc-500">Ad, soyad, e-poçt ünvanı və telefon nömrəsi.</span>
                  </li>
                  <li className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <span className="font-bold text-zinc-900 block">Çatdırılma Məlumatları</span>
                    <span className="text-sm text-zinc-500">Məhsulların sizə çatdırılması üçün ünvan və GPS koordinatları.</span>
                  </li>
                  <li className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <span className="font-bold text-zinc-900 block">Texniki Məlumatlar</span>
                    <span className="text-sm text-zinc-500">IP ünvanı, brauzer növü və platformadan istifadə statistikası.</span>
                  </li>
                  <li className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                    <span className="font-bold text-zinc-900 block">Əməliyyat Tarixçəsi</span>
                    <span className="text-sm text-zinc-500">Aldığınız məhsullar, sevimli siyahınız və ödəniş statusları.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-zinc-900 text-white items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900">2. Məlumatlarınızdan necə istifadə edirik?</h2>
                <p className="text-zinc-500 leading-relaxed">
                  Topladığımız məlumatlar yalnız aşağıdakı məqsədlər üçün istifadə olunur:
                </p>
                <div className="p-8 rounded-3xl bg-zinc-950 text-white space-y-6">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-bold font-mono">01</div>
                    <p className="text-zinc-300">Sifarişlərinizin rəsmiləşdirilməsi və çatdırılması.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-bold font-mono">02</div>
                    <p className="text-zinc-300">Sizə xüsusi endirimlər və kampaniyalar haqqında bildirişlərin göndərilməsi.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-xs font-bold font-mono">03</div>
                    <p className="text-zinc-300">Platformanın təhlükəsizliyini təmin etmək və fırıldaqçılığın qarşısını almaq.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-zinc-900 text-white items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900">3. Məlumatların qorunması</h2>
                <p className="text-zinc-500 leading-relaxed">
                  Bütün ödəniş əməliyyatları <span className="text-zinc-900 font-semibold italic">SSL (Secure Sockets Layer)</span> şifrələməsi ilə qorunur. Kart məlumatlarınız heç bir halda bizim serverlərimizdə saxlanılmır – onlar birbaşa bankın təhlükəsiz ödəniş şlüzünə ötürülür.
                </p>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-emerald-800 font-medium">Bütün verilənlər bazası AES-256 standartı ilə şifrələnir.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="group">
            <div className="flex items-start gap-6">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-zinc-900 text-white items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-zinc-900">4. Hüquqlarınız</h2>
                <p className="text-zinc-500 leading-relaxed">
                  İstənilən vaxt şəxsi məlumatlarınıza baxmaq, onları düzəltmək və ya tamamilə silmək hüququnuz var. Bunun üçün hesab tənzimləmələrinə keçid edə və ya bizim dəstək komandamızla əlaqə saxlaya bilərsiniz.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="mt-32 p-12 rounded-[2.5rem] bg-zinc-50 border border-zinc-200 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-200 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold text-zinc-900">Sualınız var?</h3>
            <p className="text-zinc-500">Məxfilik siyasəti ilə bağlı hər hansı sualınız yaranarsa, bizə yazmaqdan çəkinməyin.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:privacy@memix.az" className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">
                privacy@memix.az
              </a>
              <a href="/contact" className="px-8 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-xl font-bold hover:bg-zinc-50 transition-colors">
                Əlaqə Formu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
