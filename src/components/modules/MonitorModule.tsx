import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Baby,
  Activity,
  AlertOctagon,
  Trash2,
  Plus,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { LanguageCode, TrackerEntry } from '../../types/srmh';
import { offlineStorage } from '../../utils/offlineStorage';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface MonitorModuleProps {
  language: LanguageCode;
  onTriggerDangerAlert: (reason: string) => void;
  onOpenEmergencyModule?: (tab?: string) => void;
}

// Common symptom tags with danger flag mapping
const SYMPTOM_OPTIONS = [
  { id: 'cramps_mild', label: 'Mild Menstrual Cramps', isDanger: false },
  { id: 'heavy_bleeding', label: 'Heavy Bleeding (Soaking pads fast)', isDanger: true, dangerReason: 'Severe Vaginal Bleeding' },
  { id: 'headache_severe', label: 'Severe Headache / Blurred Vision', isDanger: true, dangerReason: 'Severe Pre-eclampsia Warning' },
  { id: 'fever_chills', label: 'High Fever & Chills (>38°C)', isDanger: true, dangerReason: 'Possible Sepsis or Severe Infection' },
  { id: 'reduced_kicks', label: 'Reduced / Absent Baby Kicks (28+ wks)', isDanger: true, dangerReason: 'Decreased Fetal Movement' },
  { id: 'nausea', label: 'Mild Nausea / Morning Sickness', isDanger: false },
  { id: 'spotting', label: 'Light Spotting', isDanger: false },
  { id: 'discharge_unusual', label: 'Itching / Unusual Discharge', isDanger: false },
  { id: 'fatigue', label: 'Fatigue / Low Energy', isDanger: false },
];

const MOOD_OPTIONS = ['Calm', 'Happy', 'Anxious', 'Tired', 'Irritable', 'Overwhelmed'];

const SAMPLE_DEMO_ENTRIES: TrackerEntry[] = [
  {
    id: 'demo-1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'cycle',
    cycleDay: 14,
    symptoms: ['Mild Menstrual Cramps', 'Fatigue / Low Energy'],
    mood: 'Calm',
    notes: 'Mid-cycle ovulation signs noted. Drinking plenty of water.',
    isDangerSign: false,
  },
  {
    id: 'demo-2',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'pregnancy',
    pregnancyWeek: 24,
    symptoms: ['Mild Nausea / Morning Sickness'],
    mood: 'Happy',
    notes: 'Felt first active baby flutter movements! Took daily IFA tablet.',
    isDangerSign: false,
  },
];

