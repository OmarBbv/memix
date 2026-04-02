'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { Category } from '@/types/category.types';
import { ChevronRight, ChevronDown, Menu, User, Baby, Home, ShoppingCart, Sparkles, Briefcase, Monitor, Dumbbell, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DesktopCategoryNavProps {
  categories: Category[];
  show: boolean;
}

const getCategoryIcon = (name: string) => {
  if (!name) return <Shirt className="w-[18px] h-[18px]" />;
  const lowerName = name.toLowerCase();
  if (lowerName.includes('qadın') || lowerName.includes('kadin') || lowerName.includes('qadin')) return <User className="w-[18px] h-[18px]" />;
  if (lowerName.includes('kişi') || lowerName.includes('erkek') || lowerName.includes('kisi')) return <User className="w-[18px] h-[18px]" />;
  if (lowerName.includes('uşaq') || lowerName.includes('usaq') || lowerName.includes('çocuk')) return <Baby className="w-[18px] h-[18px]" />;
  if (lowerName.includes('ev') || lowerName.includes('mebel') || lowerName.includes('yaşayış')) return <Home className="w-[18px] h-[18px]" />;
  if (lowerName.includes('supermarket') || lowerName.includes('market')) return <ShoppingCart className="w-[18px] h-[18px]" />;
  if (lowerName.includes('kosmetika') || lowerName.includes('kozmetik')) return <Sparkles className="w-[18px] h-[18px]" />;
  if (lowerName.includes('ayaqqabı') || lowerName.includes('çanta') || lowerName.includes('canta')) return <Briefcase className="w-[18px] h-[18px]" />;
  if (lowerName.includes('elektronika') || lowerName.includes('elektronik')) return <Monitor className="w-[18px] h-[18px]" />;
  if (lowerName.includes('idman') || lowerName.includes('spor') || lowerName.includes('çöl')) return <Dumbbell className="w-[18px] h-[18px]" />;
  return <Shirt className="w-[18px] h-[18px]" />;
};

export function DesktopCategoryNav({ categories, show }: DesktopCategoryNavProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeSidebarCat, setActiveSidebarCat] = useState<number | null>(null);
  const menuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!megaMenuOpen) return;

    const handleClickOutside: EventListener = (event: Event) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMegaMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [megaMenuOpen]);

  if (!categories || categories.length === 0) return null;

  const activeSidebarCatObj = activeSidebarCat
    ? categories.find(c => c.id === activeSidebarCat)
    : categories[0];

  return (
    <div
      className={cn(
        "hidden md:block w-full bg-white transition-all duration-300 ease-in-out relative",
        show ? "h-[45px] opacity-100 border-b border-gray-100" : "h-0 opacity-0 overflow-hidden"
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-start relative">
        <ul className="flex items-center space-x-6 h-full w-full">
          <li
            ref={menuRef}
            className="h-full flex items-center group/megatrigger pr-6 border-r border-gray-100"
          >
            <div
              className="flex items-center cursor-pointer h-full select-none"
              onClick={(e) => {
                e.stopPropagation();
                const newState = !megaMenuOpen;
                setMegaMenuOpen(newState);
                if (newState && !activeSidebarCat && categories.length > 0) {
                  setActiveSidebarCat(categories[0].id);
                }
              }}
            >
              <Menu className={cn("w-5 h-5 mr-2 transition-colors", megaMenuOpen ? "text-black" : "text-gray-800 group-hover/megatrigger:text-black")} />
              <span className={cn("font-medium text-[14px] tracking-wide uppercase transition-colors", megaMenuOpen ? "text-black" : "text-gray-800 group-hover/megatrigger:text-black")}>
                Kategoriyalar
              </span>
              <span className="ml-2 bg-[#d02424] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">Yeni</span>
            </div>

            {megaMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-90 bg-black/40"
                  style={{ top: '118px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMegaMenuOpen(false);
                  }}
                />
                <div
                  className="absolute left-0 right-0 top-[45px] bg-white shadow-2xl border border-gray-100 z-100 flex rounded-b-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
                  style={{ minHeight: '400px', maxHeight: '600px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-[260px] bg-[#fafafa] flex flex-col py-3 overflow-y-auto border-r border-gray-100" style={{ scrollbarWidth: 'none' }}>
                    {categories.map(cat => {
                      const isActive = activeSidebarCat === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setActiveSidebarCat(cat.id)}
                          className={cn(
                            "flex items-center justify-between px-5 py-2.5 cursor-pointer transition-colors relative",
                            isActive ? "bg-gray-200" : "hover:bg-gray-200"
                          )}
                        >
                          <div className={cn(
                            "flex items-center gap-3 text-[14px]",
                            isActive ? "text-black font-medium" : "text-gray-700 font-normal group-hover/megatrigger:text-black"
                          )}>
                            {getCategoryIcon(cat.name)}
                            <span>{cat.name}</span>
                          </div>
                          <ChevronRight className={cn(
                            "w-4 h-4",
                            isActive ? "text-black" : "text-gray-400 group-hover/megatrigger:text-black"
                          )} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex-1 bg-white p-6 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {activeSidebarCatObj?.children && activeSidebarCatObj.children.length > 0 ? (
                      <div className="grid grid-cols-4 gap-x-8 gap-y-8">
                        {activeSidebarCatObj.children.map(subCat => (
                          <div key={subCat.id} className="flex flex-col">
                            <Link
                              href={`/category/${subCat.slug}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="text-[14px] font-medium text-black mb-3 hover:underline flex items-center transition-all underline-offset-4 decoration-1"
                            >
                              {subCat.name} <ChevronRight className="w-4 h-4 ml-0.5 mt-0.5" />
                            </Link>

                            <div className="flex flex-col space-y-2">
                              {subCat.children?.slice(0, 10).map(leaf => (
                                <Link
                                  key={leaf.id}
                                  href={`/category/${leaf.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="text-[13px] text-gray-700 hover:text-black hover:underline underline-offset-4 decoration-gray-300 transition-all"
                                >
                                  {leaf.name}
                                </Link>
                              ))}

                              {subCat.children && subCat.children.length > 10 && (
                                <Link
                                  href={`/category/${subCat.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="text-[13px] font-medium text-gray-900 mt-1 hover:text-black hover:underline underline-offset-4 transition-all"
                                >
                                  Daha çox göstər <ChevronDown className="w-3.5 h-3.5 ml-1" />
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Bu kateqoriya üçün alt kateqoriya tapılmadı.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </li>

          <li className="h-full flex items-center group cursor-pointer whitespace-nowrap">
            <Link
              href="/search?listingType=new"
              onClick={() => setMegaMenuOpen(false)}
              className="h-full flex items-center font-medium text-[13px] text-gray-800 capitalize group-hover:text-black transition-colors relative"
            >
              Yeni
              <span className="absolute -bottom-px left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          </li>

          <li className="h-full flex items-center group cursor-pointer whitespace-nowrap">
            <Link
              href="/search?listingType=used"
              onClick={() => setMegaMenuOpen(false)}
              className="h-full flex items-center font-medium text-[13px] text-gray-800 capitalize group-hover:text-black transition-colors relative"
            >
              İkinci əl
              <span className="absolute -bottom-px left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          </li>

          {categories.slice(0, 12).map((item) => (
            <li
              key={item.id}
              className="h-full flex items-center group cursor-pointer whitespace-nowrap"
            >
              <Link
                href={`/category/${item.slug}`}
                onClick={() => setMegaMenuOpen(false)}
                className="h-full flex items-center font-medium text-[13px] text-gray-800 capitalize group-hover:text-black transition-colors relative"
              >
                {item.name}
                <span className="absolute -bottom-px left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
