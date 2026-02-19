import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

const isDev = process.env.NODE_ENV === 'development';
const productionHost = 'memix.az';
const host = isDev ? 'localhost:3000' : productionHost;

export const routing = defineRouting({
  locales: ['en', 'az', 'ru'],
  defaultLocale: 'az',
  domains: [
    {
      domain: isDev ? `az.${host}` : `az.${productionHost}`,
      defaultLocale: 'az',
      locales: ['az']
    },
    {
      domain: isDev ? `en.${host}` : `en.${productionHost}`,
      defaultLocale: 'en',
      locales: ['en']
    },
    {
      domain: isDev ? `ru.${host}` : `ru.${productionHost}`,
      defaultLocale: 'ru',
      locales: ['ru']
    },
    {
      domain: host,
      defaultLocale: 'az',
      locales: ['en', 'az', 'ru']
    }
  ],
  localePrefix: 'never'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
