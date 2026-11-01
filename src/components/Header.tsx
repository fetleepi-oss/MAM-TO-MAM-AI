import React, { useState, useRef, useEffect } from 'react';
import {
  HeartHandshake,
  Globe,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Flag,
  Check,
  ChevronDown,
  LogOut,
  EyeOff,
  FileText,
  Calculator,
  Cloud
} from 'lucide-react';
import { LanguageCode, LanguageConfig } from '../types/srmh';
import { translations, AVAILABLE_LANGUAGES, getLanguageConfig } from '../data/translations/index';
import { OfflineManager } from './OfflineManager';
import { PWAInstallButton } from './PWAInstallButton';
import { disguiseService, DisguiseProfile } from '../utils/disguiseService';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenPrivacyModal: () => void;
  onOpenDangerModal: () => void;
  onOpenEmergencyModule?: () => void;
  onOpenTranslationReportModal?: (sectionName?: string) => void;
  onSimulateOfflineChange?: (isOffline: boolean) => void;
  onOpenPolicyCenter?: (sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenPrivacyModal,
  onOpenDangerModal,
  onOpenEmergencyModule,
  onOpenTranslationReportModal,
  onSimulateOfflineChange,
  onOpenPolicyCenter,
}) => {
  const t = translations[language] || translations.en;
  const currentLangConfig = getLanguageConfig(language);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [disguise, setDisguise] = useState<DisguiseProfile>(() => disguiseService.getActiveProfile());

  // Listen to disguise changes
  useEffect(() => {
    const handleDisguiseChange = (e: Event) => {
      const customEvent = e as CustomEvent<DisguiseProfile>;
      if (customEvent.detail) {
        setDisguise(customEvent.detail);
      }
    };
    window.addEventListener('mam-disguise-changed', handleDisguiseChange);
    return () => window.removeEventListener('mam-disguise-changed', handleDisguiseChange);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Reviewed
          </span>
        );
      case 'machine_translated':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            Machine-translated, awaiting review
          </span>
        );
      case 'not_available':
      default:
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300">
            Not yet available
          </span>
        );
    }
  };

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
          {/* Logo & Tagline (respects disguise profile) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#1F3B8C] rounded-[14px] flex items-center justify-center text-[#F59E0B]">
                {disguise.iconType === 'heart' && <HeartHandshake className="w-6 h-6" />}
                {disguise.iconType === 'note' && <FileText className="w-6 h-6 text-white" />}
                {disguise.iconType === 'calc' && <Calculator className="w-6 h-6 text-emerald-300" />}
                {disguise.iconType === 'cloud' && <Cloud className="w-6 h-6 text-sky-300" />}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  {disguise.id === 'default' ? t.appName : disguise.name}
                  {disguise.id === 'default' ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F59E0B] text-[#1F3B8C]">
                      POC
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-700 text-stone-200">
                      Disguise Active
                    </span>
                  )}
                </h1>
              </div>
              <p className="text-xs text-blue-100 font-medium line-clamp-1">
                {disguise.id === 'default' ? t.tagline : disguise.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Offline Status, Install, Language Switcher, Translation Report & Privacy Shield */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Online / Offline Status Badge & Download Tool */}
            <OfflineManager onSimulateOfflineChange={onSimulateOfflineChange} />

            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {/* Language Switcher with Status Labels */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer min-h-[36px]"
                aria-expanded={isLangMenuOpen}
                aria-haspopup="true"
                title="Select language and check clinical review status"
              >
                <Globe className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                <span className="truncate max-w-[100px]">{currentLangConfig.nativeName}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    currentLangConfig.status === 'reviewed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : currentLangConfig.status === 'machine_translated'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : 'bg-stone-500/20 text-stone-300 border border-stone-400/30'
                  }`}
                >
                  {currentLangConfig.status === 'reviewed'
                    ? 'Reviewed'
                    : currentLangConfig.status === 'machine_translated'
                    ? 'Awaiting Review'
                    : 'Scaffold'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Selection Popover */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-stone-900">Select Language & Review Tier</h4>
                      <p className="text-[10px] text-stone-500">Maternal health clinical translations for Ethiopia</p>
                    </div>
                    {onOpenTranslationReportModal && (
                      <button
                        onClick={() => {
                          setIsLangMenuOpen(false);
                          onOpenTranslationReportModal('Header Language Selector');
                        }}
                        className="text-[10px] font-bold text-[#1F3B8C] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Flag className="w-3 h-3 text-[#F59E0B]" />
                        Report error
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
                    {AVAILABLE_LANGUAGES.map((lang: LanguageConfig) => {
                      const isSelected = lang.code === language;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border border-blue-200 font-bold text-[#1F3B8C]'
                              : 'hover:bg-stone-50 text-stone-800'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">{lang.nativeName}</span>
                              <span className="text-[11px] text-stone-500 font-normal">({lang.name})</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                            </div>
                            <div className="pt-0.5 flex items-center gap-2">
                              {getStatusBadge(lang.status)}
                            </div>
                          </div>
                          {!lang.isClinicalReviewed && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-right shrink-0">
                              English medical fallback
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2.5 bg-blue-50/50 border-t border-stone-100 text-[10px] text-stone-600 flex items-center justify-between">
                    <span>Clinical safety: Emergency & HIV texts stay in reviewed English for scaffold languages.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Report a Translation Error Button */}
            {onOpenTranslationReportModal && (
              <button
                onClick={() => onOpenTranslationReportModal('Header Quick Action')}
                title="Report a translation error or medical wording improvement"
                className="flex items-center gap-1 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-100 hover:text-white transition-colors cursor-pointer min-h-[36px]"
              >
                <Flag className="w-3 h-3 text-[#F59E0B]" />
                <span className="hidden lg:inline">Report error</span>
              </button>
            )}

            {/* Privacy & Data Controls Modal Trigger */}
            <button
              onClick={onOpenPrivacyModal}
              title="View AI disclosure, export data, or change disguise"
              className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-100 transition-colors cursor-pointer min-h-[36px]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Privacy & Data</span>
            </button>

            {/* Policy Center Trigger */}
            {onOpenPolicyCenter && (
              <button
                onClick={() => onOpenPolicyCenter('privacy')}
                title="View review-ready templates: Privacy, Terms, Health Disclaimer, AI Transparency, etc."
                className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-200 transition-colors cursor-pointer min-h-[36px]"
              >
                <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden md:inline">Policy Center</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1 py-0.2 rounded font-bold uppercase tracking-tight">
                  Draft
                </span>
              </button>
            )}

            {/* One-Tap Quick Exit Button */}
            <button
              onClick={() => disguiseService.triggerQuickExit()}
              title="One-tap quick exit to Google • Shortcut: Press Esc twice"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-sm transition-all cursor-pointer min-h-[36px] active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5 text-white" />
              <span className="whitespace-nowrap">Quick Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
