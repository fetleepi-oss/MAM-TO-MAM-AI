import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Sparkles,
  Trash2,
  Cookie,
  HeartHandshake,
  Eye,
  HelpCircle,
  X,
  Search,
  Copy,
  Check,
  Download,
  ExternalLink,
  ChevronRight,
  LogOut,
  HardDrive,
  Info,
  Building,
  Mail,
  Phone,
  MapPin,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  POLICY_SECTIONS,
  POLICY_META,
  PolicySection
} from '../data/policyCenterData';
import { offlineStorage } from '../utils/offlineStorage';
import { disguiseService } from '../utils/disguiseService';

interface PolicyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSectionId?: string;
  onOpenTranslationReportModal?: (sectionName?: string) => void;
  onOpenPrivacyModal?: () => void;
}

export const PolicyCenterModal: React.FC<PolicyCenterModalProps> = ({
  isOpen,
  onClose,
  initialSectionId = 'privacy',
  onOpenTranslationReportModal,
  onOpenPrivacyModal,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(initialSectionId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'plain' | 'legal_template'>('plain');

  // Sync initialSectionId when modal opens with a specific section
  React.useEffect(() => {
    if (initialSectionId && POLICY_SECTIONS.some((s) => s.id === initialSectionId)) {
      setSelectedSectionId(initialSectionId);
    }
  }, [initialSectionId, isOpen]);

  // Icon selector helper
  const getSectionIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Trash2':
        return <Trash2 className={className} />;
      case 'Cookie':
        return <Cookie className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Eye':
        return <Eye className={className} />;
      case 'HelpCircle':
      default:
        return <HelpCircle className={className} />;
    }
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return POLICY_SECTIONS;
    const q = searchQuery.toLowerCase();
    return POLICY_SECTIONS.filter((section) => {
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchSummary = section.summary.toLowerCase().includes(q);
      const matchContent = section.sections.some(
        (s) => s.heading.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
      );
      return matchTitle || matchSummary || matchContent;
    });
  }, [searchQuery]);

  const activeSection: PolicySection = useMemo(() => {
    const found = POLICY_SECTIONS.find((s) => s.id === selectedSectionId);
    return found || POLICY_SECTIONS[0];
  }, [selectedSectionId]);

  if (!isOpen) return null;

  const handleCopyTemplate = () => {
    try {
      navigator.clipboard.writeText(activeSection.reviewReadyTemplate);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    } catch {
      // Fallback
    }
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
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (err) {
      console.warn('Failed to export', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const fullMarkdown = `# MAM-to-MAM AI Ethiopia - Comprehensive Policy Center
**Status:** ${POLICY_META.statusBanner}
**Last Updated:** ${POLICY_META.lastUpdated}
**Version:** ${POLICY_META.version}
**Legal Entity:** ${POLICY_META.organizationPlaceholder}
**Address:** ${POLICY_META.addressPlaceholder}
**Contact:** ${POLICY_META.emailPlaceholder} / ${POLICY_META.hotlinePlaceholder}

---

${POLICY_SECTIONS.map((sec) => sec.reviewReadyTemplate).join('\n\n---\n\n')}`;

    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MAM_Policy_Center_Templates_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-center-title"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* TOP STATUS BANNER: Mandatory "Draft, pending legal review." */}
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 border-b border-amber-600/40">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-stone-950 text-amber-300 text-[10px] uppercase tracking-wider font-black">
              Review Notice
            </span>
            <span className="font-extrabold tracking-tight">
              ⚠️ {POLICY_META.statusBanner}
            </span>
            <span className="hidden md:inline text-stone-800 text-[11px] font-medium">
              — Review-ready plain language templates with formal placeholders
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="bg-amber-600/30 px-2 py-0.5 rounded-md font-mono text-stone-950">
              v{POLICY_META.version}
            </span>
            <button
              onClick={() => disguiseService.triggerQuickExit()}
              title="Leave site immediately (Press Esc twice)"
              className="bg-red-700 hover:bg-red-800 text-white px-2 py-0.5 rounded font-black cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Quick Exit</span>
            </button>
          </div>
        </div>

        {/* Modal Deep Blue Navigation Header */}
        <div className="bg-[#1F3B8C] text-white p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#1F3B8C] rounded-[14px] flex items-center justify-center text-[#F59E0B]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h2 id="policy-center-title" className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>MAM-to-MAM AI Policy Center</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B] text-[#1F3B8C]">
                    9 Core Policies
                  </span>
                </h2>
                <p className="text-xs text-blue-100">
                  Plain-language compliance, sensitive health data rules, AI safety, and legal templates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                title="Download all 9 policy templates as a Markdown document"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] text-blue-100 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-400/30 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Export All (.md)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close Policy Center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar inside header */}
          <div className="relative mt-1">
            <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies (e.g., 'HIV', 'AI provider', 'Delete', 'Emergency', 'Cookies', 'Youth')..."
              className="w-full pl-9 pr-4 py-2 bg-[#152861]/80 hover:bg-[#152861] focus:bg-[#152861] text-xs text-white placeholder-blue-300 rounded-xl border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-300 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Body: Responsive 2-Column (Sidebar + Detail) */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-72 bg-stone-50 border-r border-stone-200 p-2 sm:p-3 overflow-y-auto max-h-48 md:max-h-none shrink-0 flex md:flex-col gap-1 overflow-x-auto">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 px-2 py-1 hidden md:block">
              Policy Templates ({filteredSections.length})
            </div>

            {filteredSections.map((section) => {
              const isSelected = section.id === activeSection.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSectionId(section.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-left transition-all cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 md:w-full ${
                    isSelected
                      ? 'bg-[#1F3B8C] text-white shadow-sm font-bold'
                      : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
                  }`}
                >
                  <span className={`${isSelected ? 'text-[#F59E0B]' : 'text-stone-500'}`}>
                    {getSectionIcon(section.iconName, 'w-3.5 h-3.5 shrink-0')}
                  </span>
                  <span className="flex-1 truncate">{section.shortLabel}</span>
                  {section.id === 'privacy' && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-tight ${
                      isSelected ? 'bg-[#F59E0B] text-[#1F3B8C]' : 'bg-red-100 text-red-800'
                    }`}>
                      HIV/STI
                    </span>
                  )}
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 hidden md:block shrink-0" />}
                </button>
              );
            })}

            {filteredSections.length === 0 && (
              <div className="p-4 text-xs text-stone-500 text-center">
                No policy matches &quot;{searchQuery}&quot;
              </div>
            )}

            {/* Quick Actions Panel at bottom of sidebar on desktop */}
            <div className="hidden md:block mt-auto pt-4 border-t border-stone-200 space-y-2">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
                <div className="font-extrabold flex items-center gap-1 text-[#1F3B8C]">
                  <Building className="w-3.5 h-3.5" />
                  <span>Legal Entities</span>
                </div>
                <p className="text-[10px] text-stone-600 leading-relaxed">
                  Placeholders <code className="bg-white px-1 py-0.5 rounded text-[#1F3B8C] font-mono text-[9px]">[Legal Name]</code> are ready for counsel insertion.
                </p>
              </div>

              {onOpenTranslationReportModal && (
                <button
                  onClick={() => onOpenTranslationReportModal('Policy Center')}
                  className="w-full text-left text-[11px] font-bold text-[#1F3B8C] hover:underline p-2 rounded-xl hover:bg-white flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Report policy or legal typo</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Main Policy Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white space-y-6">
            {/* Active Policy Header */}
            <div className="border-b border-stone-200 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#1F3B8C] border border-blue-100">
                    {getSectionIcon(activeSection.iconName, 'w-5 h-5')}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1F3B8C] tracking-tight">
                      {activeSection.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span>Status: <strong className="text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-bold">Draft, pending legal review</strong></span>
                      <span>•</span>
                      <span>Version: {activeSection.version}</span>
                      <span>•</span>
                      <span>Effective: {activeSection.effectiveDate}</span>
                    </div>
                  </div>
                </div>

                {/* View Mode Toggle & Copy Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 text-xs font-bold">
                    <button
                      onClick={() => setViewMode('plain')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'plain'
                          ? 'bg-white text-[#1F3B8C] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Plain Language
                    </button>
                    <button
                      onClick={() => setViewMode('legal_template')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'legal_template'
                          ? 'bg-white text-[#1F3B8C] shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Legal Template (.md)
                    </button>
                  </div>

                  <button
                    onClick={handleCopyTemplate}
                    title="Copy review-ready legal template to clipboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Copy Template</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-3 bg-stone-50 p-3 rounded-2xl border border-stone-200 leading-relaxed">
                <strong>Executive Summary:</strong> {activeSection.summary}
              </p>
            </div>

            {/* View Mode 1: Plain Language Explainer */}
            {viewMode === 'plain' ? (
              <div className="space-y-6">
                {/* Specific Callout for Sensitive Health Data if on Privacy Policy */}
                {activeSection.id === 'privacy' && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-red-900 font-extrabold text-sm">
                      <Lock className="w-4 h-4 text-red-700" />
                      <span>Dedicated Protection: Sensitive Health Data (HIV, STI & Pregnancy)</span>
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed">
                      To safeguard you against stigma or unintended disclosure, <strong>all HIV status disclosures, STI symptom checks, and pregnancy cycle records remain locked in your phone’s memory</strong>. We do NOT maintain a central user database.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-white p-3 rounded-2xl border border-red-100 shadow-xs">
                        <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5 mb-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>STAYS 100% ON YOUR DEVICE</span>
                        </div>
                        <ul className="text-[11px] text-stone-700 space-y-1 list-disc list-inside">
                          <li>Last menstrual period & cycle dates</li>
                          <li>Pregnancy week & gestational timeline</li>
                          <li>Daily symptom, pain & mood logs</li>
                          <li>Emergency triage answers</li>
                          <li>Saved health clinics & facilities</li>
                          <li>Custom reminder schedule</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded-2xl border border-red-100 shadow-xs">
                        <div className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>SENT TO AI PROVIDER (CHAT ONLY)</span>
                        </div>
                        <ul className="text-[11px] text-stone-700 space-y-1 list-disc list-inside">
                          <li>Your typed message in the chat</li>
                          <li>Recent active chat replies</li>
                          <li>Language code (Amharic/Oromo/Tigrinya/English)</li>
                          <li>Official WHO/FMoH guideline excerpts</li>
                          <li className="font-bold text-red-700 list-none pt-1">
                            🚫 NO names, phone numbers, IP, or GPS sent
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific Action Buttons if on Data Retention Policy */}
                {activeSection.id === 'data_retention' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                      <HardDrive className="w-4 h-4 text-emerald-700" />
                      <span>Exercise Your Data Rights Immediately</span>
                    </div>
                    <p className="text-xs text-emerald-900">
                      You do not have to wait or submit a ticket. Test or execute your data export and deletion rights directly below:
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isExporting ? 'Exporting...' : 'Export My Data (JSON)'}</span>
                      </button>

                      {exportSuccess && (
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Export downloaded to device</span>
                        </span>
                      )}

                      {onOpenPrivacyModal && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenPrivacyModal();
                          }}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Open Delete / Purge Controls</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Section Items */}
                {activeSection.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      sec.calloutType === 'alert'
                        ? 'bg-red-50/70 border-red-200 text-red-950'
                        : sec.calloutType === 'warning'
                        ? 'bg-amber-50/60 border-amber-200 text-stone-900'
                        : sec.calloutType === 'success'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : sec.calloutType === 'info'
                        ? 'bg-blue-50/60 border-blue-200 text-blue-950'
                        : 'bg-stone-50/50 border-stone-200 text-stone-800'
                    }`}
                  >
                    <h4 className="text-sm font-extrabold text-stone-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-[#1F3B8C] rounded-full inline-block" />
                      {sec.heading}
                    </h4>
                    <div className="text-xs leading-relaxed space-y-2 whitespace-pre-line text-stone-700 font-normal">
                      {sec.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* View Mode 2: Verbatim Review-Ready Legal Template */
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
                  <div>
                    <strong>Legal Counsel Review Template:</strong> Contains verbatim operational terms, legal placeholders, and jurisdiction clauses.
                  </div>
                  <button
                    onClick={handleCopyTemplate}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                  >
                    {copiedTemplate ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="bg-stone-950 text-stone-100 p-4 sm:p-5 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-stone-800 shadow-inner max-h-[500px]">
                  {activeSection.reviewReadyTemplate}
                </div>
              </div>
            )}

            {/* Standard Legal Placeholders Reference Card */}
            <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="font-extrabold text-stone-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#1F3B8C]" />
                <span>Institutional Placeholders in this Template</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate"><strong>Entity:</strong> {POLICY_META.organizationPlaceholder}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate"><strong>Address:</strong> {POLICY_META.addressPlaceholder}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate"><strong>DPO:</strong> {POLICY_META.dpoEmailPlaceholder}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate"><strong>Hotline:</strong> {POLICY_META.hotlinePlaceholder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-stone-50 border-t border-stone-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MAM-to-MAM AI Compliance & Clinical Safety Center • Ethiopia</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTemplate}
              className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold transition-colors cursor-pointer text-xs"
            >
              {copiedTemplate ? 'Copied!' : 'Copy Active Template'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold transition-colors cursor-pointer text-xs"
            >
              Close Policy Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
