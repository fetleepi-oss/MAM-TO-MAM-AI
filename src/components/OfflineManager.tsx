import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  DownloadCloud,
  CheckCircle2,
  HardDrive,
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Trash2,
  Check
} from 'lucide-react';
import { useOnlineStatus, setSimulatedOffline, getSimulatedOffline } from '../hooks/useOnlineStatus';
import { offlineStorage, SyncQueueItem, CacheMetadata } from '../utils/offlineStorage';
import {
  LEARN_TOPICS,
  CRITICAL_DANGER_SYMPTOMS,
  TRIAGE_CONDITIONS_LIST,
  ETHIOPIAN_MOCK_FACILITIES
} from '../data/srmhData';
import {
  COMPREHENSIVE_HEALTH_SECTIONS,
  TIME_SENSITIVE_EMERGENCIES,
  GUIDED_QUESTIONNAIRES,
  REGIONAL_CARE_FACILITIES
} from '../data/emergencyAndHivData';

interface OfflineManagerProps {
  onSimulateOfflineChange?: (isOffline: boolean) => void;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({ onSimulateOfflineChange }) => {
  const isOnline = useOnlineStatus();
  const [isSimulated, setIsSimulated] = useState<boolean>(() => getSimulatedOffline());
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [cacheMeta, setCacheMeta] = useState<CacheMetadata | null>(null);
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheSuccessMessage, setCacheSuccessMessage] = useState<string | null>(null);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync state upward if requested
  useEffect(() => {
    onSimulateOfflineChange?.(!isOnline);
  }, [isOnline, onSimulateOfflineChange]);

  // Load cache metadata and sync queue on mount
  useEffect(() => {
    async function initOfflineBundle() {
      const existing = await offlineStorage.getCacheMeta();
      if (existing) {
        setCacheMeta(existing);
      } else {
        // Pre-cache library so user has immediate 100% offline access from turn 1
        try {
          const res = await offlineStorage.cacheLibraryBundle({
            learnTopics: LEARN_TOPICS,
            dangerSymptoms: CRITICAL_DANGER_SYMPTOMS,
            triageRules: [...TRIAGE_CONDITIONS_LIST, ...GUIDED_QUESTIONNAIRES],
            facilities: [...ETHIOPIAN_MOCK_FACILITIES, ...REGIONAL_CARE_FACILITIES],
            hivStiModules: COMPREHENSIVE_HEALTH_SECTIONS,
            timeSensitiveEmergencies: TIME_SENSITIVE_EMERGENCIES,
          });
          setCacheMeta({
            key: 'last_cache_sync',
            sizeKb: res.sizeKb,
            sizeBytes: res.sizeBytes,
            timestamp: res.timestamp,
            itemsCount: res.itemsCount,
            version: '2.0.0',
          });
        } catch (e) {
          console.warn('Initial precache failed', e);
        }
      }

      // Check sync queue
      const queue = await offlineStorage.getSyncQueue();
      setSyncQueue(queue);
    }
    initOfflineBundle();
  }, []);

