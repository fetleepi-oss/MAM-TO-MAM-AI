import React from 'react';
import { PhoneCall } from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { translations } from '../data/translations';

interface FooterProps {
  language: LanguageCode;
  onOpenDangerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenDangerModal }) => {
  const t = translations[language];

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
          </div>
        </div>

        <div className="text-center text-[11px] text-stone-400 pt-2 border-t border-stone-100">
          No personal identifiers collected. Health tracker logs stored exclusively in local browser memory. Chat queries processed securely via Gemini AI without user identifiers.
        </div>
      </div>
    </footer>
  );
};
