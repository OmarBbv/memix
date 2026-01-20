'use client';

import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { Box, CreditCard, Heart, LogOut, MapPin, Settings, User } from 'lucide-react';

export function ProfileSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Hesabım",
      items: [
        { name: "İstifadəçi Məlumatları", href: "/profile", icon: User },
        { name: "Sifarişlərim", href: "/profile/orders", icon: Box },
        { name: "Qeydli Kartlarım", href: "/profile/payments", icon: CreditCard },
        { name: "Ünvanlarım", href: "/profile/addresses", icon: MapPin },
        { name: "İstək Siyahısı", href: "/profile/wishlist", icon: Heart },
      ]
    }
  ];

  return (
    <div className="w-full md:w-64 space-y-6">
      {/* User Summary Widget */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
          <User className="w-6 h-6 text-zinc-500" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-zinc-500 font-medium truncate">Xoş gəldin,</p>
          <p className="text-sm font-bold text-zinc-900 truncate">Nadir Həbibov</p>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <div className="p-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm mb-1",
                      isActive
                        ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="p-2 border-t border-zinc-100 mt-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm">
            <LogOut className="w-4 h-4" />
            Çıxış Et
          </button>
        </div>
      </div>
    </div>
  );
}
