import React from 'react';
import { AlertTriangle, Languages, ShieldCheck, Flag } from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { getLanguageConfig, isLanguageClinicalReviewed } from '../data/translations/index';

interface TranslationPendingBannerProps {
  language: LanguageCode;
  moduleName?: string;
  onOpenReportModal?: (sectionName?: string) => void;
}

export const TranslationPendingBanner: React.FC<TranslationPendingBannerProps> = ({
  language,
  moduleName = 'HIV, STI, Pregnancy & Emergency',
  onOpenReportModal,
}) => {
  const isReviewed = isLanguageClinicalReviewed(language);
  const langConfig = getLanguageConfig(language);

  // If the language is reviewed (en, am, om, ti), we don't display the pending warning
  if (isReviewed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs text-amber-950 mb-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-stone-950 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-extrabold text-sm text-stone-900 tracking-tight">
                Translation Pending Clinical Review
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                {langConfig.nativeName} ({langConfig.name}) — {langConfig.statusLabel}
              </span>
            </div>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              To protect maternal, neonatal, and clinical safety, all emergency danger signs, HIV PEP protocols,
              and pregnancy triage for <strong>{moduleName}</strong> are displayed in certified <strong>Reviewed English</strong>.
              The {langConfig.name} translation is currently undergoing maternal health specialist and clinical review.
            </p>
          </div>
        </div>

        {onOpenReportModal && (
          <button
            onClick={() => onOpenReportModal(moduleName)}
            className="shrink-0 flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-amber-400/40 shadow-xs"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>Report / Suggest Translation</span>
          </button>
        )}
      </div>
    </div>
  );
};
