import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  HeartPulse,
  Baby,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Printer,
  Sparkles,
  PhoneCall,
  Info,
  Search,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  Bell,
  HelpCircle,
  Eye,
  EyeOff,
  Flag,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { LanguageCode } from '../../types/srmh';
import {
  TIME_SENSITIVE_EMERGENCIES,
  COMPREHENSIVE_HEALTH_SECTIONS,
  GUIDED_QUESTIONNAIRES,
  REGIONAL_CARE_FACILITIES,
  TimeSensitiveEmergency,
  EducationalSection,
  GuidedQuestionnaire,
  CareFacilityEntry,
} from '../../data/emergencyAndHivData';
import { MASTER_CONTENT_LIBRARY, ContentEntry } from '../../data/content/index';
import { offlineStorage, HealthReminder } from '../../utils/offlineStorage';
import { TranslationPendingBanner } from '../TranslationPendingBanner';
import { isLanguageClinicalReviewed } from '../../data/translations/index';

interface HivStiPregnancyEmergencyModuleProps {
  language: LanguageCode;
  initialTab?: 'guides' | 'emergencies' | 'triage' | 'locator' | 'reminders' | 'provider_checklist';
  onAskQuestion: (prompt: string) => void;
  onTriggerDangerAlert: (reason: string) => void;
  onOpenTranslationReportModal?: (sectionName?: string) => void;
}

