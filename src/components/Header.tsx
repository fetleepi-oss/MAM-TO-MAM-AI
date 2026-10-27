import React from 'react';
import { HeartHandshake, Globe, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { translations } from '../data/translations';
import { OfflineManager } from './OfflineManager';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenPrivacyModal: () => void;
  onOpenDangerModal: () => void;
  onOpenEmergencyModule?: () => void;
  onSimulateOfflineChange?: (isOffline: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenPrivacyModal,
  onOpenDangerModal,
  onOpenEmergencyModule,
  onSimulateOfflineChange,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 shadow-md">
      {/* Emergency Quick Action Bar */}
      <div className="bg-[#B91C1C] text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 animate-pulse" />
          <span className="truncate">Emergency? Dial 907 (Ambulance) or 8335 (Health Info)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {onOpenEmergencyModule && (
            <button
              onClick={onOpenEmergencyModule}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-red-800 hover:bg-red-900 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3 text-[#F59E0B]" />
              HIV, STI & Emergency
            </button>
          )}
          <button
            onClick={onOpenDangerModal}
            className="text-[11px] underline font-bold hover:text-amber-200 transition-colors cursor-pointer"
          >
            Check Danger Signs →
          </button>
        </div>
      </div>

      {/* Main Deep Blue Brand Bar */}
      <div className="bg-[#1F3B8C] text-white px-4 py-3 border-b border-[#182E6E]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#1F3B8C] rounded-[14px] flex items-center justify-center text-[#F59E0B]">
                <HeartHandshake className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  {t.appName}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-[#1F3B8C]">
                    POC
                  </span>
                </h1>
              </div>
              <p className="text-xs text-blue-100 font-medium line-clamp-1">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Offline Status, Install, Language Switcher & Privacy Shield */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Online / Offline Status Badge & Download Tool */}
            <OfflineManager onSimulateOfflineChange={onSimulateOfflineChange} />

            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {/* Language Switcher */}
            <div className="relative flex items-center bg-[#152861] border border-blue-400/30 rounded-xl px-2 py-1 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-[#F59E0B] mr-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                aria-label="Select language"
                className="bg-transparent text-white font-medium pr-1 outline-hidden cursor-pointer text-xs"
              >
                <option value="en" className="text-stone-900">English</option>
                <option value="am" className="text-stone-900">አማርኛ (Amharic)</option>
                <option value="om" className="text-stone-900">Afaan Oromoo</option>
                <option value="ti" className="text-stone-900">ትግርኛ (Tigrinya)</option>
              </select>
            </div>

            {/* Privacy Badge / Modal Trigger */}
            <button
              onClick={onOpenPrivacyModal}
              title="Click to view privacy terms"
              className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-100 transition-colors cursor-pointer min-h-[36px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">100% Private</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
