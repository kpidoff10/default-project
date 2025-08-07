import { clientConfig } from '@/lib/config/client-config';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: clientConfig.i18n.locales,
 
  // Used when no locale matches
  defaultLocale: clientConfig.i18n.defaultLocale
});