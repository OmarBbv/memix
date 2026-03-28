'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import Image from 'next/image';
import { Product } from '@/services/product.service';

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryResult {
  type: 'category';
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

type SearchResultItem = Product | CategoryResult;

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedSearch = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const { data: searchResults, isLoading: isSearchLoading } = useProducts(
    debouncedSearch ? { search: debouncedSearch.toLowerCase() } : undefined
  );

  const { data: popularProducts, isLoading: isPopularLoading } = useProducts({
    limit: 5,
    sort: 'popular',
  });

  const uniqueSuggestions = React.useMemo(() => {
    const rawSuggestions = query
      ? (searchResults?.data?.slice(0, 10) || [])
      : (popularProducts?.data?.slice(0, 5) || []);

    const seenCategories = new Set();
    return rawSuggestions.filter(item => {
      if ((item as any).type === 'category') {
        const catName = (item as unknown as CategoryResult).name;
        if (seenCategories.has(catName)) return false;
        seenCategories.add(catName);
        return true;
      }
      return true;
    });
  }, [query, searchResults, popularProducts]);

  const isLoading = query ? isSearchLoading : isPopularLoading;

  const handleSearch = (searchTerm: string) => {
    router.push(`/search?q=${searchTerm}`);
    onClose();
  };

  const handleSelect = (item: SearchResultItem) => {
    if ((item as any).type === 'category') {
      const cat = item as CategoryResult;
      router.push(`/category/${cat.slug}`);
    } else {
      const prod = item as Product;
      router.push(`/product/${prod.id}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-white flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Məhsul, kateqoriya və ya brend axtar"
            className="w-full bg-gray-100 border-none focus-visible:ring-0 rounded-lg pl-10 h-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(query);
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 bg-gray-200 rounded-full text-gray-500"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={() => handleSearch(query)}
          className="text-[#ff6000] font-semibold text-sm px-2"
        >
          Axtar
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#ff6000] rounded-full animate-spin" />
          </div>
        ) : uniqueSuggestions.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {uniqueSuggestions.map((item) => {
              const itemIsCategory = (item as any).type === 'category';

              if (itemIsCategory) {
                const cat = item as unknown as CategoryResult;
                return (
                  <button
                    key={`cat-${cat.id}`}
                    onClick={() => handleSelect(cat)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                  >
                    <span className="text-[#ff6000] font-medium text-sm flex-1">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Kateqoriya</span>
                  </button>
                );
              }

              const prod = item as Product;
              return (
                <button
                  key={`prod-${prod.id}`}
                  onClick={() => handleSelect(prod)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left group"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-[#ff6000]" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium line-clamp-1 group-hover:text-[#ff6000]">
                      {prod.name}
                    </p>
                    {prod.category && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {prod.category.name} içində
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : query ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nəticə tapılmadı</p>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Populyar Axtarışlar</h3>
            <div className="flex flex-wrap gap-2">
              {popularProducts?.data && popularProducts.data.length > 0 ? (
                popularProducts.data.map((prod: any) => (
                  <button
                    key={prod.id}
                    onClick={() => handleSelect(prod)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {prod.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">Populyar məhsullara baxın...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileSearch;
