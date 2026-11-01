import React from 'react';
import { PhoneCall, Flag, Globe } from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { translations, getLanguageConfig } from '../data/translations/index';

interface FooterProps {
  language: LanguageCode;
  onOpenDangerModal: () => void;
  onOpenTranslationReportModal?: (section?: string) => void;
  onOpenPolicyCenter?: (sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenDangerModal,
  onOpenTranslationReportModal,
  onOpenPolicyCenter,
}) => {
  const t = translations[language] || translations.en;
  const langConfig = getLanguageConfig(language);

  return (
    <footer className="bg-white border-t border-stone-200 mt-12 py-8 text-xs text-stone-600">
      <div className="max-w-5xl mx-auto px-4 space-y-4">
        {/* Mandatory MVP note */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center font-medium text-amber-900">
          ⚠️ <strong>{t.footerNote}</strong>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1F3B8C] text-[#F59E0B] flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-bold text-[#1F3B8C]">MAM-to-MAM AI Ethiopia</span>
            <span className="text-stone-400">|</span>
            <span className="text-stone-500 font-medium">Educational content based on WHO and Ministry of Health materials, pending clinical review.</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center text-[11px]">
            <a href="tel:907" className="font-bold text-red-700 hover:underline flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>Red Cross: 907 [VERIFIED]</span>
            </a>
            <span className="text-stone-300">•</span>
            <a href="tel:8335" className="font-bold text-[#1F3B8C] hover:underline flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>FMoH Line: 8335 [VERIFIED]</span>
            </a>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={onOpenDangerModal}
              className="text-red-600 font-bold hover:underline cursor-pointer"
            >
              Emergency Danger Signs
            </button>
            {onOpenTranslationReportModal && (
              <>
                <span className="text-stone-300">•</span>
                <button
                  type="button"
                  onClick={() => onOpenTranslationReportModal('Footer link')}
                  className="text-[#1F3B8C] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Flag className="w-3 h-3 text-[#F59E0B]" />
                  <span>{t.reportTranslationError || 'Report a translation error'}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Policy Center Direct Links */}
        {onOpenPolicyCenter && (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-[#1F3B8C]">
              <span>Policy Center:</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-extrabold">
                Draft, pending legal review
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500">
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('privacy')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Privacy & Sensitive Health Data
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('terms')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Terms of Service
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('health_disclaimer')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Health Disclaimer
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('ai_transparency')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                AI Transparency
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('data_retention')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Data Retention & Deletion
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('cookies_tracking')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Cookies & Tracking
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('child_safety')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Child Safety
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('accessibility')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Accessibility
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={() => onOpenPolicyCenter('complaints_contact')}
                className="hover:text-[#1F3B8C] hover:underline cursor-pointer font-medium"
              >
                Complaints & Contact
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Active language: <strong>{langConfig.nativeName} ({langConfig.name})</strong> — Status:{' '}
            <span className="font-semibold">{langConfig.statusLabel}</span>
          </div>
          <div>
            No personal identifiers collected. Health tracker logs stored exclusively in local browser memory.
          </div>
        </div>
      </div>
    </footer>
  );
};
