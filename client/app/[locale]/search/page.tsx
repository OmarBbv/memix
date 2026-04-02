'use client';

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { FilterSidebar } from '../category/components/FilterSidebar';
import { Filter, Loader2, ChevronRight, Search } from 'lucide-react';
import { useInfiniteProducts, useProductFilters } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { Product } from '@/services/product.service';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

interface CategoryResult {
  type: 'category';
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get('q') || '';
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const selectedFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    const excludeKeys = ['q', 'minPrice', 'maxPrice'];
    searchParams.forEach((value, key) => {
      if (excludeKeys.includes(key)) return;
      if (!filters[key]) filters[key] = [];
      value.split(',').forEach(v => {
        const trimmed = v.trim();
        if (trimmed && !filters[key].includes(trimmed)) {
          filters[key].push(trimmed);
        }
      });
    });
    return filters;
  }, [searchParams]);

  const selectedPriceMin = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const selectedPriceMax = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const apiFilters = useMemo(() => {
    const result: Record<string, string> = { search: query };
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        result[key] = values.join(',');
      }
    });
    if (selectedPriceMin != null) result.minPrice = String(selectedPriceMin);
    if (selectedPriceMax != null) result.maxPrice = String(selectedPriceMax);
    return result;
  }, [selectedFilters, selectedPriceMin, selectedPriceMax, query]);

  // Çok hızlı request atılmaması için ufak bir gecikme
  const debouncedFilters = useDebounce(apiFilters, 300);

  // 3) Hook'ları çağır: Filtre menüsü değerleri(categoriesService mantığında) ve Ürünler
  const { data: filtersData } = useProductFilters(debouncedFilters);

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    ...debouncedFilters,
    limit: 20,
  });

  const isFiltering = isFetching && !isLoading && !isFetchingNextPage;

  // Sayfaları düzleştir (ürünler ve kateqoriyalar karışık gelebiliyor ES'ten)
  const allItems = data?.pages.flatMap((page) => page.data) || [];
  const products = allItems.filter((item: any) => item.type !== 'category') as unknown as Product[];
  const categories = allItems.filter((item: any) => item.type === 'category') as unknown as CategoryResult[];

  const uniqueCategories = categories.filter(
    (cat, index, self) => self.findIndex((c) => c.id === cat.id) === index
  );

  const totalProducts = data?.pages[0]?.meta?.total ?? 0;

  // Infinite Scroll Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0, rootMargin: '200px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // URL State Güncelleyici fonksiyonlar
  const buildUrlParams = useCallback((filters: Record<string, string[]>, priceMin?: number, priceMax?: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(','));
    });
    if (priceMin != null) params.set('minPrice', String(priceMin));
    if (priceMax != null) params.set('maxPrice', String(priceMax));
    return params;
  }, [query]);

  const handleFilterChange = useCallback((filterId: string, value: string, checked: boolean) => {
    const current = { ...selectedFilters };
    if (checked) {
      if (!current[filterId]) current[filterId] = [];
      current[filterId] = [...current[filterId], value];
    } else {
      current[filterId] = (current[filterId] || []).filter(v => v !== value);
      if (current[filterId].length === 0) delete current[filterId];
    }
    const params = buildUrlParams(current, selectedPriceMin, selectedPriceMax);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedFilters, selectedPriceMin, selectedPriceMax, router, pathname, buildUrlParams]);

  const handlePriceChange = useCallback((min: number, max: number) => {
    const priceRange = filtersData?.priceRange;
    const newMin = (priceRange && min <= priceRange.min) ? undefined : min;
    const newMax = (priceRange && max >= priceRange.max) ? undefined : max;
    const params = buildUrlParams(selectedFilters, newMin, newMax);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedFilters, filtersData, router, pathname, buildUrlParams]);

  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, query]);

  // Sidebar için filtrelerin isimlendirilmesi
  const getFilterName = (key: string) => {
    const names: Record<string, string> = {
      brand: 'Brend',
      color: 'Rəng',
      size: 'Ölçü',
      gender: 'Cins',
      condition: 'Vəziyyət',
      material: 'Material',
      listingType: 'Məhsul Növü',
    };
    return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getOptionLabel = (id: string, value: string) => {
    if (id === 'listingType') {
      return value === 'new' ? 'Yeni' : '2-ci əl';
    }
    return value;
  };

  const dynamicFilters = filtersData?.filters ? Object.entries(filtersData.filters).map(([key, options]) => ({
    id: key,
    name: getFilterName(key),
    options: (options as string[]).map(opt => {
        if (key === 'listingType') {
            return { value: opt, label: getOptionLabel(key, opt) };
        }
        return opt;
    })
  })) : [];

  const priceRange = filtersData?.priceRange && filtersData.priceRange.max > 0
    ? { min: Math.floor(filtersData.priceRange.min || 0), max: Math.ceil(filtersData.priceRange.max) }
    : undefined;

  const priceFilterCount = (selectedPriceMin != null ? 1 : 0) + (selectedPriceMax != null ? 1 : 0);
  const activeFilterCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0) + priceFilterCount;

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto pb-24 lg:pb-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">
        {query ? (
          <>
            &quot;{query}&quot; üçün axtarış nəticələri
          </>
        ) : selectedFilters.listingType?.includes('new') ? (
          'Yeni Məhsullar'
        ) : selectedFilters.listingType?.includes('used') ? (
          'İkinci əl Məhsullar'
        ) : (
          'Bütün məhsullar'
        )}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-[130px] z-20 self-start">
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide pb-10">
            <FilterSidebar
              filters={dynamicFilters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              priceRange={priceRange}
              selectedPriceMin={selectedPriceMin}
              selectedPriceMax={selectedPriceMax}
              onPriceChange={handlePriceChange}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-500 mt-1">
                  {totalProducts} nəticə
                  {activeFilterCount > 0 && ` (${activeFilterCount} filtr aktiv)`}
                </p>
              </div>
            </div>

            {/* MOBILE FILTER SHEET */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl border-gray-200 relative">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-black text-white text-[10px] font-bold px-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-xl overflow-hidden flex flex-col z-100">
                  <SheetTitle className="sr-only">Filtrlər</SheetTitle>
                  <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28">
                    <FilterSidebar
                      filters={dynamicFilters}
                      selectedFilters={selectedFilters}
                      onFilterChange={handleFilterChange}
                      onClearAll={handleClearAll}
                      priceRange={priceRange}
                      selectedPriceMin={selectedPriceMin}
                      selectedPriceMax={selectedPriceMax}
                      onPriceChange={handlePriceChange}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-5 py-4">
                    <SheetTrigger asChild>
                      <Button className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-xl font-bold text-base">
                        Nəticələri göstər
                      </Button>
                    </SheetTrigger>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* ACTIVE FILTERS BADGES */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPriceMin != null && (
                <button
                  onClick={() => handlePriceChange(priceRange?.min ?? 0, selectedPriceMax ?? priceRange?.max ?? 0)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Min: {selectedPriceMin} ₼
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
              {selectedPriceMax != null && (
                <button
                  onClick={() => handlePriceChange(selectedPriceMin ?? priceRange?.min ?? 0, priceRange?.max ?? 0)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Max: {selectedPriceMax} ₼
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
              {Object.entries(selectedFilters).map(([filterId, values]) =>
                values.map(value => (
                  <button
                    key={`${filterId}-${value}`}
                    onClick={() => handleFilterChange(filterId, value, false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {getOptionLabel(filterId, value)}
                    <span className="text-gray-400 hover:text-gray-600">✕</span>
                  </button>
                ))
              )}
              <button
                onClick={handleClearAll}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                Hamısını təmizlə
              </button>
            </div>
          )}

          <div className="relative">
            {isFiltering && (
              <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 bg-white/60 backdrop-blur-[1px] rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
              </div>
            )}

            <div className={`transition-opacity duration-200 ${isFiltering ? 'opacity-40' : 'opacity-100'}`}>
              {/* KATEQORİYALAR */}
              {uniqueCategories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Kateqoriyalar</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uniqueCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
                      >
                        <div className="relative w-16 h-16 mb-3 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100">
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={category.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                              <span className="text-xs font-bold">IMG</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-center text-gray-900 group-hover:text-black">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Separator className="mt-8" />
                </div>
              )}

              {/* MƏHSULLAR */}
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-4 gap-y-6 sm:gap-y-8">
                    {products.map((product, i) => (
                      <Card key={product.id || i} index={i} product={product} />
                    ))}
                  </div>

                  {/* INFINITE SCROLL */}
                  <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
                    {isFetchingNextPage ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    ) : hasNextPage ? (
                      <Button
                        variant="outline"
                        className="px-8 border-gray-300"
                        onClick={() => fetchNextPage()}
                      >
                        Daha çox göstər
                      </Button>
                    ) : products.length > 0 ? (
                      <p className="text-sm text-gray-400">Bütün məhsullar göstərildi</p>
                    ) : null}
                  </div>
                </>
              ) : uniqueCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {activeFilterCount > 0 ? 'Nəticə tapılmadı' : 'Axtarışınız üzrə nəticə tapılmadı'}
                  </p>
                  <p className="text-gray-500 mb-6">
                    {activeFilterCount > 0
                      ? 'Axtardığınız meyarlara uyğun məhsul yoxdur.'
                      : 'Fərqli açar sözlərlə yenidən sınayın.'
                    }
                  </p>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleClearAll}
                      className="rounded-xl"
                    >
                      Filtrləri təmizlə
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
