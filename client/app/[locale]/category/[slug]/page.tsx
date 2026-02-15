'use client';

import { use, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { PRODUCTS } from '@/lib/products';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { FilterSidebar } from '../components/FilterSidebar';
import { Filter } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const categoryTitle = decodeURIComponent(slug).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const getSubcategories = (slug: string) => {
        switch (slug) {
            case 'women':
                return ['Cins şalvarlar', 'Bluzlar', 'Ətəklər və donlar', 'Pencəklər və jiletlər', 'Puloverlər və svitşotlar', 'Üst geyimlər', 'Ayaqqabılar'];
            case 'men':
                return ['Cins şalvarlar', 'Şalvarlar', 'Köynəklər', 'Tişörtlər', 'Puloverlər və svitşotlar', 'Gödəkçələr', 'Ayaqqabılar'];
            case 'bags':
                return ['Qadın çantaları', 'Bel çantaları', 'Səyahət çantaları', 'Pulqabılar', 'Kişi çantaları'];
            case 'accessories':
                return ['Eynəklər', 'Papaqlar', 'Saatlar', 'Şərflər', 'Əlcəklər', 'Kəmərlər'];
            case 'shoes':
                return ['Qadın ayaqqabıları', 'Kişi ayaqqabıları', 'Uşaq ayaqqabıları', 'İdman ayaqqabıları', 'Ziyafət ayaqqabıları'];
            case 'kids':
                return ['2 yaşa qədər uşaqlar', '10 yaşa qədər uşaqlar', 'Yeniyetmələr'];
            default:
                return ['Köynəklər', 'Şalvarlar', 'Donlar', 'Gödəkçələr', 'Sviterlər', 'İdman geyimləri'];
        }
    };

    const filters = [
        {
            id: 'subcategory',
            name: 'Kateqoriya',
            options: getSubcategories(slug)
        },
        {
            id: 'size',
            name: 'Ölçü',
            options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        },
        {
            id: 'brand',
            name: 'Brend',
            options: ['Zara', 'H&M', 'Nike', 'Adidas', 'Bershka', 'Mango', 'Stradivarius']
        },
        {
            id: 'condition',
            name: 'Vəziyyət',
            options: ['Yeni', 'Çox yaxşı', 'Yaxşı', 'Etiketli']
        },
        {
            id: 'price',
            name: 'Qiymət',
            options: ['0 - 20 ₼', '20 - 50 ₼', '50 - 100 ₼', '100+ ₼']
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug]);

    return (
        <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto pb-24 lg:pb-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">
                    {categoryTitle}
                </h1>

                {/* Mobile Filter Trigger (Top) */}
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
                <aside className="hidden lg:block w-64 shrink-0">
                    <FilterSidebar filters={filters} />
                </aside>

                {/* Product Grid */}
                <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-4 gap-y-6 sm:gap-y-8">
                        {PRODUCTS.filter(p => {
                            const lowerSlug = slug.toLowerCase();
                            // Handle 'accessories' vs 'accessory' mapping or direct category match
                            if (lowerSlug.includes('accessor')) return p.category === 'accessories';
                            if (lowerSlug.includes('child') || lowerSlug.includes('kid')) return p.category === 'kids';
                            if (lowerSlug.includes('bag')) return p.category === 'bags';
                            if (lowerSlug.includes('shoe')) return p.category === 'shoes';

                            // Exact match fallback
                            return p.category === lowerSlug;
                        }).map((product) => (
                            <Card key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <Button variant="outline" className="px-8 border-gray-300">
                            Daha çox göstər
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