  // Poll sync queue periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const queue = await offlineStorage.getSyncQueue();
      setSyncQueue(queue);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Process sync queue automatically when coming back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      handleProcessSyncQueue();
    }
  }, [isOnline]);

  const handleDownloadOfflineBundle = async () => {
    setIsCaching(true);
    setCacheSuccessMessage(null);
    try {
      const res = await offlineStorage.cacheLibraryBundle({
        learnTopics: LEARN_TOPICS,
        dangerSymptoms: CRITICAL_DANGER_SYMPTOMS,
        triageRules: [...TRIAGE_CONDITIONS_LIST, ...GUIDED_QUESTIONNAIRES],
        facilities: [...ETHIOPIAN_MOCK_FACILITIES, ...REGIONAL_CARE_FACILITIES],
        hivStiModules: COMPREHENSIVE_HEALTH_SECTIONS,
        timeSensitiveEmergencies: TIME_SENSITIVE_EMERGENCIES,
      });

      const updatedMeta: CacheMetadata = {
        key: 'last_cache_sync',
        sizeKb: res.sizeKb,
        sizeBytes: res.sizeBytes,
        timestamp: res.timestamp,
        itemsCount: res.itemsCount,
        version: '2.0.0',
      };
      setCacheMeta(updatedMeta);
      setCacheSuccessMessage(`Successfully saved ${res.itemsCount} clinical modules (~${(res.sizeKb / 1024).toFixed(1)} MB) to device storage!`);
      setTimeout(() => setCacheSuccessMessage(null), 4000);
    } catch (err) {
      console.warn('Cache error', err);
    } finally {
      setIsCaching(false);
    }
  };

  const handleToggleSimulation = () => {
    const nextVal = !isSimulated;
    setIsSimulated(nextVal);
    setSimulatedOffline(nextVal);
  };

  const handleProcessSyncQueue = async () => {
    setIsSyncing(true);
    try {
      const result = await offlineStorage.processSyncQueue();
      const remaining = await offlineStorage.getSyncQueue();
      setSyncQueue(remaining);
      if (result.processedCount > 0) {
        setCacheSuccessMessage(`Synced ${result.processedCount} offline items successfully!`);
        setTimeout(() => setCacheSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error processing sync queue', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearSyncQueue = async () => {
    await offlineStorage.clearSyncQueue();
    setSyncQueue([]);
  };

  const cacheSizeFormatted = cacheMeta
    ? cacheMeta.sizeKb > 1024
      ? `${(cacheMeta.sizeKb / 1024).toFixed(1)} MB`
      : `${cacheMeta.sizeKb} KB`
    : '1.3 MB';

  return (
    <>
      <div className="flex items-center gap-1.5">
        {/* 1. Visible Online / Offline Badge */}
        <button
          onClick={() => setShowDetailsModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[36px] ${
            isOnline
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-400/40 hover:bg-emerald-950/60'
              : 'bg-amber-500/25 text-amber-300 border-amber-400/60 hover:bg-amber-500/35 ring-2 ring-amber-400/40 animate-pulse'
          }`}
          title="Click to view offline capabilities, cache details, and sync queue"
        >
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <WifiOff className="w-3.5 h-3.5 text-amber-300" />
              <span>Offline Guide</span>
            </>
          )}

          {/* Sync Queue Badge indicator */}
          {syncQueue.length > 0 && (
            <span
              className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black"
              title={`${syncQueue.length} items queued for sync`}
            >
              {syncQueue.length}
            </span>
          )}
        </button>

        {/* 2. Download for offline button with Size Indicator */}
        <button
          onClick={handleDownloadOfflineBundle}
          disabled={isCaching}
          title="Download & verify complete health library for zero-data offline use"
          className="flex items-center gap-1.5 bg-[#152861] hover:bg-[#11204d] border border-blue-400/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-100 transition-colors cursor-pointer min-h-[36px]"
        >
          <DownloadCloud className={`w-3.5 h-3.5 text-[#F59E0B] ${isCaching ? 'animate-bounce' : ''}`} />
          <span className="text-[11px] whitespace-nowrap">
            {isCaching ? 'Saving...' : cacheMeta ? `${cacheSizeFormatted} Cached` : `Download (${cacheSizeFormatted})`}
          </span>
        </button>
      </div>

      {/* 3. Offline Features, Diagnostics & Sync Queue Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-stone-200 text-stone-900 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-xl ${
                    isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#1F3B8C] flex items-center gap-2">
                    Network & Offline Status
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isOnline
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isOnline ? 'Active Online' : 'Offline Mode'}
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    MAM-to-MAM AI is built offline-first for low-connectivity Ethiopian contexts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Offline Bundle Cache Status with Size Indicator */}
            <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#1F3B8C] flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-[#F59E0B]" />
                  <span>IndexedDB Local Storage Cache</span>
                </div>
                <div className="text-[11px] text-stone-600 font-medium">
                  {cacheMeta ? (
                    <>
                      <strong>{cacheSizeFormatted}</strong> stored • {cacheMeta.itemsCount} clinical modules, triage rules & facilities cached.
                    </>
                  ) : (
                    'Initializing local offline database...'
                  )}
                </div>
                {cacheMeta && (
                  <div className="text-[10px] text-stone-400">
                    Last refreshed: {new Date(cacheMeta.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>

              <button
                onClick={handleDownloadOfflineBundle}
                disabled={isCaching}
                className="px-3 py-2 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white text-xs font-bold cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{isCaching ? 'Downloading...' : 'Download for Offline'}</span>
              </button>
            </div>

            {cacheSuccessMessage && (
              <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{cacheSuccessMessage}</span>
              </div>
            )}

            {/* Queue for Non-Urgent Sync */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-extrabold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#1F3B8C]" />
                  <span>Queue for Non-Urgent Sync</span>
                  <span className="text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded-full font-bold">
                    {syncQueue.length} pending
                  </span>
                </div>

                {syncQueue.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleProcessSyncQueue}
                      disabled={!isOnline || isSyncing}
                      className="text-[11px] font-bold text-[#1F3B8C] hover:underline flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>Sync Now</span>
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      onClick={handleClearSyncQueue}
                      className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {syncQueue.length === 0 ? (
                <p className="text-[11px] text-stone-500">
                  All local actions are synchronized. Any non-urgent tracker logs, facility bookmarks, or feedback saved while offline will wait here until connectivity resumes.
                </p>
              ) : (
                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {syncQueue.map((item) => (
                    <div
                      key={item.id}
                      className="text-[11px] p-2 bg-white rounded-lg border border-stone-200 flex items-center justify-between text-stone-700"
                    >
                      <span className="font-mono text-[10px]">{item.action}</span>
                      <span className="text-stone-400 text-[10px]">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feature Breakdown: 100% Offline vs Requires Internet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Works 100% Offline:</span>
                </div>
                <ul className="text-stone-700 space-y-1 text-[11px]">
                  <li>✓ All 4 Health Modules (HIV, STIs, Pregnancy, Emergencies)</li>
                  <li>✓ 3 Guided Rule-Based Questionnaires & Triage</li>
                  <li>✓ Instant Obstetric Red Alert Warning</li>
                  <li>✓ "Offline Guide: not live AI" in Ask MAM Chat</li>
                  <li>✓ Testing & Care Directory with Emergency Hotlines</li>
                  <li>✓ Symptom Tracker & Cycle Calendar</li>
                  <li>✓ Discreet Reminders Tool & Clinician Summary</li>
                </ul>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
                <div className="font-extrabold text-[#1F3B8C] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>Requires Internet:</span>
                </div>
                <ul className="text-stone-700 space-y-1 text-[11px]">
                  <li>• Live Gemini AI Generative Chat Responses</li>
                  <li>• Dynamic cloud speech synthesis / audio voiceover</li>
                  <li>• Live map navigation pins</li>
                </ul>
                <div className="mt-2 text-[10px] text-stone-500 italic">
                  *When offline, Ask MAM switches to "Offline Guide: not live AI" searching reviewed local content.
                </div>
              </div>
            </div>

            {/* Preview Simulation Toggle for Direct Testing */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  Test Offline Mode in Preview:
                </span>
                <span className="text-[11px] text-stone-500">
                  Simulate zero internet connection without disabling WiFi.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleSimulation}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer min-h-[36px] ${
                  isSimulated
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                {isSimulated ? 'Simulating Offline' : 'Simulate Offline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
