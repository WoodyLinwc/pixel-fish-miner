
import { Language } from '../types';
import { en } from './en';
import { es } from './es';
import { zh } from './zh';

export const TRANSLATIONS: Record<Language, typeof en> = {
  en,
  es,
  zh
};
