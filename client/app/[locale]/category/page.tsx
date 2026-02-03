'use client';

import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function CategoryIndexPage() {
  const categoryTitle = "Bütün Məhsullar";

  const filters = [
    {
      id: 'subcategory',
      name: 'Kateqoriya',
      options: ['Köynəklər', 'Şalvarlar', 'Donlar', 'Gödəkçələr', 'Sviterlər', 'İdman geyimləri', 'Ayaqqabılar', 'Çantalar']
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
            {/* Simulating varied content */}
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} index={i} />
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
