'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
  options: string[];
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  filters: FilterOption[];
  className?: string;
  onClose?: () => void;
  selectedFilters?: Record<string, string[]>;
  onFilterChange?: (filterId: string, value: string, checked: boolean) => void;
  onClearAll?: () => void;
  subcategories?: Subcategory[];
}

export const FilterSidebar = ({
  filters,
  className,
  onClose,
  selectedFilters = {},
  onFilterChange,
  onClearAll,
  subcategories = [],
}: FilterSidebarProps) => {
  const activeCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Filtrlər
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-black text-white text-xs font-medium">
              {activeCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {activeCount > 0 && onClearAll && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
              onClick={onClearAll}
            >
              Təmizlə
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden h-8 w-8 p-0">
              ✕
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Subcategory links */}
      {subcategories.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Kateqoriyalar</h3>
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/en/category/${sub.slug}`}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors group"
            >
              {sub.name}
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
            </Link>
          ))}
          <Separator className="mt-3" />
        </div>
      )}

      <Accordion type="multiple" defaultValue={filters.map(f => f.id)} className="w-full">
        {filters.map((filter) => {
          const selectedCount = selectedFilters[filter.id]?.length || 0;

          return (
            <AccordionItem key={filter.id} value={filter.id} className="border-b">
              <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
                <span className="flex items-center gap-2">
                  {filter.name}
                  {selectedCount > 0 && (
                    <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-gray-200 text-gray-600 text-[10px] font-medium">
                      {selectedCount}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className={cn(
                    "space-y-4 pt-1 pb-4 pr-2 custom-scrollbar",
                    filter.options.length > 6 && "max-h-[220px] overflow-y-auto"
                  )}
                >
                  {filter.options.map((option) => {
                    const isChecked = selectedFilters[filter.id]?.includes(option) || false;
                    return (
                      <div key={option} className="flex items-center space-x-3">
                        <Checkbox
                          id={`${filter.id}-${option}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            onFilterChange?.(filter.id, option, !!checked);
                          }}
                          className="h-5 w-5 rounded-md border-gray-300 transition-colors data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                        <label
                          htmlFor={`${filter.id}-${option}`}
                          className={cn(
                            "text-sm w-full font-medium leading-none cursor-pointer select-none transition-colors",
                            isChecked ? "text-black" : "text-gray-600 hover:text-black"
                          )}
                        >
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
