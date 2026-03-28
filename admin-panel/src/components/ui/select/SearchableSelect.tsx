import React, { useState, useRef, useEffect, useMemo } from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  error?: boolean;
  allowCustomValue?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seçin...",
  searchPlaceholder = "Axtar...",
  className = "",
  error = false,
  allowCustomValue = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => String(opt.value) === String(value)) || (allowCustomValue && value ? { label: String(value), value } : null),
    [options, value, allowCustomValue]
  );

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ə/g, "e")
      .replace(/ü/g, "u")
      .replace(/ö/g, "o")
      .replace(/ı/g, "i")
      .replace(/ş/g, "s")
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/\s+/g, ""); // Remove all spaces
  };

  const filteredOptions = useMemo(() => {
    const normalizedSearch = normalize(searchTerm);
    return options.filter((opt) =>
      normalize(opt.label).includes(normalizedSearch)
    );
  }, [options, searchTerm]);

  const showCustomOption = useMemo(() => {
    if (!allowCustomValue || !searchTerm.trim()) return false;
    return !options.some(opt => opt.label.toLowerCase() === searchTerm.toLowerCase());
  }, [allowCustomValue, searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const handleCustomSelect = () => {
    onChange(searchTerm.trim());
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-2 text-sm transition-all duration-200 min-h-[44px]
          ${error
            ? "border-red-500 bg-red-50/50 focus:ring-4 focus:ring-red-500/10 dark:bg-red-500/5"
            : "border-gray-200 bg-gray-50 hover:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand-500"
          }
          ${isOpen ? "border-brand-500 bg-white ring-4 ring-brand-500/10 dark:bg-transparent" : ""}
        `}
      >
        <span className={!selectedOption ? "text-gray-400" : "text-gray-900 dark:text-gray-200"}>
          {selectedOption ? (selectedOption as any).label : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {!!value && (
            <button
              onClick={handleClear}
              className="p-1 hover:text-red-500 text-gray-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1E293B]">
          <div className="border-b border-gray-100 p-2 dark:border-white/5">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full rounded-lg bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-gray-100 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1.5 custom-scrollbar">
            {showCustomOption && (
              <div
                onClick={handleCustomSelect}
                className="cursor-pointer border-b border-gray-100 dark:border-white/5 rounded-lg px-3 py-2.5 text-sm text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-white/5"
              >
                Əllə daxil et: <span className="font-bold">"{searchTerm}"</span>
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-all duration-200
                    ${String(value) === String(option.value)
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500 dark:text-white"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                    }
                  `}
                >
                  {option.label}
                </div>
              ))
            ) : !showCustomOption && (
              <div className="px-3 py-6 text-center text-sm text-gray-500 italic">
                Nəticə tapılmadı
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