export const HivStiPregnancyEmergencyModule: React.FC<HivStiPregnancyEmergencyModuleProps> = ({
  language,
  initialTab = 'emergencies',
  onAskQuestion,
  onTriggerDangerAlert,
  onOpenTranslationReportModal,
}) => {
  const isReviewed = isLanguageClinicalReviewed(language);
  const [activeTab, setActiveTab] = useState<'guides' | 'emergencies' | 'triage' | 'locator' | 'reminders' | 'provider_checklist'>(initialTab);

  // Filter for Content Library (all 7 topics)
  const [guideTopic, setGuideTopic] = useState<'all' | 'hiv' | 'stis' | 'pregnancy' | 'postnatal' | 'contraception' | 'emergencies' | 'menstrual_health'>('all');
  const [guideStatusFilter, setGuideStatusFilter] = useState<'all' | 'approved' | 'clinician-reviewed' | 'draft'>('all');
  const [expandedContentId, setExpandedContentId] = useState<string | null>('hiv_pep_emergency_72h');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('pep_72h');
  const [searchFilter, setSearchFilter] = useState('');

  // Questionnaire / Device-Only Triage State
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string>('quest_pregnancy_danger');
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, { score: 'red' | 'amber' | 'green'; reason: string; label: string }>>({});
  const [surveySubmitted, setSurveySubmitted] = useState<boolean>(false);

  // Testing & Care Locator State
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [userLocationSimulated, setUserLocationSimulated] = useState<boolean>(false);

  // Reminders State (stored in IndexedDB)
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderType, setReminderType] = useState<'anc_visit' | 'test_followup' | 'treatment_adherence'>('anc_visit');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNotes, setReminderNotes] = useState('');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);

  // "What to Tell the Provider" checklist custom items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    symptom_duration: true,
    bleeding_count: true,
    current_meds: false,
    hiv_last_test: false,
    pregnancy_weeks: false,
  });

  const [savedFacilityIds, setSavedFacilityIds] = useState<string[]>([]);

  // Load reminders & saved facilities from offline storage on mount
  useEffect(() => {
    async function loadOfflineData() {
      try {
        const loaded = await offlineStorage.getReminders();
        setReminders(loaded);
      } catch (err) {
        console.warn('Could not load offline reminders', err);
      }
      try {
        const saved = await offlineStorage.getSavedFacilities();
        setSavedFacilityIds(saved.map((f) => f.id));
      } catch (err) {
        console.warn('Could not load saved facilities', err);
      }
    }
    loadOfflineData();
  }, []);

  const handleToggleSaveFacility = async (fac: CareFacilityEntry) => {
    const isCurrentlySaved = savedFacilityIds.includes(fac.id);
    if (isCurrentlySaved) {
      await offlineStorage.removeSavedFacility(fac.id);
      setSavedFacilityIds((prev) => prev.filter((id) => id !== fac.id));
    } else {
      await offlineStorage.saveFacility(fac as any);
      setSavedFacilityIds((prev) => [...prev, fac.id]);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enforce discretion: automatically sanitize titles so sensitive terms (HIV, STI, pregnancy) never appear
    let sanitizedTitle = reminderTitle.trim();
    const sensitiveWords = [/hiv/gi, /sti/gi, /syphilis/gi, /gonorrhea/gi, /pregnancy/gi, /pregnant/gi, /pep/gi, /prep/gi, /abortion/gi];
    for (const pattern of sensitiveWords) {
      sanitizedTitle = sanitizedTitle.replace(pattern, 'Care');
    }
    sanitizedTitle = sanitizedTitle.replace(/\s+/g, ' ').trim();
    if (!sanitizedTitle) sanitizedTitle = 'Scheduled Health Check-in';

    let sanitizedNotes = reminderNotes.trim();
    for (const pattern of sensitiveWords) {
      sanitizedNotes = sanitizedNotes.replace(pattern, 'Care');
    }

    const newReminder: HealthReminder = {
      id: `rem_${Date.now()}`,
      type: reminderType,
      title: sanitizedTitle,
      dueDate: reminderDate,
      notes: sanitizedNotes,
      completed: false,
      createdAt: Date.now(),
    };

    await offlineStorage.saveReminder(newReminder);
    setReminders((prev) => [...prev, newReminder]);
    setReminderTitle('');
    setReminderDate('');
    setReminderNotes('');
    setShowAddReminderModal(false);
  };

  const handleDeleteReminder = async (id: string) => {
    await offlineStorage.removeReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleReminder = async (reminder: HealthReminder) => {
    const updated = { ...reminder, completed: !reminder.completed };
    await offlineStorage.saveReminder(updated);
    setReminders((prev) => prev.map((r) => (r.id === reminder.id ? updated : r)));
  };

  // Evaluate rule-based device-only triage
  const currentQuestionnaire = GUIDED_QUESTIONNAIRES.find((q) => q.id === selectedQuestionnaireId) || GUIDED_QUESTIONNAIRES[0];

  const handleAnswerQuestion = (qId: string, option: { score: 'red' | 'amber' | 'green'; reason: string; label: string }) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  const calculateTriageOutcome = () => {
    const answerValues = Object.values(surveyAnswers);
    const hasRed = answerValues.some((a) => a.score === 'red');
    const hasAmber = answerValues.some((a) => a.score === 'amber');

    const redReasons = answerValues.filter((a) => a.score === 'red').map((a) => a.reason);
    const amberReasons = answerValues.filter((a) => a.score === 'amber').map((a) => a.reason);

    if (hasRed) {
      return {
        color: 'red' as const,
        title: 'IMMEDIATE EMERGENCY: Go to a Health Facility Now',
        action: 'DO NOT WAIT. Proceed immediately to the nearest Emergency Department or Maternity Hospital.',
        reasons: redReasons,
      };
    }
    if (hasAmber) {
      return {
        color: 'amber' as const,
        title: 'SEE A CLINICIAN SOON (Within 24 to 48 Hours)',
        action: 'Schedule a visit at your local Health Center or Kebele Health Post for clinical evaluation.',
        reasons: amberReasons,
      };
    }
    return {
      color: 'green' as const,
      title: 'ROUTINE CARE & SELF-MONITORING (Healthy State)',
      action: 'No critical red-flag danger signs detected. Continue routine preventive care and healthy nutrition.',
      reasons: ['No acute or urgent symptoms reported.'],
    };
  };

  const handlePrintProviderSummary = () => {
    window.print();
  };

  // Filter facilities
  const filteredFacilities = REGIONAL_CARE_FACILITIES.filter((f) => {
    const matchRegion =
      selectedRegion === 'Saved Facilities'
        ? savedFacilityIds.includes(f.id)
        : selectedRegion === 'All Regions' || f.region === selectedRegion;
    const matchService =
      serviceFilter === 'all' ||
      (serviceFilter === 'yfs' && f.isYouthFriendly) ||
      (serviceFilter === 'onestop' && f.hasOneStopCenter) ||
      (serviceFilter === 'emergency_delivery' && f.hasEmergencyDelivery) ||
      (serviceFilter === 'pep' && f.hasHivPep);
    return matchRegion && matchService;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Dedicated Module Header */}
      <div className="bg-gradient-to-r from-[#1F3B8C] via-[#1b3275] to-[#122353] text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-blue-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B] text-[#1F3B8C] font-black text-xs uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Dedicated Clinical Module • 100% Offline Capable
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              HIV, STI, Pregnancy & Emergency Care
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-2xl mt-1 leading-relaxed">
              Reviewed educational guidance, time-sensitive PEP and emergency contraception windows, device-only rule-based triage, and verified Ethiopian resources.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('triage');
                setSelectedQuestionnaireId('quest_pregnancy_danger');
              }}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
              Check Danger Signs
            </button>
            <button
              onClick={() => setActiveTab('emergencies')}
              className="px-3.5 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-[#1F3B8C] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              72h Time-Critical PEP
            </button>
          </div>
        </div>

        {/* Clinical Disclaimer Tag */}
        <div className="mt-4 pt-3 border-t border-blue-400/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-200">
          <span className="font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-300" />
            Educational content based on WHO and Ministry of Health materials, pending clinical review.
          </span>
          <span className="bg-blue-950/60 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300">
            Device-Only Triage • Zero External Logs
          </span>
        </div>
      </div>

      {/* Clinical Review Status Guard: HIV, STI, Pregnancy & Emergency content */}
      <TranslationPendingBanner
        language={language}
        moduleName="HIV, STI, Pregnancy & Emergency"
        onOpenReportModal={onOpenTranslationReportModal}
      />

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {[
          { key: 'emergencies', label: 'Time-Sensitive Emergencies', icon: Clock, count: '4' },
          { key: 'triage', label: 'Guided Offline Triage', icon: AlertTriangle, count: '3' },
          { key: 'guides', label: 'Reviewed Health Library', icon: FileText, count: '7' },
          { key: 'provider_checklist', label: 'Clinician Summary', icon: Printer, count: null },
          { key: 'locator', label: 'Testing & Care Locator', icon: MapPin, count: '8' },
          { key: 'reminders', label: 'Discreet Reminders', icon: Bell, count: reminders.length > 0 ? String(reminders.length) : null },
        ].map(({ key, label, icon: Icon, count }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold tracking-tight whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#1F3B8C] text-white shadow-sm ring-2 ring-[#F59E0B]/50'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-stone-500'}`} />
              <span>{label}</span>
              {count && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#F59E0B] text-[#1F3B8C]' : 'bg-stone-300 text-stone-800'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: TIME-SENSITIVE EMERGENCY CARDS */}
      {activeTab === 'emergencies' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-extrabold block text-sm">Why Timing Matters:</span>
              Emergency medicine operates on strict physiological timeframes. PEP works best when started within hours and becomes ineffective after 72 hours. Emergency contraception is most effective within 24 hours. Obstetric danger signs require immediate hospital evaluation.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIME_SENSITIVE_EMERGENCIES.map((em) => {
              const isUrgent = em.urgencyLevel === 'CRITICAL_HOURS' || em.urgencyLevel === 'IMMEDIATE_EMERGENCY';
              const isExpanded = expandedSectionId === em.id;

              return (
                <div
                  key={em.id}
                  className={`rounded-3xl p-5 border transition-all ${
                    isUrgent
                      ? 'bg-white border-red-200 shadow-sm hover:border-red-400'
                      : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        em.windowHours === 72
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : em.windowHours === 120
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-600 text-white animate-pulse'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {em.windowHours > 0 ? `Strictly within ${em.windowHours} Hours` : 'Immediate Red Alert'}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium line-clamp-1">
                      {em.source.split('&')[0]}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#1F3B8C] leading-tight mb-1">
                    {em.title}
                  </h3>

                  {!isReviewed && (
                    <div className="mb-2.5 p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-[11px] font-semibold flex items-center justify-between gap-1">
                      <span>⚠️ Translation pending clinical review • Showing verified English</span>
                      {onOpenTranslationReportModal && (
                        <button
                          type="button"
                          onClick={() => onOpenTranslationReportModal(`Emergency: ${em.title}`)}
                          className="text-[10px] text-[#1F3B8C] font-bold underline hover:text-blue-900 shrink-0 cursor-pointer"
                        >
                          Report error
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-xs font-bold text-red-700 bg-red-50 p-2 rounded-xl mb-3 border border-red-100">
                    {em.headline}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {em.explanation}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-extrabold uppercase text-stone-700">Immediate Actions:</div>
                    <ul className="text-xs text-stone-700 space-y-1.5">
                      {em.immediateActions.map((act, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Referral & Hotlines */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <div className="text-[11px] font-bold text-[#1F3B8C] flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Confidential Hotlines & Where to Go:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {em.confidentialHotlines.map((h, hIdx) => (
                        <span
                          key={hIdx}
                          className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${
                            h.verified ? 'bg-blue-100 text-[#1F3B8C]' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {h.name}: <strong className="font-black">{h.number}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => onAskQuestion(`What should I know about ${em.title}?`)}
                      className="text-xs font-bold text-[#1F3B8C] hover:text-[#F59E0B] flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Ask MAM AI
                    </button>
                    {em.windowHours === 0 && (
                      <button
                        onClick={() => onTriggerDangerAlert('Obstetric emergency danger signs check')}
                        className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                      >
                        Open Emergency Modal →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GUIDED OFFLINE-CAPABLE QUESTIONNAIRES (DEVICE-ONLY TRIAGE) */}
      {activeTab === 'triage' && (
        <div className="space-y-5">
          {/* Questionnaire Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {GUIDED_QUESTIONNAIRES.map((q) => {
              const isSelected = selectedQuestionnaireId === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestionnaireId(q.id);
                    setSurveyAnswers({});
                    setSurveySubmitted(false);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F3B8C] text-white border-[#1F3B8C] shadow-md ring-2 ring-[#F59E0B]/50'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="font-extrabold text-xs tracking-tight">{q.title}</div>
                  <div className={`text-[10px] mt-1 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                    {q.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Questionnaire Container */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  100% Offline Rule Engine
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">
                  Zero server calls • Device evaluation only
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#1F3B8C]">
                {currentQuestionnaire.title}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                {currentQuestionnaire.description}
              </p>

              {!isReviewed && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>⚠️ Triage questions pending clinical review. Displaying certified English protocol.</span>
                  {onOpenTranslationReportModal && (
                    <button
                      type="button"
                      onClick={() => onOpenTranslationReportModal(`Triage: ${currentQuestionnaire.title}`)}
                      className="text-[11px] text-[#1F3B8C] font-bold underline shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      Report error
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Questions list */}
            <div className="space-y-5">
              {currentQuestionnaire.questions.map((quest, qIdx) => {
                const currentAns = surveyAnswers[quest.id];
                return (
                  <div key={quest.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <div className="text-xs font-black text-[#1F3B8C] mb-2.5 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1F3B8C] text-white text-[11px] flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <span>{quest.text}</span>
                    </div>

                    <div className="space-y-2 pl-7">
                      {quest.options.map((opt, oIdx) => {
                        const isChosen = currentAns?.label === opt.label;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isChosen
                                ? opt.score === 'red'
                                  ? 'bg-red-50 border-red-500 text-red-950 font-bold ring-2 ring-red-400/50'
                                  : opt.score === 'amber'
                                  ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400/50'
                                  : 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400/50'
                                : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                            }`}
                          >
                            <input
                              type="radio"
                              name={quest.id}
                              checked={isChosen}
                              onChange={() => handleAnswerQuestion(quest.id, opt)}
                              className="mt-0.5 accent-[#1F3B8C]"
                            />
                            <div className="flex-1">
                              <div>{opt.label}</div>
                              {isChosen && (
                                <div className="text-[11px] font-medium mt-1 text-stone-600">
                                  <strong>Clinical note:</strong> {opt.reason}
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evaluate Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
              <span className="text-xs text-stone-500">
                Answered: {Object.keys(surveyAnswers).length} of {currentQuestionnaire.questions.length} questions
              </span>

              <button
                disabled={Object.keys(surveyAnswers).length === 0}
                onClick={() => {
                  setSurveySubmitted(true);
                  const outcome = calculateTriageOutcome();
                  if (outcome.color === 'red') {
                    onTriggerDangerAlert(outcome.title + ' — ' + outcome.action);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] disabled:bg-stone-300 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4 text-[#F59E0B]" />
                Evaluate Device Triage Now
              </button>
            </div>

            {/* Triage Assessment Result Box */}
            {surveySubmitted && (
              <div
                className={`p-5 rounded-3xl border-2 transition-all ${
                  calculateTriageOutcome().color === 'red'
                    ? 'bg-red-50 border-red-600 text-red-950'
                    : calculateTriageOutcome().color === 'amber'
                    ? 'bg-amber-50 border-amber-600 text-amber-950'
                    : 'bg-emerald-50 border-emerald-600 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full text-white ${
                      calculateTriageOutcome().color === 'red'
                        ? 'bg-red-700'
                        : calculateTriageOutcome().color === 'amber'
                        ? 'bg-amber-700'
                        : 'bg-emerald-700'
                    }`}
                  >
                    Result: {calculateTriageOutcome().color.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-bold">Rule-based Device Determination</span>
                </div>

                <h4 className="font-black text-base sm:text-lg mb-1">
                  {calculateTriageOutcome().title}
                </h4>
                <p className="text-xs font-bold leading-relaxed mb-3">
                  {calculateTriageOutcome().action}
                </p>

                <div className="space-y-1 text-xs">
                  <span className="font-extrabold uppercase text-[11px]">Identified Clinical Reasons:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {calculateTriageOutcome().reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>

                {calculateTriageOutcome().color === 'red' && (
                  <div className="mt-4 p-3 bg-red-100 rounded-xl border border-red-300 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-red-900">
                      Emergency hotlines: Dial 907 (Red Cross Ambulance) or 8335 (FMoH)
                    </span>
                    <button
                      onClick={() => onTriggerDangerAlert('Immediate emergency triage flagged')}
                      className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs shrink-0 cursor-pointer"
                    >
                      Open Full Red Alert
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STRUCTURED JSON CONTENT LIBRARY (ALL 7 TOPICS) */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {/* Header Description */}
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-[#1F3B8C] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#F59E0B]" />
                <span>Verified Topic Content Library (7 JSON Clinical Archives)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  Indexed & Offline-Cached
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Each topic is version-controlled, source-attributed, and categorized as <strong>Approved</strong>, <strong>Clinician-Reviewed</strong>, or <strong>Draft</strong>.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Approved First
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-1.5" /> Clinician-Reviewed
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ml-1.5" /> Draft
            </div>
          </div>

          {/* 7 Topics Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { key: 'all', label: 'All 7 Topics', count: MASTER_CONTENT_LIBRARY.length },
              { key: 'hiv', label: 'HIV', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'HIV').length },
              { key: 'stis', label: 'STIs', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'STIs').length },
              { key: 'pregnancy', label: 'Pregnancy', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'Pregnancy').length },
              { key: 'postnatal', label: 'Postnatal', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'Postnatal').length },
              { key: 'contraception', label: 'Contraception', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'Contraception').length },
              { key: 'emergencies', label: 'Emergencies', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'Emergencies').length },
              { key: 'menstrual_health', label: 'Menstrual Health', count: MASTER_CONTENT_LIBRARY.filter(e => e.topic === 'Menstrual Health').length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setGuideTopic(key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  guideTopic === key
                    ? 'bg-[#1F3B8C] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${guideTopic === key ? 'bg-[#F59E0B] text-[#1F3B8C]' : 'bg-stone-200 text-stone-700'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary filter: Review Status & Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-stone-500 mr-1">Status:</span>
              {[
                { key: 'all', label: 'All Statuses' },
                { key: 'approved', label: 'Approved Only' },
                { key: 'clinician-reviewed', label: 'Clinician-Reviewed' },
                { key: 'draft', label: 'Drafts' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setGuideStatusFilter(key as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                    guideStatusFilter === key
                      ? 'bg-stone-800 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search across all 7 topic JSON files..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-hidden focus:border-[#1F3B8C]"
              />
            </div>
          </div>

          {/* JSON Content Entries List with Approved First sorting */}
          <div className="space-y-3">
            {MASTER_CONTENT_LIBRARY
              .filter((entry) => {
                // Topic filter
                if (guideTopic !== 'all') {
                  const topicMap: Record<string, string> = {
                    hiv: 'HIV',
                    stis: 'STIs',
                    pregnancy: 'Pregnancy',
                    postnatal: 'Postnatal',
                    contraception: 'Contraception',
                    emergencies: 'Emergencies',
                    menstrual_health: 'Menstrual Health',
                  };
                  if (entry.topic !== topicMap[guideTopic]) return false;
                }

                // Review status filter
                if (guideStatusFilter !== 'all' && entry.reviewStatus !== guideStatusFilter) {
                  return false;
                }

                // Search query filter
                if (searchFilter) {
                  const q = searchFilter.toLowerCase();
                  const inTitle = entry.title.toLowerCase().includes(q);
                  const inSummary = entry.summary ? entry.summary.toLowerCase().includes(q) : false;
                  const inOrg = entry.sourceOrganization.toLowerCase().includes(q);
                  const inKeywords = entry.keywords ? entry.keywords.some((k) => k.toLowerCase().includes(q)) : false;
                  if (!inTitle && !inSummary && !inOrg && !inKeywords) return false;
                }

                return true;
              })
              .sort((a, b) => {
                // Approved first, then clinician-reviewed, then draft
                const score = (st: string) => (st === 'approved' ? 3 : st === 'clinician-reviewed' ? 2 : 1);
                return score(b.reviewStatus) - score(a.reviewStatus);
              })
              .map((entry) => {
                const isExpanded = expandedContentId === entry.id;
                return (
                  <div
                    key={entry.id}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all ${
                      entry.reviewStatus === 'approved'
                        ? 'border-emerald-200/80 shadow-xs hover:border-emerald-400'
                        : entry.reviewStatus === 'clinician-reviewed'
                        ? 'border-blue-200/80 shadow-xs hover:border-blue-400'
                        : 'border-amber-200/80 bg-amber-50/20 shadow-xs hover:border-amber-400'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedContentId(isExpanded ? null : entry.id)}
                      className="flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="space-y-1 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Topic Pill */}
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 text-[#1F3B8C]">
                            {entry.topic}
                          </span>

                          {/* Review Status Badge */}
                          {entry.reviewStatus === 'approved' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          )}
                          {entry.reviewStatus === 'clinician-reviewed' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#1F3B8C] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                              Clinician-Reviewed
                            </span>
                          )}
                          {entry.reviewStatus === 'draft' && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Not yet reviewed
                            </span>
                          )}

                          {/* Version Tag */}
                          <span className="text-[10px] font-mono text-stone-400 font-medium">
                            {entry.version}
                          </span>

                          {/* Last Reviewed Date */}
                          <span className="text-[10px] text-stone-400 flex items-center gap-1 ml-auto">
                            <Clock className="w-3 h-3" />
                            Reviewed: {entry.lastReviewedDate}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-extrabold text-sm sm:text-base text-[#1F3B8C] pt-1">
                          {entry.title}
                        </h3>

                        {/* Language pending review guard */}
                        {!isReviewed && (
                          <div className="my-1.5 p-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-[10px] font-semibold flex items-center justify-between gap-1">
                            <span>⚠️ Translation pending review • Showing verified English</span>
                            {onOpenTranslationReportModal && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenTranslationReportModal(`Library: ${entry.title}`);
                                }}
                                className="text-[#1F3B8C] font-bold underline hover:text-blue-900 cursor-pointer"
                              >
                                Report
                              </span>
                            )}
                          </div>
                        )}

                        {/* Summary */}
                        {entry.summary && (
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {entry.summary}
                          </p>
                        )}

                        {/* Source Organization Name Under Answer */}
                        <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1 pt-0.5">
                          <span>Source:</span>
                          <span className="font-bold text-[#1F3B8C]">{entry.sourceOrganization}</span>
                        </div>
                      </div>

                      <button
                        aria-label="Toggle entry"
                        className="p-1.5 rounded-full bg-stone-100 text-stone-600 shrink-0 self-start mt-1"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded Clinical Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-3.5 text-xs text-stone-700 animate-fadeIn">
                        {/* Draft Warning Banner */}
                        {entry.reviewStatus === 'draft' && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span><strong>Not yet reviewed:</strong> This content is in draft stage and undergoing formal clinical appraisal by Ministry of Health specialists.</span>
                          </div>
                        )}

                        {/* Key Points */}
                        {entry.keyPoints && entry.keyPoints.length > 0 && (
                          <div>
                            <div className="font-black text-[#1F3B8C] uppercase text-[11px] mb-2">Key Clinical Takeaways:</div>
                            <ul className="space-y-1.5">
                              {entry.keyPoints.map((kp, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{kp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* When to see clinician */}
                        {entry.whenToSeeClinician && (
                          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-red-950 space-y-1">
                            <div className="font-black text-red-900 text-[11px] uppercase flex items-center gap-1">
                              <HeartPulse className="w-3.5 h-3.5 text-red-600" />
                              When to See a Clinician:
                            </div>
                            <p className="leading-relaxed text-[11px] font-medium">{entry.whenToSeeClinician}</p>
                          </div>
                        )}

                        {/* Keywords Tagging */}
                        {entry.keywords && entry.keywords.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[10px] text-stone-400 font-semibold mr-1">Keywords:</span>
                            {entry.keywords.map((kw, kwIdx) => (
                              <span key={kwIdx} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Source Organization & Verified URL Link */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-stone-500">Source:</span>
                            <span className="font-bold text-[#1F3B8C]">{entry.sourceOrganization}</span>
                            {entry.sourceUrl && (
                              <a
                                href={entry.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-0.5 ml-1 text-[10px] font-semibold underline"
                              >
                                View Protocol
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>

                          <button
                            onClick={() => onAskQuestion(`What should I know about ${entry.title}?`)}
                            className="px-3 py-1.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                            Ask MAM About This
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: WHAT TO TELL THE PROVIDER & PRINTABLE SUMMARY */}
      {activeTab === 'provider_checklist' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5 print:p-0 print:border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <div className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-1">
                Anonymous & Private • No Names Collected
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#1F3B8C]">
                "What to Tell Your Healthcare Provider" Checklist
              </h3>
              <p className="text-xs text-stone-600">
                Print or screenshot this concise summary to take to your Health Post, Health Center, or Hospital.
              </p>
            </div>

            <button
              onClick={handlePrintProviderSummary}
              className="px-4 py-2 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-center"
            >
              <Printer className="w-4 h-4 text-[#F59E0B]" />
              Print / Save as PDF
            </button>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase text-stone-700">Important Details for Your Clinician:</div>

            {[
              { id: 'symptom_duration', text: 'Exact date and time symptoms started (and whether worsening or improving)' },
              { id: 'bleeding_count', text: 'Number of pads soaked per hour, or presence of large blood clots' },
              { id: 'pain_location', text: 'Location and severity of pain (e.g. sharp one-sided pelvic, backache, or generalized cramping)' },
              { id: 'pregnancy_weeks', text: 'Date of Last Menstrual Period (LMP) or estimated gestational weeks' },
              { id: 'fever_temp', text: 'Whether you had chills, shivering, or measured temperature above 38°C' },
              { id: 'hiv_last_test', text: 'Date of last HIV test or whether emergency PEP is needed within 72 hours' },
              { id: 'current_meds', text: 'Any medications, contraceptives, or prenatal vitamins currently being taken' },
              { id: 'partner_treatment', text: 'Whether your partner also has symptoms or needs simultaneous treatment' },
            ].map(({ id, text }) => (
              <label
                key={id}
                className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[id])}
                  onChange={(e) => setCheckedItems((prev) => ({ ...prev, [id]: e.target.checked }))}
                  className="mt-0.5 accent-[#1F3B8C]"
                />
                <span className={checkedItems[id] ? 'font-bold text-[#1F3B8C]' : 'text-stone-700'}>{text}</span>
              </label>
            ))}
          </div>

          {/* Questions to Ask Clinician */}
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs">
            <div className="font-extrabold text-[#1F3B8C]">Suggested Questions to Ask During Your Visit:</div>
            <ul className="list-disc list-inside space-y-1 text-blue-950">
              <li>"Do my symptoms require an ultrasound, urine test, or blood check?"</li>
              <li>"Should my partner also take antibiotics or get tested at the same time?"</li>
              <li>"Are these medications safe for my pregnancy or breastfeeding baby?"</li>
              <li>"What specific danger signs should make me return to the emergency room immediately?"</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 5: TESTING & CARE LOCATOR (REGION / TOWN WITH MOCK DATA & PLACEHOLDERS) */}
      {activeTab === 'locator' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <strong className="block text-sm">Facility Verification Notice:</strong>
              Facilities below are representative public and youth-friendly sites across Ethiopia. Each entry is clearly marked <strong>"[PLACEHOLDER - Verify before visiting]"</strong> or verified with national toll-free numbers. Always call <strong>8335</strong> to verify current clinic hours and staffing.
            </div>
          </div>

          {/* Region & Service Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white p-4 rounded-3xl border border-stone-200">
            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Select Region / City:</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold outline-hidden focus:border-[#1F3B8C]"
              >
                <option value="All Regions">All Regions</option>
                <option value="Saved Facilities">★ Saved Facilities ({savedFacilityIds.length})</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="Sidama">Sidama</option>
                <option value="Tigray">Tigray</option>
                <option value="Dire Dawa">Dire Dawa</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Filter by Service:</label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold outline-hidden focus:border-[#1F3B8C]"
              >
                <option value="all">All Care Services</option>
                <option value="yfs">Youth-Friendly Services (YFS)</option>
                <option value="onestop">One-Stop GBV Crisis Centers</option>
                <option value="emergency_delivery">24/7 Emergency Maternity</option>
                <option value="pep">HIV Testing & PEP Access</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setUserLocationSimulated(!userLocationSimulated)}
                className={`w-full p-2 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userLocationSimulated
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {userLocationSimulated ? 'GPS Filter Active (~5 km)' : 'Simulate Nearby GPS'}
              </button>
            </div>
          </div>

          {/* Facility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacilities.map((fac) => {
              const isSaved = savedFacilityIds.includes(fac.id);
              return (
                <div
                  key={fac.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-stone-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#1F3B8C]">
                        {fac.region} • {fac.townOrSubcity}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-[#1F3B8C] mt-1">
                        {fac.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        Verify
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleSaveFacility(fac)}
                        className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-[#F59E0B] bg-amber-50 hover:bg-amber-100'
                            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                        }`}
                        title={isSaved ? 'Saved in IndexedDB (Click to unsave)' : 'Save facility to offline IndexedDB'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#F59E0B]" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                <div className="text-xs text-stone-600">
                  <div className="font-medium">{fac.address}</div>
                  <div className="text-stone-500 text-[11px] mt-0.5 font-mono">
                    Phone: {fac.phone}
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  {fac.phone.includes('8044') ? (
                    <a
                      href="tel:8044"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Call 8044 (Verified)</span>
                    </a>
                  ) : (
                    <a
                      href="tel:8335"
                      title="Call 8335 to verify contact details for this facility"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                      <span>Verify via 8335</span>
                    </a>
                  )}
                </div>

                {/* Service tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {fac.services.map((svc, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2 py-0.5 rounded-lg"
                    >
                      {svc}
                    </span>
                  ))}
                  {fac.isYouthFriendly && (
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg">
                      Youth-Friendly
                    </span>
                  )}
                  {fac.hasOneStopCenter && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-lg">
                      One-Stop Crisis Center
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* TAB 6: DISCREET REMINDER TOOLS (OFFLINE & PRIVACY-PRESERVING) */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <div className="text-[10px] font-black uppercase text-[#1F3B8C] bg-blue-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  Discreet Notifications • 100% On-Device
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#1F3B8C]">
                  Discreet Health & Care Reminders
                </h3>
                <p className="text-xs text-stone-600">
                  Set reminders for your ANC contacts, testing window periods, or daily prenatal vitamins. Notifications use neutral labels like "Scheduled Reminder" to protect your privacy.
                </p>
              </div>

              <button
                onClick={() => setShowAddReminderModal(true)}
                className="px-4 py-2 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-4 h-4 text-[#F59E0B]" />
                Add New Reminder
              </button>
            </div>

            {/* Reminders List */}
            {reminders.length === 0 ? (
              <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <Bell className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-stone-700">No reminders scheduled yet</div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Click "Add New Reminder" to set an Antenatal Care visit or medication check-in.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      rem.completed
                        ? 'bg-stone-50 border-stone-200 opacity-60'
                        : 'bg-white border-blue-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleReminder(rem)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border cursor-pointer ${
                          rem.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                        }`}
                      >
                        {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className={`text-xs font-black ${rem.completed ? 'line-through text-stone-500' : 'text-[#1F3B8C]'}`}>
                          {rem.title}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#F59E0B]" />
                            {rem.dueDate}
                          </span>
                          {rem.notes && <span>• {rem.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Reminder Modal */}
          {showAddReminderModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-[#1F3B8C]">Create Discreet Reminder</h4>
                  <button
                    onClick={() => setShowAddReminderModal(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateReminder} className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-stone-600">
                        Reminder Title (Discreet label):
                      </label>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                        Lockscreen-safe
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Care Appointment, Health Check-in"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-hidden focus:border-[#1F3B8C]"
                    />
                    {/* Quick Neutral Presets */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {[
                        'Care Appointment',
                        'Health Check-in',
                        'Daily Supplement',
                        'Clinic Follow-up',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setReminderTitle(preset)}
                          className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      🔒 Sensitive details (HIV, STI, pregnancy) are automatically kept out of notifications and lockscreen alerts.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Type:</label>
                    <select
                      value={reminderType}
                      onChange={(e) => setReminderType(e.target.value as any)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-hidden focus:border-[#1F3B8C]"
                    >
                      <option value="anc_visit">Antenatal Care (ANC) Visit</option>
                      <option value="test_followup">Testing Follow-Up (Window Period)</option>
                      <option value="treatment_adherence">Daily IFA / Adherence Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">Date:</label>
                    <input
                      type="date"
                      required
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-hidden focus:border-[#1F3B8C]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-1">
                      Private Notes (optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bring ANC card, clinic morning hours"
                      value={reminderNotes}
                      onChange={(e) => setReminderNotes(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-hidden focus:border-[#1F3B8C]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddReminderModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs shadow-xs cursor-pointer"
                    >
                      Save Reminder
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
