'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <div className={cn("border-b border-gray-100", className)}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500 gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-black shrink-0">
            Ana səhifə
          </Link>

          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-4 h-4 shrink-0" />
              {item.href ? (
                <Link href={item.href} className="hover:text-black shrink-0">
                  {item.label}
                </Link>
              ) : (
                <span className="text-black truncate max-w-[150px] md:max-w-none font-medium" title={item.label}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
