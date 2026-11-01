import { LanguageCode, LanguageConfig } from './types';

export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    status: 'reviewed',
    statusLabel: 'Reviewed',
    isClinicalReviewed: true,
    description: 'WHO and clinical expert verified content.',
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    status: 'reviewed',
    statusLabel: 'Reviewed',
    isClinicalReviewed: true,
    description: 'በኢትዮጵያ ጤና ባለሙያዎች የተገመገመ።',
  },
  {
    code: 'om',
    name: 'Afaan Oromoo',
    nativeName: 'Afaan Oromoo',
    status: 'reviewed',
    statusLabel: 'Reviewed',
    isClinicalReviewed: true,
    description: 'Ogeessota fayyaatiin qoratamee kan mirkanaa’e.',
  },
  {
    code: 'ti',
    name: 'Tigrinya',
    nativeName: 'ትግርኛ',
    status: 'reviewed',
    statusLabel: 'Reviewed',
    isClinicalReviewed: true,
    description: 'ብናይ ሕክምና ሞያውያን ዝተገምገመ።',
  },
  {
    code: 'so',
    name: 'Somali',
    nativeName: 'Af Soomaali',
    status: 'machine_translated',
    statusLabel: 'Machine-translated, awaiting review',
    isClinicalReviewed: false,
    description: 'Turjumaad toos ah; dib-u-eegis caafimaad baa lagu jiraa.',
  },
  {
    code: 'aa',
    name: 'Afar',
    nativeName: 'Qafaraf',
    status: 'not_available',
    statusLabel: 'Not yet available',
    isClinicalReviewed: false,
    description: 'Qafaraf tarjamak taama geytimta (Scaffold).',
  },
  {
    code: 'sid',
    name: 'Sidama',
    nativeName: 'Sidaamu Afoo',
    status: 'not_available',
    statusLabel: 'Not yet available',
    isClinicalReviewed: false,
    description: 'Sidaamu afiiti looso hanafo aana no (Scaffold).',
  },
];

export function getLanguageConfig(code: LanguageCode): LanguageConfig {
  const found = AVAILABLE_LANGUAGES.find((lang) => lang.code === code);
  return (
    found || {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      status: 'reviewed',
      statusLabel: 'Reviewed',
      isClinicalReviewed: true,
      description: 'WHO and clinical expert verified content.',
    }
  );
}

export function isLanguageClinicalReviewed(code: LanguageCode): boolean {
  const config = getLanguageConfig(code);
  return config.isClinicalReviewed;
}
