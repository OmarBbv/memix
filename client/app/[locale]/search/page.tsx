'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, ChevronRight } from 'lucide-react';
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
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading } = useProducts({
    search: query,
  });

  const products = (searchResults?.filter((item: any) => item.type !== 'category') || []) as unknown as Product[];
  const categories = (searchResults?.filter((item: any) => item.type === 'category') || []) as unknown as CategoryResult[];

  const filters = [
    {
      id: 'category',
      name: 'Kateqoriya',
      options: ['Qadın', 'Kişi', 'Uşaq', 'Çantalar', 'Aksesuarlar', 'Ayaqqabılar']
    },
    {
      id: 'clothing',
      name: 'Geyim Növü',
      options: ['Köynəklər', 'Şalvarlar', 'Donlar', 'Gödəkçələr', 'Sviterlər', 'İdman geyimləri']
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
        &quot;{query || 'Bütün məhsullar'}&quot; üçün axtarış nəticələri
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Filtrlər</h2>
            <Button variant="ghost" size="sm" className="text-sm text-gray-500 hover:text-black">
              Təmizlə
            </Button>
          </div>

          <Separator />

          <Accordion type="multiple" defaultValue={['category', 'clothing', 'price', 'size']} className="w-full">
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

        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Kateqoriyalar</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {categories.map((category) => (
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

              {/* Products Section */}
              {products.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Məhsullar</h2>
                    <span className="text-sm text-gray-500">{products.length} nəticə</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                    {products.map((product, i) => (
                      <Card key={product.id || i} index={i} product={product} />
                    ))}
                  </div>
                  <div className="mt-12 flex justify-center">
                    <Button variant="outline" className="px-8 border-gray-300">
                      Daha çox göstər
                    </Button>
                  </div>
                </>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                  <p className="text-lg font-medium text-gray-900 mb-2">Nəticə tapılmadı</p>
                  <p className="text-gray-500">Axtarışınız üzrə heç bir məhsul və ya kateqoriya tapılmadı.</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
