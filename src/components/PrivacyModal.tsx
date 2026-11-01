import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Check,
  Download,
  Trash2,
  LogOut,
  EyeOff,
  Sparkles,
  Wifi,
  HardDrive,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { LanguageCode } from '../types/srmh';
import { translations } from '../data/translations/index';
import { offlineStorage } from '../utils/offlineStorage';
import { disguiseService, DISGUISE_PROFILES, DisguiseProfileId } from '../utils/disguiseService';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onDataDeleted?: () => void;
  onOpenPolicyCenter?: (sectionId?: string) => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  language,
  onDataDeleted,
  onOpenPolicyCenter,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'data' | 'disguise'>('privacy');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [currentDisguise, setCurrentDisguise] = useState<DisguiseProfileId>(() => {
    return disguiseService.getActiveProfile().id;
  });

  if (!isOpen) return null;

  const t = translations[language] || translations.en;

  const handleAcknowledge = () => {
    try {
      localStorage.setItem('mam_privacy_accepted', 'true');
    } catch {
      // Storage unavailable in restricted sandboxes
    }
    onClose();
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const jsonStr = await offlineStorage.exportAllUserData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mam_health_data_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.warn('Failed to export data', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteEverything = async () => {
    try {
      setIsDeleting(true);
      await offlineStorage.deleteAllUserData();
      setDeleteSuccess(true);
      setShowDeleteConfirm(false);
      onDataDeleted?.();
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.warn('Failed to delete everything', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectDisguise = (id: DisguiseProfileId) => {
    setCurrentDisguise(id);
    disguiseService.setDisguise(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4">
        {/* Header with Deep Blue */}
        <div className="bg-[#1F3B8C] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F59E0B] text-[#1F3B8C] rounded-2xl shadow-sm shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Privacy, Discretion & Data Controls
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  100% Confidential • Device-Only Storage • Zero Chat Logging
                </p>
              </div>
            </div>

            {/* Quick Exit Button directly in modal */}
            <button
              onClick={() => disguiseService.triggerQuickExit()}
              title="Leave site immediately (or press Esc twice)"
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quick Exit</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-5 border-b border-blue-400/20 pb-0">
            {[
              { id: 'privacy', label: 'AI & Privacy Policy', icon: ShieldCheck },
              { id: 'data', label: 'Export & Delete', icon: HardDrive },
              { id: 'disguise', label: 'Neutral App Disguise', icon: EyeOff },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1F3B8C] shadow-sm'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-stone-800 text-xs max-h-[65vh] overflow-y-auto">
          {/* TAB 1: AI & PRIVACY DISCLOSURE */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-[#1F3B8C] text-xs">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>What is sent to Google AI when online:</span>
                </div>
                <div className="space-y-1.5 text-stone-700 text-[11px] leading-relaxed">
                  <p>
                    • <strong>Your typed query & current session context:</strong> Sent securely to generate compassionate, evidence-based reproductive health answers.
                  </p>
                  <p>
                    • <strong>Selected language:</strong> (e.g. Amharic, Afaan Oromoo, Tigrinya, English) so the AI responds in your preferred language.
                  </p>
                  <p>
                    • <strong>Verified Ethiopian clinical guidelines:</strong> Matched topic protocols are included as background context so the model adheres to official WHO/Ministry of Health standards.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 font-black text-emerald-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>What is NEVER sent to Google AI or any remote server:</span>
                </div>
                <div className="space-y-1.5 text-stone-700 text-[11px] leading-relaxed">
                  <p>
                    ❌ <strong>Your Identity:</strong> No names, phone numbers, email addresses, or user accounts are collected or required.
                  </p>
                  <p>
                    ❌ <strong>Your Location & IP:</strong> No GPS coordinates or physical addresses are recorded or transmitted.
                  </p>
                  <p>
                    ❌ <strong>Your Cycle & Pregnancy Records:</strong> Cycle dates, symptoms, test results, and notes remain strictly inside your browser's IndexedDB.
                  </p>
                  <p>
                    ❌ <strong>Your Reminders & Facilities:</strong> Saved health centers and appointment check-ins are device-only.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 font-black text-amber-900 text-xs">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Zero Chat Content Logging:</span>
                </div>
                <p className="text-[11px] text-amber-950/90 leading-relaxed">
                  Our application server does not store, write, or log your chat conversations. Once the AI response is delivered, the server forgets the exchange immediately.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DATA CONTROLS (EXPORT & DELETE) */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-sm text-[#1F3B8C] flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-[#F59E0B]" />
                  Your Device-Only Data Rights
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Under strict privacy standards, you maintain complete ownership of every record stored on this device. You can export a full copy anytime or permanently purge all traces with one click.
                </p>
              </div>

              {/* Export My Data Button */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="font-extrabold text-xs text-stone-900">Export My Data</div>
                  <div className="text-[11px] text-stone-500">
                    Download a clean JSON file containing your cycle logs, pregnancy milestones, saved facilities, reminders, and settings.
                  </div>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{isExporting ? 'Preparing Export...' : 'Export My Data'}</span>
                </button>
              </div>

              {exportSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your complete health and tracker data was successfully exported to your device downloads!</span>
                </div>
              )}

              {/* Delete Everything Button */}
              <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-xs text-red-900">Delete Everything</div>
                  <div className="text-[11px] text-red-800/80">
                    Irreversibly wipe all local logs, cycle records, bookmarks, reminders, offline cache, and preferences from this browser.
                  </div>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Everything</span>
                </button>
              </div>

              {/* Deletion Confirmation Modal Dialog */}
              {showDeleteConfirm && (
                <div className="p-4 bg-red-100 border-2 border-red-500 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-black text-xs text-red-900">Are you absolutely sure?</div>
                      <div className="text-[11px] text-red-800 mt-0.5">
                        This action will immediately and permanently erase all on-device records (cycle tracker entries, pregnancy notes, saved clinics, and discreet reminders). This cannot be undone.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded-xl bg-white text-stone-700 font-bold text-xs border border-stone-300 hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteEverything}
                      disabled={isDeleting}
                      className="px-4 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs cursor-pointer shadow-sm"
                    >
                      {isDeleting ? 'Erasing Everything...' : 'Yes, Permanently Erase All Data'}
                    </button>
                  </div>
                </div>
              )}

              {deleteSuccess && (
                <div className="p-3 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>All local data has been permanently erased. Reloading cleanly...</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NEUTRAL APP NAME & ICON (DISGUISE MODE) */}
          {activeTab === 'disguise' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                <div className="font-extrabold text-xs text-[#1F3B8C] flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-[#F59E0B]" />
                  <span>Neutral App Name & Disguise Icon</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Sharing a phone or worried about shoulder-surfers? Disguise this app with a neutral utility title and icon (e.g. Daily Notes, Quick Calc). This updates the browser tab title, favicon, and header.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(DISGUISE_PROFILES) as DisguiseProfileId[]).map((profId) => {
                  const prof = DISGUISE_PROFILES[profId];
                  const isSelected = currentDisguise === profId;
                  return (
                    <button
                      key={profId}
                      type="button"
                      onClick={() => handleSelectDisguise(profId)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-blue-50 border-[#1F3B8C] ring-2 ring-[#1F3B8C]/40 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                          isSelected ? 'bg-[#1F3B8C] text-white' : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {prof.iconType === 'heart' && '🩺'}
                        {prof.iconType === 'note' && '📝'}
                        {prof.iconType === 'calc' && '🧮'}
                        {prof.iconType === 'cloud' && '⛅'}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-black text-xs text-stone-900 flex items-center gap-1.5">
                          <span>{prof.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight">
                          {prof.tagline}
                        </div>
                        <div className="text-[9px] font-mono text-stone-400 truncate pt-0.5">
                          Tab: {prof.documentTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Exit Keyboard Shortcut Tip */}
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
                <span>
                  <strong>Tip:</strong> Press the <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded font-mono text-[10px] font-bold">Esc</kbd> key twice rapidly from any screen to trigger <strong>Quick Exit</strong> immediately.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-stone-500">
              Current Disguise: <strong>{DISGUISE_PROFILES[currentDisguise]?.name}</strong>
            </div>
            {onOpenPolicyCenter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPolicyCenter('privacy');
                }}
                className="text-xs font-bold text-[#1F3B8C] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Full Policy Center (9 Policies) →</span>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleAcknowledge}
            className="px-6 py-2.5 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#F59E0B]" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
