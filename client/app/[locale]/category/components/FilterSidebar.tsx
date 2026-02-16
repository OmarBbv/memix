'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FilterOption {
  id: string;
  name: string;
  options: string[];
}

interface FilterSidebarProps {
  filters: FilterOption[];
  className?: string;
  onClose?: () => void;
}

export const FilterSidebar = ({ filters, className, onClose }: FilterSidebarProps) => {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filtrlər</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm text-gray-500 hover:text-black h-8 px-2">
            Təmizlə
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden h-8 w-8 p-0">
              ✕
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={['subcategory', 'price', 'size']} className="w-full">
        {filters.map((filter) => (
          <AccordionItem key={filter.id} value={filter.id} className="border-b">
            <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
              {filter.name}
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={cn(
                  "space-y-4 pt-1 pb-4 pr-2 custom-scrollbar",
                  filter.options.length > 6 && "max-h-[220px] overflow-y-auto"
                )}
              >
                {filter.options.map((option) => (
                  <div key={option} className="flex items-center space-x-3">
                    <Checkbox id={`${filter.id}-${option}`} className="h-5 w-5 rounded-md border-gray-300 transition-colors data-[state=checked]:bg-black data-[state=checked]:border-black" />
                    <label
                      htmlFor={`${filter.id}-${option}`}
                      className="text-sm w-full font-medium leading-none cursor-pointer select-none text-gray-600 hover:text-black transition-colors"
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

      {onClose && (
        <div className="pt-6 lg:hidden sticky bottom-0 bg-white pb-6 border-t mt-auto">
          <Button className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-xl font-bold" onClick={onClose}>
            Məhsulları göstər
          </Button>
        </div>
      )}
    </div>
  );
};
