/**
 * Re-export translations and types from the modular /src/data/translations directory
 */
export * from './translations/types';
export * from './translations/languages';
export * from './translations/index';

import { translations } from './translations/index';
export { translations };
export default translations;
