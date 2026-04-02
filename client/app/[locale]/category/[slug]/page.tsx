'use client';

import { use, useMemo, useCallback, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { FilterSidebar } from '../components/FilterSidebar';
import { Filter, ArrowLeft, ChevronRight } from 'lucide-react';
import { ContentState } from '@/components/shared/ContentState';
import { Loading } from '@/components/shared/Loading';
import { useCategoryBySlug, useCategoryFilters } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedFilters = useMemo(() => {
        const filters: Record<string, string[]> = {};
        const priceKeys = ['minPrice', 'maxPrice'];
        searchParams.forEach((value, key) => {
            if (priceKeys.includes(key)) return;
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
        const result: Record<string, string> = {};
        Object.entries(selectedFilters).forEach(([key, values]) => {
            if (values.length > 0) {
                result[key] = values.join(',');
            }
        });
        if (selectedPriceMin != null) result.minPrice = String(selectedPriceMin);
        if (selectedPriceMax != null) result.maxPrice = String(selectedPriceMax);
        return result;
    }, [selectedFilters, selectedPriceMin, selectedPriceMax]);

    const debouncedFilters = useDebounce(apiFilters, 300);

    const { 
        data: infiniteData, 
        isLoading, 
        error, 
        isFetching, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useCategoryBySlug(slug, debouncedFilters);
    
    const category = infiniteData?.pages[0];
    const isFiltering = isFetching && !isLoading && !isFetchingNextPage;
    const { data: filtersData } = useCategoryFilters(category?.id as number);

    const buildUrlParams = useCallback((filters: Record<string, string[]>, priceMin?: number, priceMax?: number) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, values]) => {
            if (values.length > 0) {
                params.set(key, values.join(','));
            }
        });
        if (priceMin != null) params.set('minPrice', String(priceMin));
        if (priceMax != null) params.set('maxPrice', String(priceMax));
        return params;
    }, []);

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
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, [selectedFilters, selectedPriceMin, selectedPriceMax, router, pathname, buildUrlParams]);

    const handlePriceChange = useCallback((min: number, max: number) => {
        const priceRange = filtersData?.priceRange;
        const newMin = (priceRange && min <= priceRange.min) ? undefined : min;
        const newMax = (priceRange && max >= priceRange.max) ? undefined : max;
        const params = buildUrlParams(selectedFilters, newMin, newMax);
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, [selectedFilters, filtersData, router, pathname, buildUrlParams]);

    const handleClearAll = useCallback(() => {
        router.push(pathname, { scroll: false });
    }, [router, pathname]);

    const subcategories = category?.children?.map(child => child.name) || [];

    const getFilterName = (key: string, customSizeName?: string) => {
        const names: Record<string, string> = {
            brand: 'Brend',
            color: 'Rəng',
            size: customSizeName || 'Ölçü',
            gender: 'Cins',
            condition: 'Vəziyyət',
            material: 'Material',
        };
        return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const dynamicFilters = filtersData?.filters ? Object.entries(filtersData.filters).map(([key, options]) => ({
        id: key,
        name: getFilterName(key, filtersData?.sizeTypeName),
        options: options as string[]
    })) : [];

    const filters = dynamicFilters;

    const priceRange = filtersData?.priceRange && filtersData.priceRange.max > 0
        ? { min: Math.floor(filtersData.priceRange.min || 0), max: Math.ceil(filtersData.priceRange.max) }
        : undefined;

    const products = useMemo(() => 
        infiniteData?.pages.flatMap(page => page.products || []) || []
    , [infiniteData]);

    const totalProducts = category?.pagination?.total || 0;
    const priceFilterCount = (selectedPriceMin != null ? 1 : 0) + (selectedPriceMax != null ? 1 : 0);
    const activeFilterCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0) + priceFilterCount;

    return (
        <ContentState
            isLoading={isLoading}
            isError={!!error || (!isLoading && !category)}
            errorMessage="Kateqoriya tapılmadı"
            onRetry={() => window.location.reload()}
        >
            {category && (
                <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto pb-24 lg:pb-8">
                    <nav className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                        <Link
                            href="/en/category"
                            className="text-gray-400 hover:text-black transition-colors shrink-0"
                        >
                            Kateqoriyalar
                        </Link>
                        {category.parent && (
                            <>
                                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 shrink-0" />
                                <Link
                                    href={`/en/category/${category.parent.slug}`}
                                    className="text-gray-400 hover:text-black transition-colors shrink-0"
                                >
                                    {category.parent.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 shrink-0" />
                        <span className="text-gray-800 font-medium shrink-0">{category.name}</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="hidden lg:block w-64 shrink-0 sticky top-[130px] z-20 self-start">
                            <div className="max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide pb-10">
                                <FilterSidebar
                                    filters={filters}
                                    selectedFilters={selectedFilters}
                                    onFilterChange={handleFilterChange}
                                    onClearAll={handleClearAll}
                                    subcategories={category.children || []}
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
                                    {category.parent && (
                                        <Link
                                            href={`/en/category/${category.parent.slug}`}
                                            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                                        </Link>
                                    )}
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold">
                                            {category.name}
                                        </h1>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {totalProducts} məhsul
                                            {activeFilterCount > 0 && ` (${activeFilterCount} filtr aktiv)`}
                                        </p>
                                    </div>
                                </div>

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
                                        <SheetContent side="bottom" className="h-screen p-0 rounded-none overflow-hidden flex flex-col">
                                            <SheetTitle className="sr-only">Filtrlər</SheetTitle>

                                            <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28">
                                                <FilterSidebar
                                                    filters={filters}
                                                    selectedFilters={selectedFilters}
                                                    onFilterChange={handleFilterChange}
                                                    onClearAll={handleClearAll}
                                                    subcategories={category.children || []}
                                                    priceRange={priceRange}
                                                    selectedPriceMin={selectedPriceMin}
                                                    selectedPriceMax={selectedPriceMax}
                                                    onPriceChange={handlePriceChange}
                                                />
                                            </div>

                                            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-5 py-4 safe-area-bottom">
                                                <SheetTrigger asChild>
                                                    <Button className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-xl font-bold text-base">
                                                        {totalProducts} məhsul göstər
                                                    </Button>
                                                </SheetTrigger>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </div>

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
                                    {/* Other filter badges */}
                                    {Object.entries(selectedFilters).map(([filterId, values]) =>
                                        values.map(value => (
                                            <button
                                                key={`${filterId}-${value}`}
                                                onClick={() => handleFilterChange(filterId, value, false)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                {value}
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
                                        <Loading />
                                    </div>
                                )}

                                <div className={`grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-4 gap-y-6 sm:gap-y-8 transition-opacity duration-200 ${isFiltering ? 'opacity-40' : 'opacity-100'}`}>
                                    {products.length > 0 ? (
                                        products.map((product: any) => (
                                            <Card key={product.id} product={{
                                                ...product,
                                                title: product.name,
                                                image: product.banner || (product.images?.[0]) || "",
                                                price: Number(product.price)
                                            }} />
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="text-6xl mb-4">🔍</div>
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                {activeFilterCount > 0 ? 'Nəticə tapılmadı' : 'Bu kateqoriyada hələ məhsul yoxdur'}
                                            </p>
                                            <p className="text-sm text-gray-500 mb-6">
                                                {activeFilterCount > 0
                                                    ? 'Seçilmiş filtrlərə uyğun məhsul yoxdur.'
                                                    : 'Digər kateqoriyalara baxmağı sınayın.'
                                                }
                                            </p>
                                            <div className="flex items-center justify-center gap-3">
                                                {activeFilterCount > 0 && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleClearAll}
                                                        className="rounded-xl"
                                                    >
                                                        Filtrləri təmizlə
                                                    </Button>
                                                )}
                                                {category.parent && (
                                                    <Link href={`/en/category/${category.parent.slug}`}>
                                                        <Button className="rounded-xl bg-black text-white hover:bg-zinc-800">
                                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                                            {category.parent.name}
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {hasNextPage && (
                                    <div className="mt-12 flex flex-col items-center gap-4">
                                        <p className="text-sm text-gray-500">
                                            {products.length} / {totalProducts} məhsul göstərilir
                                        </p>
                                        <Button 
                                            variant="outline" 
                                            className="px-8 border-gray-300 h-12 rounded-xl"
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                        >
                                            {isFetchingNextPage ? (
                                                <div className="flex items-center gap-2">
                                                    <Loading /> Yüklənir...
                                                </div>
                                            ) : (
                                                'Daha çox göstər'
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ContentState>
    );
}