export const MonitorModule: React.FC<MonitorModuleProps> = ({
  language,
  onTriggerDangerAlert,
  onOpenEmergencyModule,
}) => {
  const [trackerMode, setTrackerMode] = useState<'cycle' | 'pregnancy'>('cycle');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycleDay, setCycleDay] = useState<number>(14);
  const [pregWeek, setPregWeek] = useState<number>(20);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>('Calm');
  const [notes, setNotes] = useState<string>('');

  const isOnline = useOnlineStatus();
  const [logs, setLogs] = useState<TrackerEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mam_tracker_logs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return SAMPLE_DEMO_ENTRIES;
  });

  const [activeDangerAlert, setActiveDangerAlert] = useState<string | null>(null);

  // Load from IndexedDB on component mount
  useEffect(() => {
    async function loadIndexedDBLogs() {
      try {
        const idbLogs = await offlineStorage.getTrackerLogs();
        if (idbLogs && idbLogs.length > 0) {
          setLogs(idbLogs);
        } else {
          // Cache sample demo entries to IndexedDB initially
          await offlineStorage.saveAllTrackerLogs(SAMPLE_DEMO_ENTRIES);
        }
      } catch (err) {
        console.warn('Could not load logs from IndexedDB', err);
      }
    }
    loadIndexedDBLogs();
  }, []);

  const handleToggleSymptom = (label: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any selected symptom is flagged as danger sign
    let isDanger = false;
    let dangerReason = '';

    for (const sym of SYMPTOM_OPTIONS) {
      if (sym.isDanger && selectedSymptoms.includes(sym.label)) {
        isDanger = true;
        dangerReason = sym.dangerReason || sym.label;
        break;
      }
    }

    const newEntry: TrackerEntry = {
      id: `entry-${Date.now()}`,
      date: logDate,
      type: trackerMode,
      cycleDay: trackerMode === 'cycle' ? cycleDay : undefined,
      pregnancyWeek: trackerMode === 'pregnancy' ? pregWeek : undefined,
      symptoms: selectedSymptoms,
      mood: selectedMood,
      notes: notes.trim(),
      isDangerSign: isDanger,
      dangerDetails: isDanger ? dangerReason : undefined,
    };

    setLogs((prev) => [newEntry, ...prev]);

    // Persist to IndexedDB offline storage & queue for non-urgent sync if offline
    await offlineStorage.saveTrackerLog(newEntry, !isOnline);

    if (isDanger) {
      setActiveDangerAlert(dangerReason);
      onTriggerDangerAlert(dangerReason);
    } else {
      setActiveDangerAlert(null);
    }

    // Reset inputs
    setSelectedSymptoms([]);
    setNotes('');
  };

  const handleDeleteEntry = async (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    await offlineStorage.deleteTrackerLog(id, !isOnline);
  };

  const handleClearAll = async () => {
    if (window.confirm('Delete all tracker entries from this device?')) {
      setLogs([]);
      await offlineStorage.saveAllTrackerLogs([]);
      localStorage.removeItem('mam_tracker_logs');
      setActiveDangerAlert(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">
              Module 3
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-bold text-[#1F3B8C]">Device-Only Monitoring</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1F3B8C] tracking-tight">
            Monitor: Symptom, Cycle & Pregnancy Tracker
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Privately track your physical symptoms, cycle days, or pregnancy weeks. Red danger alerts activate automatically if critical obstetric symptoms are logged.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local Device Storage Only</span>
        </div>
      </div>

      {/* Cross-Module Quick Launcher for Reminders & Danger Triage */}
      {onOpenEmergencyModule && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase text-red-700 tracking-wider block">
              Emergency & Reminders Suite
            </span>
            <h4 className="font-extrabold text-xs sm:text-sm text-[#1F3B8C]">
              ANC Visit Reminders, 72h PEP Countdown & Danger Triage
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Set discreet private notifications for Ethiopian 8 ANC contacts or launch 100% offline triage.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => onOpenEmergencyModule('reminders')}
              className="px-3.5 py-2 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs shadow-xs cursor-pointer whitespace-nowrap"
            >
              Reminders Tool →
            </button>
            <button
              onClick={() => onOpenEmergencyModule('triage')}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs cursor-pointer whitespace-nowrap"
            >
              Offline Danger Triage →
            </button>
          </div>
        </div>
      )}

      {/* Danger Sign Red Card Flag if active */}
      {activeDangerAlert && (
        <div className="p-5 rounded-3xl bg-red-600 text-white shadow-lg border-2 border-red-700 animate-in slide-in-from-top-4 duration-200 space-y-3">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 text-amber-300 animate-pulse shrink-0" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-wide">
                Critical Danger Sign Flagged in Log: {activeDangerAlert}
              </h3>
              <p className="text-xs text-red-100 mt-0.5">
                Do not wait. Seek in-person evaluation at your nearest health center or emergency hospital now.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <a
              href="tel:907"
              className="px-4 py-2 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-xs hover:bg-red-50 transition-colors"
            >
              Call 907 Red Cross Ambulance
            </a>
            <a
              href="tel:8335"
              className="px-4 py-2 rounded-xl bg-red-900 text-white font-extrabold text-xs hover:bg-red-950 transition-colors"
            >
              Call 8335 FMoH Hotline
            </a>
          </div>
        </div>
      )}

      {/* Log Entry Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1F3B8C]" />
            <span>Add New Daily Check-In</span>
          </h3>

          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setTrackerMode('cycle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                trackerMode === 'cycle'
                  ? 'bg-[#1F3B8C] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cycle Tracker
            </button>
            <button
              type="button"
              onClick={() => setTrackerMode('pregnancy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                trackerMode === 'pregnancy'
                  ? 'bg-[#1F3B8C] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pregnancy Week
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveEntry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Date:</label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-[#1F3B8C]"
                required
              />
            </div>

            {trackerMode === 'cycle' ? (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Day of Cycle (Day 1 = First Day of Period):
                </label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={cycleDay}
                  onChange={(e) => setCycleDay(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-[#1F3B8C]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Gestational Age (Weeks 1 to 42):
                </label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={pregWeek}
                  onChange={(e) => setPregWeek(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-[#1F3B8C]"
                />
              </div>
            )}
          </div>

          {/* Symptom Multi-Select with Danger Badges */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Select Symptoms Experienced Today:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym.label);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => handleToggleSymptom(sym.label)}
                    className={`p-2.5 rounded-xl border text-xs text-left font-semibold transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                      isChecked
                        ? sym.isDanger
                          ? 'bg-red-50 text-red-900 border-red-500 ring-1 ring-red-300'
                          : 'bg-blue-50 text-[#1F3B8C] border-[#1F3B8C] ring-1 ring-blue-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">{sym.label}</span>
                    {sym.isDanger && (
                      <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 shrink-0 ml-1">
                        Urgent
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">Mood:</label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMood(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                    selectedMood === m
                      ? 'bg-[#F59E0B] text-[#1F3B8C] shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Personal Notes (Private & stored on device only):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Took daily Iron tablet, cramps reduced after warm tea..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:border-[#1F3B8C]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Plus className="w-4 h-4 text-[#F59E0B]" />
            <span>Save Today's Check-In</span>
          </button>
        </form>
      </div>

      {/* Simple Visual Timeline of Logs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1F3B8C]" />
            <span>Tracking Timeline ({logs.length} entries)</span>
          </h3>

          {logs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
            No entries logged yet. Add your first check-in above to begin monitoring.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-3xl border bg-white shadow-2xs transition-all ${
                  log.isDangerSign
                    ? 'border-red-400 bg-red-50/40 ring-1 ring-red-200'
                    : 'border-stone-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-sm">
                        {log.date}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#1F3B8C]">
                        {log.type === 'cycle'
                          ? `Cycle Day ${log.cycleDay || '-'}`
                          : `Pregnancy Week ${log.pregnancyWeek || '-'}`}
                      </span>
                      <span className="text-xs text-stone-500">
                        • Mood: <strong>{log.mood}</strong>
                      </span>
                    </div>

                    {log.isDangerSign && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-xl">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Danger Sign Logged: {log.dangerDetails || 'Immediate Attention Needed'}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteEntry(log.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {log.symptoms.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {log.symptoms.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {log.notes && (
                  <p className="mt-2 text-xs text-stone-600 italic bg-stone-50 p-2 rounded-xl border border-stone-100">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
