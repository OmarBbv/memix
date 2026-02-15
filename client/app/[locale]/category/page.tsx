'use client';

import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { FilterSidebar } from './components/FilterSidebar';
import { Filter } from 'lucide-react';

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
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto pb-24 lg:pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          {categoryTitle}
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
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar filters={filters} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 md:gap-x-4 gap-y-6 sm:gap-y-8">
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
