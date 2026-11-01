import React, { useState } from 'react';
import { X, Languages, AlertCircle, CheckCircle2, MessageSquare, Send, BookOpen } from 'lucide-react';
import { LanguageCode, LanguageConfig } from '../types/srmh';
import { translations, AVAILABLE_LANGUAGES, TranslationErrorReport } from '../data/translations/index';
import { offlineStorage } from '../utils/offlineStorage';

interface TranslationErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  initialSection?: string;
  initialText?: string;
}

export const TranslationErrorReportModal: React.FC<TranslationErrorReportModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  initialSection = 'General UI',
  initialText = '',
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLanguage);
  const [section, setSection] = useState<string>(initialSection);
  const [originalText, setOriginalText] = useState<string>(initialText);
  const [suggestedCorrection, setSuggestedCorrection] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('community_user');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const t = translations[selectedLang] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestedCorrection.trim() && !originalText.trim()) return;

    setIsSubmitting(true);
    try {
      const report: TranslationErrorReport = {
        id: `trans_rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        language: selectedLang,
        section,
        originalText: originalText.trim(),
        suggestedCorrection: suggestedCorrection.trim(),
        userNote: userRole,
        timestamp: Date.now(),
        status: 'saved_locally',
      };

      // 1. Save to local storage list
      const savedReports = JSON.parse(localStorage.getItem('mam_translation_reports') || '[]');
      savedReports.unshift(report);
      localStorage.setItem('mam_translation_reports', JSON.stringify(savedReports.slice(0, 50)));

      // 2. Queue into IndexedDB sync queue
      try {
        await offlineStorage.enqueueSyncItem('report_translation_error', report);
      } catch (err) {
        console.warn('Queueing translation report to IndexedDB failed, stored in localStorage', err);
      }

      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSuggestedCorrection('');
    setOriginalText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="translation-modal-title"
      >
        {/* Header */}
        <div className="bg-[#1F3B8C] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F59E0B] text-[#1F3B8C] rounded-xl font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 id="translation-modal-title" className="font-extrabold text-base tracking-tight leading-snug">
                {t.reportModalTitle || 'Report Translation Error'}
              </h2>
              <p className="text-xs text-blue-100 font-medium line-clamp-1">
                {t.reportModalSubtitle || 'Help improve clinical and linguistic accuracy across Ethiopia'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close translation reporting modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">
                {t.reportSuccessTitle || 'Report Saved & Queued'}
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                {t.reportSuccessMsg ||
                  'Thank you! Your feedback has been stored locally and queued for maternal health linguist review.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="bg-[#1F3B8C] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#182E6E] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p>
                  Accurate clinical wording saves lives. Feedback is reviewed against Ethiopian Ministry of Health and WHO guidelines.
                </p>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.reportLanguageLabel || 'Language'}
                </label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 outline-hidden focus:ring-2 focus:ring-[#1F3B8C]"
                >
                  {AVAILABLE_LANGUAGES.map((lang: LanguageConfig) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name}) — {lang.statusLabel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Context */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.reportSectionLabel || 'Health Section or Screen'}
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 outline-hidden focus:ring-2 focus:ring-[#1F3B8C]"
                >
                  <option value="General UI">General App & Navigation</option>
                  <option value="LEARN: Education Topics">LEARN: Education Topics</option>
                  <option value="PREVENT: Family Planning">PREVENT: Family Planning</option>
                  <option value="MONITOR: Cycle & Pregnancy">MONITOR: Cycle & Pregnancy Tracker</option>
                  <option value="SEEK CARE: Triage & Facilities">SEEK CARE: Triage & Facilities</option>
                  <option value="HIV & STI Emergency Module">HIV, STI & Emergency Care</option>
                  <option value="Obstetric Danger Signs">Obstetric Danger Signs</option>
                  <option value="Ask MAM Chat Responses">Ask MAM Chat Responses</option>
                </select>
              </div>

              {/* Problematic Word or Phrase */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.reportWordPhraseLabel || 'Problematic Word or Phrase'}
                </label>
                <input
                  type="text"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  placeholder="e.g. Inaccurate term for contraception, bleeding, or triage..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 outline-hidden focus:ring-2 focus:ring-[#1F3B8C]"
                />
              </div>

              {/* Suggested Correction */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.reportSuggestionLabel || 'Suggested Correction or Better Phrasing'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={suggestedCorrection}
                  onChange={(e) => setSuggestedCorrection(e.target.value)}
                  placeholder="Provide the accurate phrasing, local dialect clarification, or clinical explanation..."
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-800 outline-hidden focus:ring-2 focus:ring-[#1F3B8C] resize-none"
                />
              </div>

              {/* Submitter Role */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Your Perspective (Optional)
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 outline-hidden"
                >
                  <option value="community_user">Community Member / Mother / Youth</option>
                  <option value="health_extension_worker">Health Extension Worker (HEW)</option>
                  <option value="midwife_or_nurse">Midwife / Nurse</option>
                  <option value="medical_officer">Medical Officer / Doctor</option>
                  <option value="linguist_translator">Linguist / Native Speaker</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {t.reportCancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !suggestedCorrection.trim()}
                  className="flex items-center gap-1.5 bg-[#1F3B8C] hover:bg-[#182E6E] disabled:opacity-50 text-white px-5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Saving...' : t.reportSubmit || 'Submit Translation Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
