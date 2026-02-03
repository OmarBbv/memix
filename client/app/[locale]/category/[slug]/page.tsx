'use client';

import { use, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import dynamic from 'next/dynamic';
import { PRODUCTS } from '@/lib/products';


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
        <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {categoryTitle}
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 shrink-0 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Filtrlər</h2>
                        <Button variant="ghost" size="sm" className="text-sm text-gray-500 hover:text-black">
                            Təmizlə
                        </Button>
                    </div>

                    <Separator />

                    <Accordion type="multiple" defaultValue={['subcategory', 'price', 'size']} className="w-full">
                        {filters.map((filter) => (
                            <AccordionItem key={filter.id} value={filter.id} className="border-b-0">
                                <AccordionTrigger className="hover:no-underline py-3 text-base font-medium">
                                    {filter.name}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3 pt-1 pb-4">
                                        {filter.options.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox id={`${filter.id}-${option}`} />
                                                <label
                                                    htmlFor={`${filter.id}-${option}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
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
