import { LanguageCode, TranslationStrings } from './types';
import { enTranslations } from './en';
import { amTranslations } from './am';
import { omTranslations } from './om';
import { tiTranslations } from './ti';
import { soTranslations } from './so';
import { aaTranslations } from './aa';
import { sidTranslations } from './sid';

export * from './types';
export * from './languages';

export const translations: Record<LanguageCode, TranslationStrings> = {
  en: enTranslations,
  am: amTranslations,
  om: omTranslations,
  ti: tiTranslations,
  so: soTranslations,
  aa: aaTranslations,
  sid: sidTranslations,
};

export default translations;
