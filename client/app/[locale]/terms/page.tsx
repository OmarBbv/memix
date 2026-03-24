'use client';

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Shield, FileText, Lock, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const navItems = [
    { id: "general", label: "1. Ümumi Müddəalar", icon: FileText },
    { id: "privacy", label: "2. Məxfilik Siyasəti", icon: Lock },
    { id: "products", label: "3. Məhsul Öhdəlikləri", icon: Shield },
    { id: "payment", label: "4. Ödəniş və Çatdırılma", icon: Scale },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
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
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl border mb-2",
                    activeSection === item.id
                      ? "text-zinc-900 bg-white shadow-sm border-zinc-200 scale-[1.02]"
                      : "text-zinc-500 border-transparent hover:text-zinc-900 hover:bg-white/50"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Section 1 */}
            <div id="general" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100 min-h-[400px]">
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
            <div id="privacy" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100 min-h-[400px]">
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
            <div id="products" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100 min-h-[400px]">
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
            <div id="payment" className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-100 min-h-[400px]">
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
