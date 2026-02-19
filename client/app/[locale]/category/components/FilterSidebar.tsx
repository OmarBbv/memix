'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface PriceRange {
  min: number;
  max: number;
}

interface FilterSidebarProps {
  filters: FilterOption[];
  className?: string;
  onClose?: () => void;
  selectedFilters?: Record<string, string[]>;
  onFilterChange?: (filterId: string, value: string, checked: boolean) => void;
  onClearAll?: () => void;
  subcategories?: Subcategory[];
  priceRange?: PriceRange;
  selectedPriceMin?: number;
  selectedPriceMax?: number;
  onPriceChange?: (min: number, max: number) => void;
}

interface DualRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  onCommit: (min: number, max: number) => void;
  step?: number;
}

const DualRangeSlider = ({ min, max, valueMin, valueMax, onChange, onCommit, step = 1 }: DualRangeSliderProps) => {
  const getPercent = (val: number) => {
    if (max === min) return 0;
    return ((val - min) / (max - min)) * 100;
  };

  const leftPct = getPercent(valueMin);
  const rightPct = getPercent(valueMax);

  return (
    <div className="relative w-full h-10 flex items-center">
      <div className="absolute left-0 right-0 h-1.5 bg-gray-200 rounded-full pointer-events-none" />
      <div
        className="absolute h-1.5 bg-black rounded-full pointer-events-none"
        style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val < valueMax) onChange(val, valueMax);
        }}
        onPointerUp={() => onCommit(valueMin, valueMax)}
        onTouchEnd={() => onCommit(valueMin, valueMax)}
        className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none z-10
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
          [&::-webkit-slider-thumb]:active:cursor-grabbing
          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black
          [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab
          [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:bg-transparent
          [&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-transparent"
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val > valueMin) onChange(valueMin, val);
        }}
        onPointerUp={() => onCommit(valueMin, valueMax)}
        onTouchEnd={() => onCommit(valueMin, valueMax)}
        className="absolute w-full h-10 appearance-none bg-transparent pointer-events-none z-20
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
          [&::-webkit-slider-thumb]:active:cursor-grabbing
          [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black
          [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab
          [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:bg-transparent
          [&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-transparent"
      />
    </div>
  );
};

interface PriceFilterProps {
  priceRange: PriceRange;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

const PriceFilter = ({ priceRange, valueMin, valueMax, onChange }: PriceFilterProps) => {
  const [sliderMin, setSliderMin] = useState(valueMin);
  const [sliderMax, setSliderMax] = useState(valueMax);
  const [localMinInput, setLocalMinInput] = useState(String(valueMin));
  const [localMaxInput, setLocalMaxInput] = useState(String(valueMax));
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSliderMin(valueMin);
    setLocalMinInput(String(valueMin));
  }, [valueMin]);

  useEffect(() => {
    setSliderMax(valueMax);
    setLocalMaxInput(String(valueMax));
  }, [valueMax]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const commitWithDebounce = (newMin: number, newMax: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChange(newMin, newMax);
    }, 1000);
  };

  const handleSliderChange = (newMin: number, newMax: number) => {
    setSliderMin(newMin);
    setSliderMax(newMax);
    setLocalMinInput(String(newMin));
    setLocalMaxInput(String(newMax));
  };

  const handleSliderCommit = (newMin: number, newMax: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    onChange(newMin, newMax);
  };

  const commitNow = (newMin: number, newMax: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    onChange(newMin, newMax);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalMinInput(raw);
    const val = parseInt(raw);
    if (!isNaN(val)) {
      const clamped = Math.max(priceRange.min, Math.min(val, sliderMax - 1));
      setSliderMin(clamped);
      commitWithDebounce(clamped, sliderMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalMaxInput(raw);
    const val = parseInt(raw);
    if (!isNaN(val)) {
      const clamped = Math.max(sliderMin + 1, Math.min(val, priceRange.max));
      setSliderMax(clamped);
      commitWithDebounce(sliderMin, clamped);
    }
  };

  const handleMinBlur = () => {
    let val = parseInt(localMinInput) || priceRange.min;
    val = Math.max(priceRange.min, Math.min(val, sliderMax - 1));
    setLocalMinInput(String(val));
    setSliderMin(val);
    commitNow(val, sliderMax);
  };

  const handleMaxBlur = () => {
    let val = parseInt(localMaxInput) || priceRange.max;
    val = Math.max(sliderMin + 1, Math.min(val, priceRange.max));
    setLocalMaxInput(String(val));
    setSliderMax(val);
    commitNow(sliderMin, val);
  };

  const handleMinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleMinBlur();
  };

  const handleMaxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleMaxBlur();
  };

  return (
    <div className="space-y-4 pt-1 pb-4 overflow-hidden">
      <DualRangeSlider
        min={priceRange.min}
        max={priceRange.max}
        valueMin={sliderMin}
        valueMax={sliderMax}
        onChange={handleSliderChange}
        onCommit={handleSliderCommit}
        step={1}
      />
      <div className="flex items-center gap-3">
        <div className="flex-1 relative min-w-0">
          <input
            type="number"
            value={localMinInput}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
            onKeyDown={handleMinKeyDown}
            min={priceRange.min}
            max={sliderMax - 1}
            className="w-full h-10 px-3 pr-8 text-sm font-medium border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Min"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">₼</span>
        </div>
        <div className="w-3 h-px bg-gray-300 shrink-0" />
        <div className="flex-1 relative min-w-0">
          <input
            type="number"
            value={localMaxInput}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
            onKeyDown={handleMaxKeyDown}
            min={sliderMin + 1}
            max={priceRange.max}
            className="w-full h-10 px-3 pr-8 text-sm font-medium border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Max"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">₼</span>
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
        <span>{priceRange.min} ₼</span>
        <span>{priceRange.max} ₼</span>
      </div>
    </div>
  );
};

