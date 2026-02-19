'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const languages = [
    { code: 'az', label: 'AZ', flag: '🇦🇿' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center pl-1.5 cursor-pointer outline-none">
          <Globe className="w-6 h-6" />
          <span className="sr-only">Dil dəyişdir</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLocaleChange(lang.code)}
            className={`cursor-pointer ${locale === lang.code ? 'bg-accent font-medium' : ''}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
