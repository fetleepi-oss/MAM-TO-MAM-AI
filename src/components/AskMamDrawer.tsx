import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Volume2,
  VolumeX,
  Copy,
  Check,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Trash2,
  HeartHandshake,
  ThumbsUp,
  ThumbsDown,
  Stethoscope,
  AlertTriangle,
  ArrowRight,
  Wifi,
  WifiOff,
  Shield,
  Info,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { disguiseService } from '../utils/disguiseService';
import { Message, JourneyStage, LanguageCode } from '../types/srmh';
import { translations, QuickReplyItem } from '../data/translations/index';
import { CRITICAL_DANGER_SYMPTOMS } from '../data/srmhData';
import { COMPREHENSIVE_HEALTH_SECTIONS, TIME_SENSITIVE_EMERGENCIES } from '../data/emergencyAndHivData';
import {
  MASTER_CONTENT_LIBRARY,
  queryContentLibrary,
  formatContentAnswer,
  getNoMatchClinicianFallback,
  getReviewStatusLabel,
} from '../data/content/index';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface AskMamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  currentStage: JourneyStage;
  initialPrompt?: string;
  onTriggerDangerAlert: (reason: string) => void;
  onOpenEmergencyModule?: (tab?: string) => void;
}

const INITIAL_GREETING: Record<LanguageCode, string> = {
  en: `Hello! I am **MAM-to-MAM AI**, your confidential companion for sexual, reproductive & maternal health in Ethiopia.

I can help explain:
• Menstruation & body changes
• Family planning & contraception in Ethiopia
• Pregnancy milestones & Ethiopian ANC schedules
• Symptoms & when to see a local clinician

*I'm an AI guide, not a doctor. I do not diagnose or prescribe medications.*
What would you like to discuss today?`,

  am: `ጤና ይስጥልኝ! እኔ **ማም-ቱ-ማም AI (MAM-to-MAM AI)** ነኝ—በኢትዮጵያ የስነ-ተዋልዶና የእናቶች ጤና ሚስጥራዊ ረዳትዎ።

በሚከተሉት ጉዳዮች ላይ ማብራሪያ መስጠት እችላለሁ፡
• የወር አበባና የአካላዊ ለውጦች
• በኢትዮጵያ ያሉ የወሊድ መከላከያዎች
• የእርግዝና ክትትልና የቅድመ ወሊድ ምርመራዎች
• የህመም ስሜቶችና ሀኪም ማየት ያለብዎት መቼ እንደሆነ

*እኔ የ AI መመሪያ ረዳት እንጂ ሀኪም አይደለሁም። መድኃኒት አላዝምም፤ አልመረምርም።*
ዛሬ በምን ርዕስ ላይ መወያየት ይፈልጋሉ?`,

  om: `Akkam jirtu! Baga nagaan dhuftan. Ani **MAM-to-MAM AI**, michuu iccitii fayyaa wal-hormaataa fi haadholii Itoophiyaa ti.

Waa'ee kanaa isiniif ibsuun danda'a:
• Marsaa laguu fi jijjiirama qaamaa
• Mala ittisa da’umsaa buufata fayyaa Itoophiyaatti argamu
• Hordoffii ulfaa fi fayyaa haadholii
• Mallattoolee fayyaa fi yoom ogeessa arguun akka barbaachisu

*Ani qajeelchaa AI qofa, ogeessa fayyaa miti. Qoricha hin ajaju.*
Har'a waa'ee maali gaafachuu barbaaddu?`,

  ti: `ሰላም ከመይ ቀኒኹም! ኣነ **MAM-to-MAM AI** እየ—ኣብ ኢትዮጵያ ናይ ስነ-ተዋልዶን ጥዕና ኣደታትን ምስጢራዊ መማኸሪኹም።

ኣብዞም ዚስዕቡ ጕዳያት ክሕግዘኩም እኽእል፡
• ጽግያትን ኣካላዊ ለውጥን
• ኣብ ኢትዮጵያ ዘለዉ መከላኸሊታት ጥንሲ
• ናይ ጥንሲ ክትትልን ምልክታትን
• መዓስ ናብ ሓኪም ክትከዱ ከም ዘለኩም

*ኣነ ናይ AI መምርሒ እየ እምበር ሓኪም ኣይኮንኩን። ፈውሲ ኣይእዝዝን።*
ሎሚ ብዛዕባ እንታይ ክትሓቱ ትደልዩ?`,

  so: `Nabad! Waxaan ahay **MAM-to-MAM AI**, wehelkaaga qarsoodiga ah ee caafimaadka taranka iyo hooyooyinka ee Itoobiya.

Waxaan kaa caawin karaa sharraxaadda:
• Caadada iyo isbeddellada jirka
• Qorsheynta qoyska iyo ka hortagga uurka
• Horumarka uurka iyo jadwalka ANC
• Calaamadaha & goorta la arko dhakhtar

*Waxaan ahay hage AI, ma ahi dhakhtar. Ma baaro mana qoro dawooyin.*
Maxaad jeclaan lahayd inaad maanta ka hadasho?`,

  aa: `Kusalama! Anu **MAM-to-MAM AI** kinniyo—Ethiopia addat ina qafiyat kee barittoh sirri qokol (Afar Scaffold).

Ta yaabal koo qokolo xiqto:
• Alsay kee fayyinta
• Baxa diggi hayto
• Bagu kee ina qafiyat
• Waqdi qafiyat ogeyssa tableen

*Anu AI qokol kinniyo, doktor ma kiyo. Daawa ma yaca.*
Ta addat mannal koo qokolno?`,

  sid: `Keere! Ani **MAM-to-MAM AI** ti—Itoophiyu giddo kalaqo nna amootu fayyimma maassiiti gursaanchooti (Sidama Scaffold).

Konne kaa’la dandeemmo:
• Aganna nna mannumma soorro
• Maate qixxeesha
• Godowu heeshsho nna hordoffa
• Dani malaatenna ogeessa la’a

*Ani AI gursaanchooti, doktoore di-ikkoommo. Qoricha di-fushsheemmo.*
Xawa mayi aana xa’ma hasidhanno?`,
};

