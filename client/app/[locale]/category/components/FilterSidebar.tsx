'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronRight, Search, X } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
  options: (string | { value: string; label: string })[];
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

// ─── DualRangeSlider ──────────────────
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
    <div className="relative w-full h-8 flex items-center">
      <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full pointer-events-none" />
      <div
        className="absolute h-1 bg-[#10b981] rounded-full pointer-events-none"
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
        className="absolute w-full h-8 appearance-none bg-transparent pointer-events-none z-10
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10b981]
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#10b981]
          [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md
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
        className="absolute w-full h-8 appearance-none bg-transparent pointer-events-none z-20
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10b981]
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#10b981]
          [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md
          [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:bg-transparent
          [&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-transparent"
      />
    </div>
  );
};

// ─── PriceFilter ──────────────────
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
    <div className="space-y-4 pt-2">
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
        <div className="flex-1 relative">
          <input
            type="number"
            value={localMinInput}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
            onKeyDown={handleMinKeyDown}
            min={priceRange.min}
            max={sliderMax - 1}
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-inset focus:ring-[#10b981] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Min"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₼</span>
        </div>
        <div className="text-gray-400">−</div>
        <div className="flex-1 relative">
          <input
            type="number"
            value={localMaxInput}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
            onKeyDown={handleMaxKeyDown}
            min={sliderMin + 1}
            max={priceRange.max}
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-inset focus:ring-[#10b981] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Max"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₼</span>
        </div>
      </div>
    </div>
  );
};

// ─── Filter Group ──────────────────
interface FilterGroupProps {
  filter: FilterOption;
  selectedValues: string[];
  onFilterChange: (filterId: string, value: string, checked: boolean) => void;
}

const FilterGroup = ({ filter, selectedValues, onFilterChange }: FilterGroupProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredOptions = filter.options.filter(option => {
    const label = typeof option === 'string' ? option : option.label;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    const labelA = typeof a === 'string' ? a : a.label;
    const labelB = typeof b === 'string' ? b : b.label;
    return labelA.localeCompare(labelB);
  });

  const getOptionValue = (option: string | { value: string; label: string }) => 
    typeof option === 'string' ? option : option.value;

  const getOptionLabel = (option: string | { value: string; label: string }) => 
    typeof option === 'string' ? option : option.label;

  const showSearch = filter.options.length > 8;

  return (
    <AccordionItem key={filter.id} value={filter.id} className="border-b last:border-b-0">
      <AccordionTrigger className="hover:no-underline py-4 text-sm font-semibold text-gray-900 group">
        <span className="flex items-center gap-2">
          {filter.name}
          {selectedValues.length > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#10b981] text-white text-[10px] font-bold">
              {selectedValues.length}
            </span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-1 pb-4">
          {showSearch && (
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`${filter.name} axtar...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-inset focus:ring-[#10b981]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className={cn(
            "space-y-3",
            filter.options.length > 6 && "max-h-60 overflow-y-auto pr-2 custom-scrollbar"
          )}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const val = getOptionValue(option);
                const label = getOptionLabel(option);
                return (
                  <div key={val} className="flex items-center space-x-3 group cursor-pointer" 
                       onClick={() => onFilterChange?.(filter.id, val, !selectedValues.includes(val))}>
                    <Checkbox 
                      id={`${filter.id}-${val}`}
                      checked={selectedValues.includes(val)}
                      onCheckedChange={(checked) => {
                        onFilterChange?.(filter.id, val, !!checked);
                      }}
                      className="border-gray-200 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <label
                      htmlFor={`${filter.id}-${val}`}
                      className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors cursor-pointer flex-1"
                    >
                      {label}
                    </label>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-2">Nəticə tapılmadı</p>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// ─── FilterSidebar ──────────────────
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
  const totalActiveCount = activeCount + (
    (selectedPriceMin != null && priceRange && selectedPriceMin > priceRange.min) ||
    (selectedPriceMax != null && priceRange && selectedPriceMax < priceRange.max) ? 1 : 0
  );

  const filterPriority = ['gender', 'brand', 'color', 'size', 'condition', 'material'];
  const nonPriceFilters = [...filters]
    .filter(f => f.id !== 'price')
    .sort((a, b) => {
      const indexA = filterPriority.indexOf(a.id);
      const indexB = filterPriority.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  const allFilterIds = [
    ...nonPriceFilters.map(f => f.id),
    ...(priceRange && priceRange.max > 0 ? ['price-range'] : [])
  ];

  return (
    <div className={cn("w-full bg-white", className)}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Filtrlər
          {totalActiveCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#10b981] text-white text-[10px] font-bold">
              {totalActiveCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {totalActiveCount > 0 && onClearAll && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-[#10b981] hover:bg-green-50 h-8"
              onClick={onClearAll}
            >
              Hamısını təmizlə
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Alt Kategoriyalar</h3>
          <div className="space-y-1">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/en/category/${sub.slug}`}
                className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-[#10b981] transition-colors group"
              >
                {sub.name}
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#10b981] transition-colors" />
              </Link>
            ))}
          </div>
          <Separator className="mt-8" />
        </div>
      )}

      <Accordion
        key={allFilterIds.join(',')}
        type="multiple"
        defaultValue={allFilterIds}
        className="w-full"
      >
        {/* Price Range */}
        {priceRange && priceRange.max > 0 && onPriceChange && (
          <AccordionItem value="price-range" className="border-b">
            <AccordionTrigger className="hover:no-underline py-4 text-sm font-semibold text-gray-900 group">
              <span className="flex items-center gap-2">
                Qiymət
                {(selectedPriceMin != null || selectedPriceMax != null) && (
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#10b981] text-white text-[10px] font-bold">
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

        {/* Other Filters */}
        {nonPriceFilters.map((filter) => (
          <FilterGroup 
            key={filter.id}
            filter={filter}
            selectedValues={selectedFilters[filter.id] || []}
            onFilterChange={onFilterChange || (() => {})}
          />
        ))}
      </Accordion>
    </div>
  );
};