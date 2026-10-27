/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { LanguageCode, JourneyStage } from './types/srmh';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { JourneyBar } from './components/JourneyBar';
import { LearnModule } from './components/modules/LearnModule';
import { PreventModule } from './components/modules/PreventModule';
import { MonitorModule } from './components/modules/MonitorModule';
import { SeekCareModule } from './components/modules/SeekCareModule';
import { HivStiPregnancyEmergencyModule } from './components/modules/HivStiPregnancyEmergencyModule';
import { AskMamDrawer } from './components/AskMamDrawer';
import { GlobalDangerAlert } from './components/GlobalDangerAlert';
import { PrivacyModal } from './components/PrivacyModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mam_selected_lang');
      if (saved === 'am' || saved === 'om' || saved === 'ti' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  });

  const isOnline = useOnlineStatus();
  const [currentStage, setCurrentStage] = useState<JourneyStage>('learn');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatPrompt, setChatPrompt] = useState<string>('');

  // Global Danger Sign Alert state
  const [isDangerAlertOpen, setIsDangerAlertOpen] = useState<boolean>(false);
  const [dangerAlertReason, setDangerAlertReason] = useState<string>('');

  // First-launch privacy modal state
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('mam_privacy_accepted');
    }
    return false;
  });

  const t = translations[language];

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    localStorage.setItem('mam_selected_lang', newLang);
  };

  const handleAskQuestionFromModule = (prompt: string) => {
    setChatPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleTriggerDangerAlert = (reason: string) => {
    setDangerAlertReason(reason);
    setIsDangerAlertOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-[#F59E0B]/30 antialiased">
      {/* 1. Header with Deep Blue Brand, Tagline, & Language Switcher */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenDangerModal={() => handleTriggerDangerAlert('Emergency obstetric warning signs check')}
        onOpenEmergencyModule={() => setCurrentStage('emergency')}
      />

      {/* Offline Mode Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold shadow-sm animate-in fade-in border-b border-amber-600/30">
          <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-950 animate-ping shrink-0" />
              <span>
                <strong>Offline Mode Active:</strong> Health library, triage, danger signs, facilities & tracker are working 100% offline.
              </span>
            </div>
            <span className="text-[11px] font-mono bg-amber-600/30 px-2 py-0.5 rounded-full border border-amber-700/20 shrink-0">
              Chat: Offline Guide: not live AI
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* 2. 4-Step Journey Bar (LEARN -> PREVENT -> MONITOR -> SEEK CARE -> EMERGENCY) */}
        <JourneyBar
          currentStage={currentStage}
          onSelectStage={(stage) => setCurrentStage(stage)}
          language={language}
        />

        {/* 3. Active Journey Module Content */}
        {currentStage === 'learn' && (
          <LearnModule
            language={language}
            onAskQuestion={handleAskQuestionFromModule}
            onOpenEmergencyModule={() => setCurrentStage('emergency')}
          />
        )}

        {currentStage === 'prevent' && (
          <PreventModule
            language={language}
            onAskQuestion={handleAskQuestionFromModule}
            onOpenEmergencyModule={() => setCurrentStage('emergency')}
          />
        )}

        {currentStage === 'monitor' && (
          <MonitorModule
            language={language}
            onTriggerDangerAlert={handleTriggerDangerAlert}
            onOpenEmergencyModule={() => setCurrentStage('emergency')}
          />
        )}

        {currentStage === 'seek_care' && (
          <SeekCareModule
            language={language}
            onAskQuestion={handleAskQuestionFromModule}
            onOpenEmergencyModule={() => setCurrentStage('emergency')}
          />
        )}

        {currentStage === 'emergency' && (
          <HivStiPregnancyEmergencyModule
            language={language}
            onAskQuestion={handleAskQuestionFromModule}
            onTriggerDangerAlert={handleTriggerDangerAlert}
          />
        )}
      </main>

      {/* 4. Mandatory Footer with Early MVP note & clinical disclaimers */}
      <Footer
        language={language}
        onOpenDangerModal={() => handleTriggerDangerAlert('Reviewing emergency symptoms')}
      />

      {/* 5. Floating "Ask MAM" Chat Button on Every Screen */}
      <button
        onClick={() => {
          setChatPrompt('');
          setIsChatOpen(true);
        }}
        className="fixed bottom-5 right-5 z-40 bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold px-4 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center gap-2.5 border-2 border-[#F59E0B] ring-4 ring-blue-900/10 active:scale-95 min-h-[52px]"
        aria-label="Open Ask MAM AI Chat"
      >
        <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-[#1F3B8C] flex items-center justify-center font-bold text-xs shrink-0">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-bold tracking-tight">
          {t.askMamButton}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
      </button>

      {/* 6. Ask MAM Chat Drawer / Modal */}
      <AskMamDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        language={language}
        currentStage={currentStage}
        initialPrompt={chatPrompt}
        onTriggerDangerAlert={handleTriggerDangerAlert}
        onOpenEmergencyModule={() => setCurrentStage('emergency')}
      />

      {/* 7. Global Full-Screen Danger Alert Modal */}
      <GlobalDangerAlert
        isOpen={isDangerAlertOpen}
        onClose={() => setIsDangerAlertOpen(false)}
        language={language}
        detectedReason={dangerAlertReason}
      />

      {/* 8. First-Launch / On-Demand Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        language={language}
      />
    </div>
  );
}