/**
 * Intelligent Offline Guide Search Engine
 * When offline, searches the exact same JSON Content Library:
 * - Prioritizes approved entries first, then clinician-reviewed, then draft
 * - Shows source names under each answer
 * - Draft content explicitly displays the 'Not yet reviewed' label
 * - If nothing relevant is found, it states so and points directly to a clinician
 */
function getOfflineGuideAnswer(query: string, language: LanguageCode): { reply: string; dangerDetected: boolean } {
  const lower = query.toLowerCase();

  // Guardrail 1: Prompt Injection & Jailbreak Defense (Offline)
  const isPromptInjection =
    lower.includes('ignore previous instructions') ||
    lower.includes('ignore all previous instructions') ||
    lower.includes('bypass rules') ||
    lower.includes('bypass clinical') ||
    lower.includes('dr. unlimited') ||
    lower.includes('dan mode') ||
    lower.includes('developer mode') ||
    lower.includes('system override') ||
    lower.includes('unrestricted medical ai') ||
    lower.includes('pretend you are an unrestricted');

  if (isPromptInjection) {
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n🛡️ **Safety Guardrail:** I cannot bypass my safety protocols, assume unrestricted personas, or provide medication dosages. I am MAM-to-MAM AI, your evidence-based health companion for sexual, reproductive, and maternal health in Ethiopia.\n\nIf you have a genuine health question or symptom, I am here to guide you to verified clinical information or a local healthcare provider.\n\n**When to see a clinician:** For diagnostic assessment, laboratory tests, or prescription medications, visit your nearest Kebele Health Post or Woreda Health Center.\n\n---\n🏷️ **Source:** Ethiopian Federal Ministry of Health Clinical Ethics & Safety Guidelines [Approved]\n\n*Disclaimer: I'm an AI guide, not a doctor.*`,
      dangerDetected: false,
    };
  }

  // Guardrail 2: Explicit Refusal of Prescription & Medication Dosages (Offline)
  const mentionsMedication =
    lower.includes('azithromycin') ||
    lower.includes('doxycycline') ||
    lower.includes('ceftriaxone') ||
    lower.includes('amoxicillin') ||
    lower.includes('metronidazole') ||
    lower.includes('ciprofloxacin') ||
    lower.includes('dolutegravir') ||
    lower.includes('tenofovir') ||
    lower.includes('arv') ||
    lower.includes('antiretroviral') ||
    lower.includes('antibiotic') ||
    lower.includes('misoprostol') ||
    lower.includes('mifepristone');

  const asksDosage =
    lower.includes('dose') ||
    lower.includes('dosage') ||
    lower.includes('exact dose') ||
    lower.includes('how many mg') ||
    lower.includes('how much mg') ||
    lower.includes('how many pills') ||
    lower.includes('prescribe') ||
    lower.includes('mg of') ||
    lower.includes('quantity') ||
    lower.includes('take how much');

  if (mentionsMedication && asksDosage) {
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\nI cannot provide medication dosages, milligram quantities, or prescription instructions. As an AI health companion, prescribing medications or providing clinical dosages is strictly outside my legal and clinical scope.\n\n* **Why Clinical Assessment is Essential:**\n  * **Personalized Medical Factors:** Safe and effective dosages of antibiotics (such as azithromycin, doxycycline, or ceftriaxone) and antiretrovirals (ARVs like dolutegravir) depend on body weight, kidney and liver function, age, and pregnancy status.\n  * **Antimicrobial Resistance & Toxicity Risks:** Self-medicating with unprescribed antibiotics or incorrect ARV doses risks life-threatening drug toxicity, treatment failure, or dangerous bacterial/viral resistance, which can render life-saving medications ineffective.\n  * **Exact Diagnostic Testing:** STIs and viral infections share overlapping symptoms. Clinical testing (such as syndromic assessment, CD4/viral load assays, or cultures) is required to determine the exact pathogen and drug sensitivity before starting treatment.\n\n* **Safe, Regulated Care in Ethiopia:**\n  * Visit your nearest Kebele Health Post or Woreda Health Center for free or subsidized syndromic management and clinician-directed treatment.\n  * Consult a licensed community pharmacist or call the Ethiopian Ministry of Health Toll-Free Health Information Line at **8335**.\n\n**When to see a clinician:** Please consult a licensed medical doctor, health officer, or certified pharmacist to receive an in-person diagnosis and appropriate prescription.\n\n---\n🏷️ **Source:** Ethiopian Federal Ministry of Health (FMoH) & WHO Safe Prescribing Guidelines [Approved]\n\n*Disclaimer: I'm an AI guide, not a doctor.*`,
      dangerDetected: false,
    };
  }

  // 1. Critical Obstetric & Medical Danger Symptoms
  for (const danger of CRITICAL_DANGER_SYMPTOMS) {
    for (const kw of danger.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        const isAssault = danger.id === 'danger_violence_assault' || lower.includes('rape') || lower.includes('assault') || lower.includes('forced sex');
        const emergencyText = isAssault
          ? `🚨 **CRITICAL MEDICAL EMERGENCY DETECTED (SURVIVOR CARE):**\n${danger.urgencyText}\n\n**Immediate Actions in Ethiopia:**\n• Go directly to the nearest Hospital Emergency Room and request the **One-Stop Center** (offering free medical care, HIV PEP within 72h, emergency contraception within 72-120h, trauma counseling, and legal support in a private room).\n• **AWSAD Crisis & Safe Shelter:** Dial **6226 (Toll-Free)**\n• **Ministry of Health Helpline:** Dial **8335 (Toll-Free)**\n• **Marie Stopes Helpline:** Dial **8044 (Toll-Free)**\n\n**When to see a clinician:** Please go to a hospital One-Stop Center immediately. Do not delay beyond 72 hours for preventive medications.`
          : `🚨 **CRITICAL MEDICAL EMERGENCY DETECTED:**\n${danger.urgencyText}\n\n**Immediate Actions in Ethiopia:**\n• Go immediately to the nearest Emergency Department or Maternity Ward.\n• Emergency Ambulance: Dial **907 (Red Cross)** or **952 (Addis Ababa EMS)**.\n• FMoH National Health Line: Dial **8335**.\n\n**When to see a clinician:** Seek immediate clinical emergency care now. Do not delay.`;

        return {
          reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n${emergencyText}\n\n---\n🏷️ **Source:** Ethiopian National Emergency Obstetric and Clinical Protocols [Approved]`,
          dangerDetected: true,
        };
      }
    }
  }

  // 2. Query Unified Medical Content Library (all 7 topics: HIV, STIs, Pregnancy, Postnatal, Contraception, Emergencies, Menstrual Health)
  const searchResult = queryContentLibrary(query, language);

  if (searchResult.nothingFound || !searchResult.bestMatch) {
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n${getNoMatchClinicianFallback(query, language)}`,
      dangerDetected: false,
    };
  }

  const best = searchResult.bestMatch;
  const formattedAnswer = formatContentAnswer(best);

  return {
    reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n${formattedAnswer}`,
    dangerDetected: best.topic === 'Emergencies' || best.id.includes('hemorrhage') || best.id.includes('preeclampsia'),
  };
}

export const AskMamDrawer: React.FC<AskMamDrawerProps> = ({
  isOpen,
  onClose,
  language,
  currentStage,
  initialPrompt,
  onTriggerDangerAlert,
  onOpenEmergencyModule,
}) => {
  const isOnline = useOnlineStatus();
  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`mam_chat_history_${language}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: INITIAL_GREETING[language] || INITIAL_GREETING.en,
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  // Danger pre-check state on current user typing
  const [detectedPrecheckDanger, setDetectedPrecheckDanger] = useState<{
    title: string;
    urgencyText: string;
  } | null>(null);

  // Message feedback map: { [messageId]: 'yes' | 'no' }
  const [feedbackMap, setFeedbackMap] = useState<Record<string, 'yes' | 'no'>>(() => {
    if (typeof window !== 'undefined') {
      const savedFeedback = localStorage.getItem('mam_chat_feedback');
      if (savedFeedback) {
        try {
          return JSON.parse(savedFeedback);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {};
  });

  // AI Provider Transparency toggle
  const [showAiDisclosure, setShowAiDisclosure] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages to local storage
  useEffect(() => {
    localStorage.setItem(`mam_chat_history_${language}`, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, language]);

  // Sync feedback to local storage
  useEffect(() => {
    localStorage.setItem('mam_chat_feedback', JSON.stringify(feedbackMap));
  }, [feedbackMap]);

  // If initialPrompt passed, populate input or send
  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInput(initialPrompt);
      // Run pre-check on initial prompt
      scanInputForDanger(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Real-Time Danger Sign Pre-Check on User Input
   * Scans input text against clinical keywords for urgent obstetric & SRH emergencies
   */
  const scanInputForDanger = (text: string) => {
    if (!text || text.trim().length < 3) {
      setDetectedPrecheckDanger(null);
      return null;
    }

    const lower = text.toLowerCase();
    for (const danger of CRITICAL_DANGER_SYMPTOMS) {
      for (const kw of danger.keywords) {
        if (lower.includes(kw)) {
          const match = {
            title: language === 'am' ? danger.titleAm : danger.title,
            urgencyText: danger.urgencyText,
          };
          setDetectedPrecheckDanger(match);
          return match;
        }
      }
    }

    setDetectedPrecheckDanger(null);
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    scanInputForDanger(val);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const rawQuery = (textOverride || input).trim();
    // Input sanitization: strip HTML tags, control characters, max 1000 characters
    const query = rawQuery
      .replace(/<[^>]*>/g, '')
      .replace(/\0/g, '')
      .slice(0, 1000);

    if (!query || isLoading) return;

    // Run danger pre-check on submitted query
    const dangerMatch = scanInputForDanger(query);
    if (dangerMatch) {
      onTriggerDangerAlert(`${dangerMatch.title} — ${dangerMatch.urgencyText}`);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
      dangerSignDetected: Boolean(dangerMatch),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setDetectedPrecheckDanger(null);
    setIsLoading(true);

    // If offline, switch immediately to offline guide mode with zero network call
    if (!isOnline) {
      setTimeout(() => {
        const offlineResult = getOfflineGuideAnswer(query, language);
        if (offlineResult.dangerDetected) {
          onTriggerDangerAlert('Emergency symptoms detected by clinical guidelines.');
        }

        const offlineMsg: Message = {
          id: `assistant-offline-${Date.now()}`,
          role: 'assistant',
          content: offlineResult.reply,
          timestamp: Date.now(),
          dangerSignDetected: offlineResult.dangerDetected,
        };

        setMessages((prev) => [...prev, offlineMsg]);
        setIsLoading(false);
      }, 300);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content.slice(0, 1500),
          })),
          userLanguage: language,
          currentStage,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        const rateLimitMsg: Message = {
          id: `ratelimit-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Rate Limit Notice:**\n${data.error || 'Too many messages sent. Please wait a moment before sending another query.'}\n\n*If you are experiencing severe symptoms or an obstetric emergency, dial **907** (Ambulance) or **8335** (Health Hotline) immediately.*`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, rateLimitMsg]);
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to connect to MAM AI server');
      }

      if (data.dangerSignDetected) {
        onTriggerDangerAlert('Emergency symptoms detected by clinical guidelines.');
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        dangerSignDetected: data.dangerSignDetected,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      // Note: Do not log chat content or user query text
      console.warn('Live API request failed, falling back to local offline guide:', err?.message || 'Network error');
      const fallbackGuide = getOfflineGuideAnswer(query, language);
      const fallback: Message = {
        id: `offline-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackGuide.reply,
        timestamp: Date.now(),
        dangerSignDetected: fallbackGuide.dangerDetected,
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReplyClick = (query: string) => {
    setInput(query);
    scanInputForDanger(query);
    handleSendMessage(query);
  };

  const handleFeedback = (messageId: string, rating: 'yes' | 'no') => {
    setFeedbackMap((prev) => ({
      ...prev,
      [messageId]: rating,
    }));
  };

  const handleReadAloud = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = text
      .replace(/[*_#`[\]()]/g, '')
      .replace(/Disclaimer:.*$/gi, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingId(null);
    utterance.onerror = () => setIsSpeakingId(null);

    setIsSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all conversation messages?')) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeakingId(null);
      const resetMsg: Message = {
        id: 'welcome-reset',
        role: 'assistant',
        content: INITIAL_GREETING[language] || INITIAL_GREETING.en,
        timestamp: Date.now(),
      };
      setMessages([resetMsg]);
      localStorage.removeItem(`mam_chat_history_${language}`);
      setFeedbackMap({});
      localStorage.removeItem('mam_chat_feedback');
    }
  };

  /**
   * Helper to render assistant message content with formatted "When to see a clinician" section
   */
  const renderMessageContent = (content: string) => {
    // Check if message has "When to see a clinician" section
    const clinicianKeywords = ['When to see a clinician:', '**When to see a clinician:**', 'ሀኪም ማየት ያለብዎት መቼ ነው፡', 'Yoom ogeessa fayyaa arguun barbaachisa:'];
    let splitKeyword = '';

    for (const kw of clinicianKeywords) {
      if (content.includes(kw)) {
        splitKeyword = kw;
        break;
      }
    }

    if (!splitKeyword) {
      return <div className="whitespace-pre-wrap font-sans">{content}</div>;
    }

    const parts = content.split(splitKeyword);
    const mainBody = parts[0];
    const clinicianPart = parts.slice(1).join(splitKeyword);

    // Check if clinicianPart contains disclaimer at the bottom
    const disclaimerSplit = clinicianPart.split(/(\*?Disclaimer:.*|\*?ማሳሰቢያ:.*|\*?Hubachiisa:.*)/i);
    const clinicianAdvice = disclaimerSplit[0];
    const disclaimerText = disclaimerSplit.slice(1).join('');

    return (
      <div className="space-y-3 font-sans">
        <div className="whitespace-pre-wrap">{mainBody.trim()}</div>

        {/* Elevated "When to see a clinician" clinical card */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-stone-900 space-y-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 uppercase tracking-wide">
            <Stethoscope className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{t.whenToSeeClinician || 'When to see a clinician:'}</span>
          </div>
          <div className="text-xs text-stone-800 leading-relaxed font-medium whitespace-pre-wrap">
            {clinicianAdvice.trim()}
          </div>
        </div>

        {disclaimerText && (
          <div className="text-[11px] text-stone-400 italic pt-1">
            {disclaimerText.replace(/\*/g, '').trim()}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[94vh] sm:h-[84vh] max-h-[840px] animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Deep Blue Header */}
        <div className="bg-[#1F3B8C] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#182E6E] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B] text-[#1F3B8C] flex items-center justify-center font-bold shadow-xs shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>{isOnline ? t.askMamTitle : 'Offline Guide: not live AI'}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                    isOnline
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                  }`}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      Live AI
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-300" />
                      Offline Guide: not live AI
                    </>
                  )}
                </span>
              </h2>
              <p className="text-[11px] text-blue-200">
                {isOnline
                  ? '100% Anonymous • Evidence-based SRMH in Ethiopia'
                  : 'Searching Local Reviewed Health Library (No Data Used)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* One-Tap Quick Exit in drawer */}
            <button
              onClick={() => disguiseService.triggerQuickExit()}
              title="One-tap quick exit to Google • Or press Esc twice"
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black flex items-center gap-1 cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Quick Exit</span>
            </button>

            {onOpenEmergencyModule && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEmergencyModule('emergencies');
                }}
                className="hidden md:inline-flex text-[11px] bg-red-700 hover:bg-red-800 text-white font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
              >
                72h PEP & Triage
              </button>
            )}

            <button
              onClick={handleClearHistory}
              title="Clear chat"
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900/40 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Provider Transparency & Privacy Disclosure Card */}
        <div className="bg-blue-50/90 border-b border-blue-200 px-4 py-2 text-xs text-blue-950">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowAiDisclosure(!showAiDisclosure)}
              className="flex items-center gap-1.5 font-bold text-[#1F3B8C] hover:underline text-left cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <span>
                {isOnline ? 'What is sent to Google AI when online?' : 'Offline Mode: Zero data sent to AI'}
              </span>
              <span className="text-[10px] text-blue-700 font-normal">
                {showAiDisclosure ? '(tap to collapse)' : '(tap to view disclosure)'}
              </span>
              {showAiDisclosure ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <span className="text-[10px] font-mono bg-blue-100 text-[#1F3B8C] font-black px-1.5 py-0.5 rounded shrink-0">
              {isOnline ? 'No Chat Logging' : '100% Local DB'}
            </span>
          </div>

          {showAiDisclosure && (
            <div className="mt-2 pt-2 border-t border-blue-200/80 space-y-1.5 text-[11px] text-stone-700 leading-relaxed animate-in fade-in">
              <div className="font-extrabold text-[#1F3B8C]">Online AI Processing Disclosure:</div>
              <p>
                • <strong>What is sent when online:</strong> Only the typed health question, recent message context in this session, selected language ({language.toUpperCase()}), and relevant Ethiopian clinical guideline excerpts from our library.
              </p>
              <p>
                • <strong>What is NEVER sent:</strong> Your name, phone number, device IP, exact GPS coordinates, cycle dates, pregnancy tracking logs, saved clinics, or reminders.
              </p>
              <p>
                • <strong>Zero Chat Logging:</strong> Conversations are not recorded on any remote database or disk.
              </p>
              <p>
                • <strong>Offline Mode:</strong> When offline or using the offline guide, 0 bytes are transmitted over the network; all searches run locally on your device.
              </p>
            </div>
          )}
        </div>

        {/* Offline notice bar if not connected */}
        {!isOnline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shrink-0">
            <span className="font-semibold flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Offline Guide Active: Searches local clinical library without internet. Zero data usage.
            </span>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              Local DB
            </span>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isDanger = msg.dangerSignDetected;
            const feedback = feedbackMap[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-4 shadow-xs text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1F3B8C] text-white rounded-tr-xs'
                      : isDanger
                      ? 'bg-red-50 border-2 border-red-500 text-stone-900 rounded-tl-xs ring-2 ring-red-200'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                  }`}
                >
                  {isDanger && !isUser && (
                    <div className="mb-3 p-3 bg-red-600 text-white rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2">
                        <AlertOctagon className="w-5 h-5 text-amber-200 animate-pulse shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wide">
                          Critical Danger Sign Detected!
                        </span>
                      </div>
                      <a
                        href="tel:907"
                        className="text-xs bg-white text-red-700 font-extrabold px-2.5 py-1 rounded-xl shrink-0 hover:bg-red-50 cursor-pointer"
                      >
                        Call 907 Ambulance
                      </a>
                    </div>
                  )}

                  {/* Message Body with Highlighted Clinical Section */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                  ) : (
                    renderMessageContent(msg.content)
                  )}

                  {/* Assistant Actions Bar: Feedback Buttons + Read Aloud + Copy */}
                  {!isUser && msg.id !== 'welcome' && msg.id !== 'welcome-reset' && (
                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
                      
                      {/* "Was this helpful?" Feedback Section */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-stone-500">
                          {t.feedbackHelpful}
                        </span>

                        {!feedback ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleFeedback(msg.id, 'yes')}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Helpful"
                            >
                              <ThumbsUp className="w-3 h-3 text-emerald-600" />
                              <span>{t.feedbackYes}</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, 'no')}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-800 text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3 h-3 text-rose-500" />
                              <span>{t.feedbackNo}</span>
                            </button>
                          </div>
                        ) : feedback === 'yes' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{t.feedbackThanksYes}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-lg">
                            <span>{t.feedbackThanksNo}</span>
                          </span>
                        )}
                      </div>

                      {/* Read Aloud & Copy */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          onClick={() => handleReadAloud(msg.id, msg.content)}
                          className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                            isSpeakingId === msg.id ? 'text-[#F59E0B] font-bold animate-pulse' : 'hover:text-stone-800'
                          }`}
                        >
                          {isSpeakingId === msg.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 hover:text-stone-800 transition-colors cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <span className="text-[10px] text-stone-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 max-w-[85%] animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-[#1F3B8C] text-[#F59E0B] flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ring-2 ring-blue-100">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-stone-200 rounded-3xl rounded-tl-xs shadow-xs space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1F3B8C] animate-bounce" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-stone-600 font-semibold ml-1.5">
                    {t.typingIndicator}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Checking WHO & Ethiopian FMoH guidelines...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Real-Time Danger Pre-Check Banner on User Input */}
        {detectedPrecheckDanger && (
          <div className="px-4 py-2.5 bg-red-600 text-white flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
              <div className="truncate">
                <strong className="uppercase">Emergency Sign Detected:</strong>{' '}
                <span>{detectedPrecheckDanger.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:907"
                className="px-2.5 py-1 rounded-lg bg-white text-red-700 font-extrabold text-[11px] hover:bg-red-50 flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call 907</span>
              </a>
              <button
                onClick={() =>
                  onTriggerDangerAlert(
                    `${detectedPrecheckDanger.title} — ${detectedPrecheckDanger.urgencyText}`
                  )
                }
                className="text-[11px] underline font-bold hover:text-amber-200 cursor-pointer"
              >
                View Steps
              </button>
            </div>
          </div>
        )}

        {/* Quick-Reply Chips Bar */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-extrabold text-stone-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F59E0B]" />
              {t.quickRepliesTitle}
            </span>
            <span className="text-[10px] text-stone-400 uppercase font-semibold">
              Tap to Ask
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* Dedicated Emergency & HIV Fast Chips */}
            <button
              type="button"
              onClick={() => handleQuickReplyClick('I may have been exposed to HIV. How do I access PEP within 72 hours in Ethiopia?')}
              disabled={isLoading}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 min-h-[32px] flex items-center gap-1"
            >
              <span>⚡ HIV PEP in 72h</span>
              <ArrowRight className="w-3 h-3 text-red-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickReplyClick('How does emergency contraception (Postinor-2) work and what is the exact timeframe?')}
              disabled={isLoading}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 min-h-[32px] flex items-center gap-1"
            >
              <span>⚡ Emergency Contraception</span>
              <ArrowRight className="w-3 h-3 text-amber-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickReplyClick('What are the critical danger signs in pregnancy where I should rush to hospital immediately?')}
              disabled={isLoading}
              className="text-xs bg-red-50 hover:bg-red-100 text-red-800 font-bold border border-red-200 px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 min-h-[32px] flex items-center gap-1"
            >
              <span>⚡ Pregnancy Danger Signs</span>
              <ArrowRight className="w-3 h-3 text-red-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickReplyClick('What are common STI symptoms in Ethiopia and why do both partners need treatment?')}
              disabled={isLoading}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-[#1F3B8C] font-bold border border-blue-200 px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 min-h-[32px] flex items-center gap-1"
            >
              <span>STIs & Partner Care</span>
              <ArrowRight className="w-3 h-3 text-[#F59E0B]" />
            </button>

            {t.quickReplies.map((chip: QuickReplyItem, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickReplyClick(chip.query)}
                disabled={isLoading}
                className="text-xs bg-white hover:bg-blue-50 text-[#1F3B8C] font-semibold border border-stone-200 hover:border-[#1F3B8C] px-3 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50 min-h-[32px] flex items-center gap-1"
              >
                <span>{chip.label}</span>
                <ArrowRight className="w-3 h-3 text-[#F59E0B]" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Form with Large Tap Targets (≥ 48px) */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={t.chatPlaceholder}
              disabled={isLoading}
              className={`flex-1 bg-stone-50 border rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden min-h-[48px] transition-colors ${
                detectedPrecheckDanger
                  ? 'border-red-400 focus:border-red-600 ring-1 ring-red-200'
                  : 'border-stone-300 focus:border-[#1F3B8C] focus:bg-white'
              }`}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold p-3.5 rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label={t.chatSend}
            >
              <Send className="w-5 h-5 text-[#F59E0B]" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.disclaimer}</span>
            </div>
            <span className="hidden sm:inline">Grade 6 accessible English/Ethiopic</span>
          </div>
        </div>

      </div>
    </div>
  );
};
