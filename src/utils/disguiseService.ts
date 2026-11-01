/**
 * Disguise & Quick Exit Service for MAM-to-MAM AI
 * 
 * Provides:
 * 1. One-tap Quick Exit (instant redirection + history replacement to a neutral site)
 * 2. Keyboard shortcut for Quick Exit (double-tap Escape)
 * 3. Neutral App Name & Icon ("Disguise Mode" / "Stealth Mode"):
 *    - Changes document.title
 *    - Replaces favicon with neutral SVG
 *    - Updates header branding to Daily Notes, Quick Calc, or Daily Weather
 *    - Persists setting locally
 */

export type DisguiseProfileId = 'default' | 'notes' | 'calc' | 'weather';

export interface DisguiseProfile {
  id: DisguiseProfileId;
  name: string;
  tagline: string;
  documentTitle: string;
  iconType: 'heart' | 'note' | 'calc' | 'cloud';
  faviconSvg: string;
}

export const DISGUISE_PROFILES: Record<DisguiseProfileId, DisguiseProfile> = {
  default: {
    id: 'default',
    name: 'MAM-to-MAM AI',
    tagline: 'Ethiopian Sexual, Reproductive & Maternal Health Companion',
    documentTitle: 'MAM-to-MAM AI | Ethiopian Reproductive & Maternal Health',
    iconType: 'heart',
    faviconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231F3B8C"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  },
  notes: {
    id: 'notes',
    name: 'Daily Notes',
    tagline: 'Simple Offline Memo & Daily Checklist',
    documentTitle: 'Daily Notes - Personal Memo & Checklist',
    iconType: 'note',
    faviconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234B5563"><path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2zm4 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>`,
  },
  calc: {
    id: 'calc',
    name: 'Quick Calc',
    tagline: 'Basic Calculator & Metric Unit Converter',
    documentTitle: 'Calculator & Unit Converter',
    iconType: 'calc',
    faviconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23047857"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-6 2h4v2h-4V5zm-6 0h4v2H7V5zm0 4h4v2H7V9zm6 0h4v2h-4V9zm-6 4h4v2H7v-2zm6 0h4v6h-4v-6zm-6 4h4v2H7v-2z"/></svg>`,
  },
  weather: {
    id: 'weather',
    name: 'Daily Weather',
    tagline: 'Local Forecast & Regional Weather Index',
    documentTitle: 'Daily Weather - Local Forecast',
    iconType: 'cloud',
    faviconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230284C7"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
  },
};

const DISGUISE_STORAGE_KEY = 'mam_disguise_profile_id';
const QUICK_EXIT_URL = 'https://www.google.com';

class DisguiseService {
  private currentProfileId: DisguiseProfileId = 'default';
  private escapeTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DISGUISE_STORAGE_KEY) as DisguiseProfileId;
      if (saved && DISGUISE_PROFILES[saved]) {
        this.currentProfileId = saved;
      }
      this.applyProfile(this.currentProfileId);
      this.attachEscapeShortcut();
    }
  }

  public getActiveProfile(): DisguiseProfile {
    return DISGUISE_PROFILES[this.currentProfileId] || DISGUISE_PROFILES.default;
  }

  public setDisguise(profileId: DisguiseProfileId): DisguiseProfile {
    const profile = DISGUISE_PROFILES[profileId] || DISGUISE_PROFILES.default;
    this.currentProfileId = profile.id;
    try {
      localStorage.setItem(DISGUISE_STORAGE_KEY, profile.id);
    } catch {
      // ignore
    }
    this.applyProfile(profile.id);
    // Dispatch custom event so React components re-render immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mam-disguise-changed', { detail: profile }));
    }
    return profile;
  }

  public applyProfile(profileId: DisguiseProfileId) {
    if (typeof document === 'undefined') return;

    const profile = DISGUISE_PROFILES[profileId] || DISGUISE_PROFILES.default;

    // 1. Update Document Title
    document.title = profile.documentTitle;

    // 2. Update Dynamic Favicon
    try {
      let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(favicon);
      }
      favicon.href = `data:image/svg+xml,${encodeURIComponent(profile.faviconSvg)}`;
    } catch (e) {
      console.warn('Could not update dynamic favicon', e);
    }
  }

  /**
   * One-tap Quick Exit:
   * Immediately clears visible screen, replaces history state, and redirects to a neutral site.
   */
  public triggerQuickExit(destinationUrl: string = QUICK_EXIT_URL): void {
    if (typeof window === 'undefined') return;

    // 1. Immediately blank out body to prevent shoulder-surfers seeing sensitive text
    try {
      document.body.style.display = 'none';
    } catch {
      // ignore
    }

    // 2. Clear any sensitive active session tokens or modal states
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }

    // 3. Immediate window replacement (replaces history entry so Back button does not reveal health data)
    window.location.replace(destinationUrl);
  }

  /**
   * Listens for double-tap on Escape key within 700ms to instantly execute Quick Exit.
   */
  private attachEscapeShortcut(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (this.escapeTimer !== null) {
          // Second Escape pressed within 700ms -> Quick Exit!
          window.clearTimeout(this.escapeTimer);
          this.escapeTimer = null;
          this.triggerQuickExit();
        } else {
          this.escapeTimer = window.setTimeout(() => {
            this.escapeTimer = null;
          }, 700);
        }
      }
    });
  }
}

export const disguiseService = new DisguiseService();
