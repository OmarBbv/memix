'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { Product } from '@/services/product.service';
import { Loader2, Search, TrendingUp } from 'lucide-react';

interface CategoryResult {
  type: 'category';
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

type SearchResultItem = Product | CategoryResult;

interface SearchSuggestionsProps {
  open: boolean;
  query: string;
  suggestions: SearchResultItem[];
  loading: boolean;
  onClose: () => void;
}

export function SearchSuggestions({ open, query, suggestions, loading, onClose }: SearchSuggestionsProps) {
  const router = useRouter();

  if (!open) return null;

  const handleSelect = (item: SearchResultItem) => {
    if (isCategory(item)) {
      router.push(`/category/${item.slug}`);
    } else {
      router.push(`/product/${item.id}`);
    }
    onClose();
  };

  const handleSearchAll = () => {
    router.push(`/search?q=${query}`);
    onClose();
  };

  const isCategory = (item: SearchResultItem): item is CategoryResult => {
    return (item as any).type === 'category';
  };

  // Helper to highlight matching text
  const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-[#10b981] font-bold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  const rawCategories = suggestions.filter(isCategory);
  const categories = rawCategories.filter((category, index, self) =>
    index === self.findIndex((c) => c.name === category.name)
  );
  const products = suggestions.filter(item => !isCategory(item));

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center text-gray-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#10b981]" />
          <span className="text-sm font-medium">Axtarılır...</span>
        </div>
      ) : query.length === 0 ? (
        <div className="p-2">
          <div className="px-3 py-2 flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <span className="text-gray-900">Populyar Axtarışlar</span>
          </div>
          <div className="space-y-0.5">
            {suggestions.map((item) => {
              if (isCategory(item)) return null;
              const product = item as Product;
              return (
                <button
                  key={`pop-${product.id}`}
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-all group"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-[#10b981] transition-colors" />
                  <span className="text-sm text-gray-700 font-medium group-hover:text-[#10b981] transition-colors">{product.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Nəticələr
          </div>

          <div className="flex flex-col">
            {/* Categories First */}
            {categories.map((category) => (
              <button
                key={`cat-${category.id}`}
                onClick={() => handleSelect(category)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
              >
                <span className="text-[#10b981] font-medium text-sm flex-1 text-left truncate">
                  <HighlightedText text={category.name} highlight={query} />
                </span>
                <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-100 rounded-full">Kategoriya</span>
              </button>
            ))}

            {/* Products */}
            {products.map((product) => {
              const p = product as Product;
              return (
                <button
                  key={`prod-${p.id}`}
                  onClick={() => handleSelect(p)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-[#10b981] transition-colors shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-sm text-gray-700 font-medium group-hover:text-[#10b981] truncate block">
                      <HighlightedText text={p.name} highlight={query} />
                    </span>
                    {p.category && (
                      <span className="text-xs text-gray-400 truncate block mt-0.5">
                        {p.category.name} içində
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSearchAll}
            className="w-full py-3 px-4 text-sm font-semibold text-[#10b981] hover:bg-[#ecfdf5] transition-colors text-left border-t border-gray-100 mt-1 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>&quot;{query}&quot; üçün bütün nəticələri gör</span>
          </button>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-[#10b981]" />
          </div>
          <p className="text-sm font-medium text-gray-900">Nəticə tapılmadı</p>
          <p className="text-xs text-gray-500 mt-1">&quot;{query}&quot; üçün heç nə tapılmadı</p>
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
