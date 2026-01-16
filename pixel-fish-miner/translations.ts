
import { Language } from './types';
import { en } from './locales/en';
import { es } from './locales/es';
import { zh } from './locales/zh';

export const TRANSLATIONS: Record<Language, typeof en> = {
  en,
  es,
  zh
};
