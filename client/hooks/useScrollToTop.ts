'use client';

import { usePathname } from '@/i18n/routing';
import { useEffect } from 'react';

export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);
};