// ─── Main FilterSidebar ──────────────────
export const FilterSidebar = ({
  filters,
  className,
  onClose,
  selectedFilters = {},
  onFilterChange,
  onClearAll,
  subcategories = [],
  priceRange,
  selectedPriceMin,
  selectedPriceMax,
  onPriceChange,
}: FilterSidebarProps) => {
  const activeCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);
  const hasPriceFilter = priceRange && priceRange.max > 0 && onPriceChange;
  const isPriceActive = hasPriceFilter && (
    (selectedPriceMin != null && selectedPriceMin > priceRange.min) ||
    (selectedPriceMax != null && selectedPriceMax < priceRange.max)
  );
  const totalActiveCount = activeCount + (isPriceActive ? 1 : 0);

  // Filter out the old checkbox-based 'price' filter from the list
  const nonPriceFilters = filters.filter(f => f.id !== 'price');

  return (
    <div className={`w-full space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Filtrlər
          {totalActiveCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-black text-white text-xs font-medium">
              {totalActiveCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {totalActiveCount > 0 && onClearAll && (
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

      <Accordion
        type="multiple"
        defaultValue={[...nonPriceFilters.map(f => f.id), ...(hasPriceFilter ? ['price-range'] : [])]}
        className="w-full"
      >
        {/* Price Range Slider */}
        {hasPriceFilter && (
          <AccordionItem value="price-range" className="border-b">
            <AccordionTrigger className="hover:no-underline py-4 text-base font-semibold">
              <span className="flex items-center gap-2">
                Qiymət
                {isPriceActive && (
                  <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-gray-200 text-gray-600 text-[10px] font-medium">
                    1
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <PriceFilter
                priceRange={priceRange}
                valueMin={selectedPriceMin ?? priceRange.min}
                valueMax={selectedPriceMax ?? priceRange.max}
                onChange={onPriceChange}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Other filters */}
        {nonPriceFilters.map((filter) => {
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