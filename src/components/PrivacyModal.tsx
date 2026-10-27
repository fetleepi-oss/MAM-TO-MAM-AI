import React from 'react';
import { ShieldCheck, Lock, Check } from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { translations } from '../data/translations';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const handleAcknowledge = () => {
    try {
      localStorage.setItem('mam_privacy_accepted', 'true');
    } catch {
      // Storage unavailable in restricted sandboxes
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header with Deep Blue */}
        <div className="bg-[#1F3B8C] text-white p-6 relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#F59E0B] text-[#1F3B8C] rounded-2xl shadow-sm shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {t.privacyModalTitle}
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Anonymous & Confidential by Design • Transparent AI Processing
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-stone-800 text-sm">
          <p className="font-semibold text-stone-900 leading-relaxed">
            {t.privacyModalIntro}
          </p>

          <div className="space-y-3 pt-1">
            {t.privacyModalBullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                <div className="mt-0.5 p-1 bg-emerald-100 text-emerald-800 rounded-full shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {bullet}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 space-y-1.5 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Lock className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>What is kept local vs. sent to AI:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-900/90 font-medium">
              <strong>Local on this device:</strong> Your cycle logs, pregnancy tracker, and questionnaire selections remain strictly in this browser.
            </p>
            <p className="leading-relaxed text-[11px] text-amber-900/90 font-medium">
              <strong>Sent to Gemini AI:</strong> When you send a message in the Ask MAM chat, your prompt text is sent securely to Google Gemini AI to generate the health guidance. Zero personal identifiers (no names, numbers, or IPs) are attached or saved.
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={handleAcknowledge}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-sm shadow-md transition-all cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-[#F59E0B]" />
            <span>{t.privacyModalButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
