import { Language } from "../types";
import { en } from "./en";
import { es } from "./es";
import { zh } from "./zh";
import { ja } from "./ja";
import { ko } from "./ko";
import { ru } from "./ru";
import { fr } from "./fr";
import { ar } from "./ar";

export const TRANSLATIONS: Record<Language, typeof en> = {
  en,
  es,
  zh,
  ja,
  ko,
  ru,
  fr,
  ar,
};
