'use client';

import { use, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { PRODUCTS } from '@/lib/products';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { FilterSidebar } from '../components/FilterSidebar';
import { Filter } from 'lucide-react';
import { ContentState } from '@/components/shared/ContentState';
import { useCategoryBySlug, useCategoryFilters } from '@/hooks/useCategories';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { data: category, isLoading, error } = useCategoryBySlug(slug);



    const { data: filtersData } = useCategoryFilters(category?.id as number);

    const subcategories = category?.children?.map(child => child.name) || [];

    const getFilterName = (key: string) => {
        const names: Record<string, string> = {
            brand: 'Brend',
            color: 'Rəng',
            size: 'Ölçü',
            condition: 'Vəziyyət',
            material: 'Material',
        };
        return names[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const dynamicFilters = filtersData?.filters ? Object.entries(filtersData.filters).map(([key, options]) => ({
        id: key,
        name: getFilterName(key),
        options: options as string[]
    })) : [];

    const filters = [
        {
            id: 'subcategory',
            name: 'Kateqoriya',
            options: subcategories
        },
        ...dynamicFilters,
        {
            id: 'price',
            name: 'Qiymət',
            options: [
                `0 - ${Math.round((filtersData?.priceRange?.max || 0) / 4)} ₼`,
                `${Math.round((filtersData?.priceRange?.max || 0) / 4)} - ${Math.round((filtersData?.priceRange?.max || 0) / 2)} ₼`,
                `${Math.round((filtersData?.priceRange?.max || 0) / 2)} - ${filtersData?.priceRange?.max} ₼`,
            ].filter(() => (filtersData?.priceRange?.max || 0) > 0)
        }
    ];

    // useEffect(() => {
    //     window.scrollTo(0, 0)
    // }, [slug]);

    return (
        <ContentState
            isLoading={isLoading}
            isError={!!error || (!isLoading && !category)}
            errorMessage="Kateqoriya tapılmadı"
            onRetry={() => window.location.reload()}
        >
            {category && (
                <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto pb-24 lg:pb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            {category.name}
                        </h1>

                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-xl border-gray-200">
                                        <Filter className="w-4 h-4" />
                                        <span className="text-sm">Filter</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-[32px] overflow-hidden">
                                    <SheetTitle className="sr-only">Filtrlər</SheetTitle>
                                    <div className="h-full overflow-y-auto px-6 pt-8 pb-32">
                                        <FilterSidebar filters={filters} />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters (Desktop) */}
                        <aside className="hidden lg:block w-64 shrink-0 sticky top-[130px] z-20 self-start">
                            <div className="max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide pb-10">
                                <FilterSidebar filters={filters} />
                            </div>
                        </aside>

                        <div className="flex-1 min-w-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-4 gap-y-6 sm:gap-y-8">
                                {((category as any).products || []).length > 0 ? (
                                    (category as any).products.map((product: any) => (
                                        <Card key={product.id} product={{
                                            ...product,
                                            title: product.name,
                                            image: product.banner || (product.images?.[0]) || "/placeholder-cat.jpg",
                                            price: Number(product.price)
                                        }} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-zinc-500">
                                        Bu kateqoriyada hələ məhsul yoxdur.
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Button variant="outline" className="px-8 border-gray-300">
                                    Daha çox göstər
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ContentState>
    );
}
