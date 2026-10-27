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
} from 'lucide-react';
import { Message, JourneyStage, LanguageCode } from '../types/srmh';
import { translations } from '../data/translations';
import { CRITICAL_DANGER_SYMPTOMS } from '../data/srmhData';
import { COMPREHENSIVE_HEALTH_SECTIONS, TIME_SENSITIVE_EMERGENCIES } from '../data/emergencyAndHivData';
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
};

/**
 * Intelligent Offline Guide Search Engine
 * When offline, searches local reviewed clinical topics, time-sensitive emergencies,
 * and danger rules with zero API call.
 */
function getOfflineGuideAnswer(query: string, language: LanguageCode): { reply: string; dangerDetected: boolean } {
  const lower = query.toLowerCase();

  // 1. Critical Obstetric & Medical Danger Symptoms
  for (const danger of CRITICAL_DANGER_SYMPTOMS) {
    for (const kw of danger.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return {
          reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n🚨 **CRITICAL MEDICAL EMERGENCY DETECTED:**\n${danger.urgencyText}\n\n**Immediate Actions in Ethiopia:**\n• Go immediately to the nearest Emergency Department or Health Center.\n• Emergency Ambulance: Dial **907 (Red Cross)** or **952 (Addis Ababa EMS)**.\n• FMoH National Health Line: Dial **8335**.\n\n**When to see a clinician:** Seek immediate clinical emergency care now. Do not delay.\n\n*Source: Ethiopian National Emergency Obstetric and Clinical Protocols [VERIFIED]*`,
          dangerDetected: true,
        };
      }
    }
  }

  // 2. HIV Exposure / PEP within 72 Hours / PrEP
  if (lower.includes('pep') || lower.includes('hiv') || lower.includes('72') || lower.includes('exposure') || lower.includes('ኤችአይቪ') || lower.includes('መጋለጥ')) {
    const pepInfo = TIME_SENSITIVE_EMERGENCIES.find((e) => e.id === 'pep_72h')!;
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n**${pepInfo.title}**\n\n${pepInfo.headline}\n\n${pepInfo.explanation}\n\n**Key Time-Sensitive Guidance:**\n• **Strict Window:** PEP must be started strictly within **72 hours** of exposure (ideally within 2 to 24 hours).\n• **Where to Go:** Visit any public Hospital Emergency Department or Woreda Health Center in Ethiopia (ask for the PEP/One-Stop clinic).\n• **Cost:** PEP and testing are free and confidential in Ethiopian public facilities.\n• **Hotlines:** Call toll-free **8335 (FMoH)** or **8044 (Marie Stopes)**.\n\n**When to see a clinician:** Seek clinical evaluation immediately within 72 hours. Do not wait for symptoms.\n\n*${pepInfo.source}*`,
      dangerDetected: false,
    };
  }

  // 3. Emergency Contraception (Postinor / Levonorgestrel / Copper IUD)
  if (lower.includes('postinor') || lower.includes('emergency contraception') || lower.includes('morning after') || lower.includes('unprotected') || lower.includes('ፖስቲኖር') || lower.includes('የአደጋ ጊዜ')) {
    const ecInfo = TIME_SENSITIVE_EMERGENCIES.find((e) => e.id === 'emergency_contraception')!;
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n**${ecInfo.title}**\n\n${ecInfo.headline}\n\n${ecInfo.explanation}\n\n**Key Facts in Ethiopia:**\n• Emergency contraceptive pills (Postinor-2 / Levonorgestrel) are most effective within the first 24 hours, but work up to 72 to 120 hours.\n• Available over-the-counter at licensed community pharmacies and free or low-cost at Health Centers and Marie Stopes clinics.\n• A Copper IUD inserted by a trained clinician within 5 days (120h) is over 99% effective.\n• Emergency contraception does NOT protect against HIV or STIs.\n\n**When to see a clinician:** Consult a pharmacist or visit your health center as soon as possible after unprotected intercourse.\n\n*${ecInfo.source}*`,
      dangerDetected: false,
    };
  }

  // 4. Sexual Assault / Trauma Support / GBV
  if (lower.includes('rape') || lower.includes('assault') || lower.includes('forced') || lower.includes('violence') || lower.includes('ተደፍሬ') || lower.includes('ጥቃት') || lower.includes('dirqisiifame')) {
    const svInfo = TIME_SENSITIVE_EMERGENCIES.find((e) => e.id === 'sexual_violence_support')!;
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n**${svInfo.title}**\n\n${svInfo.headline}\n\n${svInfo.explanation}\n\n**Confidential Survivor Care in Ethiopia:**\n• Go to the nearest public hospital and request their **One-Stop Center** (providing free emergency medical care, HIV PEP within 72h, emergency contraception, wound care, and trauma counseling in one private room).\n• **Confidential Toll-Free Helplines:**\n  - AWSAD Safe Shelter: **6226**\n  - FMoH Health Helpline: **8335**\n  - Marie Stopes Helpline: **8044**\n\n**When to see a clinician:** Visit a hospital One-Stop Center within 72 hours for compassionate, non-judgmental care.\n\n*${svInfo.source}*`,
      dangerDetected: false,
    };
  }

  // 5. STIs / Discharge / Pain / Partner Treatment
  if (lower.includes('sti') || lower.includes('discharge') || lower.includes('burning') || lower.includes('syphilis') || lower.includes('gonorrhea') || lower.includes('sores') || lower.includes('አባላዘር') || lower.includes('ፈሳሽ') || lower.includes('ቁስል')) {
    const stiSec = COMPREHENSIVE_HEALTH_SECTIONS.find((s) => s.id === 'stis_common_and_asymptomatic')!;
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n**${stiSec.title}**\n\n${stiSec.summary}\n\n**Clinical Guidance:**\n• Common symptoms: Abnormal vaginal/penile discharge, burning urination, genital ulcers, pelvic pain.\n• **Silent Infections:** Over 70% of women and 50% of men have zero symptoms but can still pass the infection.\n• **Dual Partner Treatment:** Both sexual partners MUST take medication at the exact same time to prevent reinfection.\n• **Complete Antibiotics:** Never stop treatment early even if symptoms disappear.\n\n**When to see a clinician:** Visit your Kebele Health Post or Woreda Health Center within 24–48 hours for syndromic STI management.\n\n*${stiSec.sourceTag}*`,
      dangerDetected: false,
    };
  }

  // 6. Pregnancy & 8 ANC Visits
  if (lower.includes('pregnant') || lower.includes('pregnancy') || lower.includes('anc') || lower.includes('antenatal') || lower.includes('baby') || lower.includes('kicks') || lower.includes('እርግዝና') || lower.includes('ulfa')) {
    const ancSec = COMPREHENSIVE_HEALTH_SECTIONS.find((s) => s.id === 'pregnancy_signs_tests_anc')!;
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n**${ancSec.title}**\n\n${ancSec.summary}\n\n**Ethiopian FMoH 8-Contact ANC Schedule:**\n• Contact 1: Before 12 weeks (dating, anemia check, start daily IFA supplements).\n• Contact 2: 20 weeks (fetal growth check, ultrasound).\n• Contacts 3 to 8: At 26, 30, 34, 36, 38, and 40 weeks.\n\n**When to see a clinician:** Register for ANC at your health post before 12 weeks. If you experience severe bleeding, severe headache, or decreased baby kicks, go to maternity triage immediately.\n\n*${ancSec.sourceTag}*`,
      dangerDetected: false,
    };
  }

  // 7. Menstrual Health / Missed Period / Cramps
  if (lower.includes('period') || lower.includes('menstrua') || lower.includes('cramp') || lower.includes('cycle') || lower.includes('ወር አበባ') || lower.includes('laguu') || lower.includes('ጽግያት')) {
    return {
      reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\n**Menstrual Health & Cycle Guidance**\n\n• Normal menstrual cycles range from 21 to 35 days (average 28 days), with bleeding lasting 3 to 7 days.\n• A missed period can be caused by early pregnancy, hormonal fluctuations, intense physical/emotional stress, or rapid weight changes.\n• For menstrual cramps, gentle heat compress, hydration, and resting help soothe uterine contractions.\n\n**When to see a clinician:** If your period is more than 2 weeks late with pregnancy possibility, or if you soak more than 1 pad every 1–2 hours with severe pain, visit a health center.\n\n*Source: WHO Menstrual Health Guidelines & Ethiopian FMoH Materials [VERIFIED]*`,
      dangerDetected: false,
    };
  }

  // 8. General Health Library Guidance
  return {
    reply: `🏷️ [Offline Guide: not live AI • Grounded in Reviewed Library]\n\nI am currently responding in **Offline Guide Mode** using reviewed healthcare resources stored on your device.\n\n**Key Health Principles in Ethiopia:**\n• **Family Planning:** Free reversible methods (implants, injectables, pills, IUDs) and condoms are provided at all public Health Posts and Centers.\n• **Emergency Window:** PEP for HIV must be started strictly within **72 hours**; emergency contraception works best within 24 to 72 hours.\n• **Confidentiality:** Youth-friendly services (YFS) protect your privacy without requiring parental or partner consent.\n\n**When to see a clinician:** For any persistent pain, unusual discharge, or emergency symptoms, visit your local Health Center or call toll-free **8335 (FMoH)** or **8044 (Marie Stopes)**.\n\n*Educational content based on WHO and Ministry of Health materials, pending clinical review.*`,
    dangerDetected: false,
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
    const query = (textOverride || input).trim();
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
            content: m.content,
          })),
          userLanguage: language,
          currentStage,
        }),
      });

      const data = await response.json();
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
      console.warn('Live API request failed, falling back to local offline guide:', err);
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

          <div className="flex items-center gap-2">
            {onOpenEmergencyModule && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEmergencyModule('emergencies');
                }}
                className="hidden sm:inline-flex text-[11px] bg-red-700 hover:bg-red-800 text-white font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
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

            {t.quickReplies.map((chip, idx) => (
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
