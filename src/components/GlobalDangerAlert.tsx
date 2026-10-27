import React from 'react';
import { AlertOctagon, PhoneCall, X, ArrowRight, HeartPulse } from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { translations } from '../data/translations';

interface GlobalDangerAlertProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  detectedReason?: string;
}

export const GlobalDangerAlert: React.FC<GlobalDangerAlertProps> = ({
  isOpen,
  onClose,
  language,
  detectedReason,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-red-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-red-600 overflow-hidden my-4">
        {/* Full-screen style Red Warning Header */}
        <div className="bg-red-600 text-white p-6 sm:p-7 relative text-center">
          <div className="inline-flex p-3 bg-white text-red-600 rounded-full shadow-lg mb-3 animate-bounce">
            <AlertOctagon className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            {t.dangerModalTitle}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-semibold mt-1.5 max-w-md mx-auto">
            {t.dangerModalSubtitle}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-700/80 hover:bg-red-800 text-white transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trigger Reason Box */}
        {detectedReason && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-xs text-red-900 font-bold flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-red-600 shrink-0" />
            <span>Danger Sign Flagged: {detectedReason}</span>
          </div>
        )}

        {/* Action Steps & Free Calling Buttons */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
              Immediate Emergency Steps in Ethiopia:
            </h3>

            <div className="space-y-2 text-xs text-stone-800">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p className="leading-relaxed">
                  <strong>Do not delay or wait at home.</strong> Proceed immediately to your nearest Woreda Health Center or Hospital Emergency Room.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p className="leading-relaxed">
                  <strong>Bring a support companion</strong> and any maternal health booklets / ANC cards you have.
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p className="leading-relaxed">
                  If transport is unavailable, contact your <strong>Kebele Health Extension Worker (HEW)</strong> to arrange community ambulance referral.
                </p>
              </div>
            </div>
          </div>

          {/* Large Tap Emergency Hotline Buttons */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-stone-900 block">
              Tap to Call Verified Ethiopian Emergency Services:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="tel:907"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer min-h-[48px]"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  <span>907 Red Cross Ambulance</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="tel:8335"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer min-h-[48px]"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  <span>8335 FMoH Line</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <a
                href="tel:952"
                className="text-center py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 transition-colors"
              >
                952 Addis Ababa EMS [VERIFIED]
              </a>
              <a
                href="tel:6226"
                className="text-center py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 transition-colors"
              >
                6226 AWSAD Crisis Line [VERIFIED]
              </a>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center text-[11px] text-stone-600">
              For other regional crisis lines: <strong>[Verify with Ministry of Health: emergency number]</strong> via 8335
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-stone-500 text-center sm:text-left">
            Educational content based on WHO and Ministry of Health materials, pending clinical review.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs cursor-pointer shrink-0"
          >
            I Understand / Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
