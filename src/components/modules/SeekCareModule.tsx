import React, { useState } from 'react';
import {
  PhoneCall,
  MapPin,
  ClipboardList,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Building2,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { LanguageCode, TriageSurveyAnswers, TriageAssessmentResult } from '../../types/srmh';
import { ETHIOPIAN_MOCK_FACILITIES } from '../../data/srmhData';

interface SeekCareModuleProps {
  language: LanguageCode;
  onAskQuestion: (prompt: string) => void;
  onOpenEmergencyModule?: (tab?: string) => void;
}

const REGIONS = ['All Regions', 'Addis Ababa', 'Oromia', 'Amhara', 'Tigray', 'Sidama', 'Dire Dawa'];

export const SeekCareModule: React.FC<SeekCareModuleProps> = ({
  language,
  onAskQuestion,
  onOpenEmergencyModule,
}) => {
  // Survey step state: 0 to 6
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasCompletedTriage, setHasCompletedTriage] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Facility filter
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');

  // Answers State
  const [answers, setAnswers] = useState<TriageSurveyAnswers>({
    bleeding: '',
    pain: '',
    fever: '',
    pregnancyStatus: '',
    pregnancySpecific: '',
    safety: '',
    symptomDuration: '',
  });

  // Triage Questions Configuration
  const QUESTIONS = [
    {
      key: 'bleeding' as keyof TriageSurveyAnswers,
      title: '1. Vaginal Bleeding',
      subtitle: 'What is your current bleeding status?',
      options: [
        { id: 'none', label: 'No bleeding or spotting', isRed: false, isAmber: false },
        { id: 'normal_period', label: 'Normal period flow (1–3 pads/day)', isRed: false, isAmber: false },
        { id: 'light_spotting', label: 'Light spotting or brownish stains', isRed: false, isAmber: true },
        {
          id: 'heavy_bleeding',
          label: 'Heavy bleeding: Soaking >1 pad/cloth an hour, large clots, or bleeding in pregnancy',
          isRed: true,
          isAmber: false,
          flagText: 'Severe Bleeding / Hemorrhage Warning',
        },
      ],
    },
    {
      key: 'pain' as keyof TriageSurveyAnswers,
      title: '2. Pain & Discomfort',
      subtitle: 'Where is the pain and how intense is it?',
      options: [
        { id: 'none', label: 'No pain or very mild discomfort', isRed: false, isAmber: false },
        { id: 'mild_cramps', label: 'Typical mild menstrual cramps', isRed: false, isAmber: false },
        { id: 'burning_urination', label: 'Burning or stinging when urinating', isRed: false, isAmber: true },
        {
          id: 'severe_pelvic_pain',
          label: 'Severe, sudden, or unbearable lower abdominal or pelvic pain',
          isRed: true,
          isAmber: false,
          flagText: 'Severe Acute Pelvic/Abdominal Pain',
        },
        {
          id: 'severe_headache_vision',
          label: 'Severe pounding headache, blurred vision, or intense chest pain',
          isRed: true,
          isAmber: false,
          flagText: 'Pre-eclampsia / Neurological Warning Sign',
        },
      ],
    },
    {
      key: 'fever' as keyof TriageSurveyAnswers,
      title: '3. Body Temperature & Infection Signs',
      subtitle: 'Are you experiencing fever, chills, or unusual discharge?',
      options: [
        { id: 'none', label: 'Normal body temperature (no fever)', isRed: false, isAmber: false },
        { id: 'mild_warmth', label: 'Feeling slightly warm or mild cold (<37.8°C / 100°F)', isRed: false, isAmber: true },
        { id: 'unusual_discharge', label: 'Unusual vaginal discharge (yellow/green, bad odor, itching) without fever', isRed: false, isAmber: true },
        {
          id: 'high_fever_sepsis',
          label: 'High fever (>38°C / 100.4°F) with shaking chills, or foul-smelling discharge after delivery/abortion',
          isRed: true,
          isAmber: false,
          flagText: 'High Fever / Postpartum Sepsis Danger',
        },
      ],
    },
    {
      key: 'pregnancyStatus' as keyof TriageSurveyAnswers,
      title: '4. Pregnancy Status',
      subtitle: 'What is your current pregnancy or postpartum stage?',
      options: [
        { id: 'not_pregnant', label: 'Not currently pregnant', isRed: false, isAmber: false },
        { id: 'unsure_missed', label: 'Unsure / Missed my period by 1 to 2+ weeks', isRed: false, isAmber: true },
        { id: 'pregnant_under_28', label: 'Currently pregnant: Under 28 weeks (1st or 2nd Trimester)', isRed: false, isAmber: false },
        { id: 'pregnant_over_28', label: 'Currently pregnant: 28 weeks or more (3rd Trimester)', isRed: false, isAmber: false },
        { id: 'recent_postpartum', label: 'Gave birth or had miscarriage/abortion in the last 6 weeks', isRed: false, isAmber: false },
      ],
    },
    {
      key: 'pregnancySpecific' as keyof TriageSurveyAnswers,
      title: '5. Pregnancy & Fetal Symptoms',
      subtitle: 'Are you experiencing any fetal movement or blood pressure symptoms?',
      options: [
        { id: 'not_applicable', label: 'Not pregnant / Normal active baby kicks', isRed: false, isAmber: false },
        { id: 'mild_nausea', label: 'Mild morning sickness / early pregnancy nausea', isRed: false, isAmber: false },
        {
          id: 'reduced_kicks',
          label: 'Baby has stopped moving or kicks have dropped noticeably (<10 kicks in 2 hours after 28 wks)',
          isRed: true,
          isAmber: false,
          flagText: 'Decreased / Absent Fetal Movement',
        },
        {
          id: 'swelling_flashes',
          label: 'Sudden severe swelling of face/hands, seeing light flashes or vision loss',
          isRed: true,
          isAmber: false,
          flagText: 'Pre-eclampsia Obstetric Danger Sign',
        },
        {
          id: 'water_broken_preterm',
          label: 'Water broke (leaking fluid) or painful regular contractions before 37 weeks',
          isRed: true,
          isAmber: false,
          flagText: 'Preterm Rupture of Membranes / Preterm Labor',
        },
      ],
    },
    {
      key: 'safety' as keyof TriageSurveyAnswers,
      title: '6. Safety, Violence & Crisis (GBV)',
      subtitle: 'Are you safe in your environment and relationships?',
      options: [
        { id: 'safe', label: 'I am safe and supported', isRed: false, isAmber: false },
        { id: 'mild_stress', label: 'Experiencing mild stress or fatigue', isRed: false, isAmber: false },
        {
          id: 'sexual_assault_72h',
          label: 'Experienced forced sex, sexual assault, or coercion in the last 72 hours',
          isRed: true,
          isAmber: false,
          flagText: 'Urgent Sexual Assault Crisis (Needs HIV PEP within 72 hrs)',
        },
        {
          id: 'physical_danger',
          label: 'Experienced physical violence or feeling in immediate physical danger',
          isRed: true,
          isAmber: false,
          flagText: 'Urgent Safety / Protection Crisis',
        },
        {
          id: 'self_harm',
          label: 'Having thoughts of harming myself or feeling severe emotional despair',
          isRed: true,
          isAmber: false,
          flagText: 'Mental Health Crisis / Self-Harm Risk',
        },
      ],
    },
    {
      key: 'symptomDuration' as keyof TriageSurveyAnswers,
      title: '7. Duration of Symptoms',
      subtitle: 'How long have you had these symptoms?',
      options: [
        { id: 'today', label: 'Just started today (Less than 24 hours)', isRed: false, isAmber: false },
        { id: '1_3_days', label: '1 to 3 days', isRed: false, isAmber: false },
        { id: 'over_3_days', label: 'More than 3 days', isRed: false, isAmber: true },
        { id: 'ongoing', label: 'Ongoing or recurring over weeks', isRed: false, isAmber: true },
      ],
    },
  ];

  const handleSelectOption = (key: keyof TriageSurveyAnswers, id: string) => {
    setAnswers((prev) => ({ ...prev, [key]: id }));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setHasCompletedTriage(true);
    }
  };

  /**
   * Evaluates survey answers to output one of three colour-coded results (green, amber, red)
   */
  const evaluateTriage = (): TriageAssessmentResult => {
    const redReasons: string[] = [];
    const amberReasons: string[] = [];

    // Check all questions for red or amber triggers
    QUESTIONS.forEach((q) => {
      const selectedId = answers[q.key];
      const matchedOpt = q.options.find((opt) => opt.id === selectedId);
      if (matchedOpt) {
        if (matchedOpt.isRed) {
          redReasons.push(matchedOpt.flagText || matchedOpt.label);
        } else if (matchedOpt.isAmber) {
          amberReasons.push(matchedOpt.label);
        }
      }
    });

    const now = new Date();
    const timestamp = now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // 🔴 RED TRIAGE EVALUATION
    if (redReasons.length > 0) {
      return {
        color: 'red',
        title: '🔴 RED TRIAGE: GO TO A HEALTH FACILITY IMMEDIATELY',
        headline: 'Urgent Obstetric or Medical Emergency Detected',
        urgencyLevel: 'Emergency (Proceed Right Now)',
        reasons: redReasons,
        plainLanguageNextSteps: [
          'Go immediately to your nearest Woreda Health Center or Hospital Emergency Maternity Ward. Do not wait to see if symptoms improve.',
          'Bring an adult family member or trusted companion to support you during travel.',
          'If you are bleeding or feel lightheaded, lie down on your left side with your feet slightly raised during transport.',
          'Bring your Ethiopian Antenatal Care (ANC) booklet, child health card, and list of any medications you take.',
          'If transport is unavailable in your kebele, call the Ethiopian Red Cross Society Ambulance at 907 or dial 8335.',
        ],
        recommendedFacilityType: 'General Hospital Emergency Maternity Ward / Primary Hospital (CEmONC)',
        vitalsToCheck: [
          'Blood Pressure (BP) — rule out severe pre-eclampsia',
          'Temperature & Pulse — evaluate for sepsis or hemorrhagic shock',
          'Fetal Heart Rate (FHR) by Doppler / fetoscope',
          'Complete Blood Count (CBC) / Hemoglobin',
          'Urgent pelvic ultrasound / sterile speculum exam',
        ],
        questionsForClinician: [
          'What is causing my acute symptoms right now?',
          'Is my baby’s heartbeat strong and stable?',
          'Do I need IV fluids, emergency medication, or an ultrasound scan?',
          'Will I need to stay in the health facility for observation?',
        ],
        timestamp,
      };
    }

    // 🟡 AMBER TRIAGE EVALUATION
    if (amberReasons.length > 0) {
      return {
        color: 'amber',
        title: '🟡 AMBER TRIAGE: SEE A CLINIC SOON',
        headline: 'In-Person Clinical Consultation Recommended Within 24–48 Hours',
        urgencyLevel: 'Priority Clinical Care (Visit within 1–2 days)',
        reasons: amberReasons,
        plainLanguageNextSteps: [
          'Visit your local Kebele Health Extension Worker (HEW) at the Health Post or Woreda Health Center within 24 to 48 hours.',
          'If you have unusual vaginal discharge or painful urination, avoid sexual intercourse until tested and treated.',
          'If your period is delayed, request a free urine pregnancy test at your health post.',
          'Drink plenty of clean water, rest, and keep a clean cotton pad to monitor any discharge or spotting volume.',
          'CRITICAL RULE: If your condition suddenly worsens—such as heavy bleeding, high fever, or severe pain—upgrade immediately to RED and go to the nearest emergency facility.',
        ],
        recommendedFacilityType: 'Kebele Health Post (HEW) / Woreda Health Center (Youth-Friendly Services)',
        vitalsToCheck: [
          'Blood Pressure and resting pulse',
          'Urine dipstick analysis (for UTI, protein, or pregnancy hCG)',
          'Pelvic / speculum examination if indicated',
          'Syphilis & HIV screening (free at public health centers)',
        ],
        questionsForClinician: [
          'Is this symptom caused by an infection, pregnancy, or hormonal imbalance?',
          'Does my partner also need antibiotic treatment at the same time?',
          'Are there any medications or vitamins I should start taking today?',
        ],
        timestamp,
      };
    }

    // 🟢 GREEN TRIAGE EVALUATION
    return {
      color: 'green',
      title: '🟢 GREEN TRIAGE: SELF-CARE & ROUTINE MONITORING',
      headline: 'Normal or Mild Symptoms — Home Care & Routine Follow-Up',
      urgencyLevel: 'Self-Care & Normal Routine Care',
      reasons: ['No urgent or red-flag symptoms reported.'],
      plainLanguageNextSteps: [
        'Rest in a comfortable position and stay well hydrated with clean, boiled or bottled water.',
        'For mild menstrual cramps, place a warm water bottle or warm cloth on your lower abdomen and engage in light walking.',
        'Maintain good daily personal hygiene with clean water and mild soap.',
        'Continue taking routine daily supplements (such as Iron & Folic Acid tablets if pregnant or preparing for pregnancy).',
        'Follow your regular schedule for Kebele Health Post checkups or routine Ethiopian ANC contacts.',
        'Reassess your symptoms if they persist for more than 3 days or if new pain or bleeding develops.',
      ],
      recommendedFacilityType: 'Home Care & Routine Kebele Health Post Follow-Up',
      vitalsToCheck: [
        'Routine blood pressure check at next scheduled clinic visit',
        'Standard nutritional counseling and weight monitoring',
      ],
      questionsForClinician: [
        'What preventive vitamins or family planning methods are best for my health?',
        'When is my next recommended routine checkup?',
      ],
      timestamp,
    };
  };

  const triageResult = evaluateTriage();

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const textSummary = `--- MAM-to-MAM AI Clinical Patient Hand-Off (Ethiopia) ---
Generated: ${triageResult.timestamp}
TRIAGE LEVEL: ${triageResult.title}
Headline: ${triageResult.headline}

PATIENT REPORTED SYMPTOMS:
• Bleeding: ${answers.bleeding || 'Not specified'}
• Pain: ${answers.pain || 'Not specified'}
• Fever/Infection: ${answers.fever || 'Not specified'}
• Pregnancy Status: ${answers.pregnancyStatus || 'Not specified'}
• Pregnancy Complications: ${answers.pregnancySpecific || 'None'}
• Safety/GBV: ${answers.safety || 'Safe'}
• Duration: ${answers.symptomDuration || 'Not specified'}

FLAGGED REASONS:
${triageResult.reasons.map((r) => `• ${r}`).join('\n')}

RECOMMENDED FACILITY TIER:
${triageResult.recommendedFacilityType}

RECOMMENDED CLINICAL VITALS TO CHECK:
${triageResult.vitalsToCheck.map((v) => `[ ] ${v}`).join('\n')}

NEXT STEPS FOR PATIENT:
${triageResult.plainLanguageNextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---
Disclaimer: Educational content based on WHO and Ministry of Health materials, pending clinical review. MAM-to-MAM AI is an educational navigation guide, not a substitute for clinical diagnosis.`;

    try {
      navigator.clipboard.writeText(textSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // Fallback if clipboard API restricted
    }
  };

  const handleReset = () => {
    setAnswers({
      bleeding: '',
      pain: '',
      fever: '',
      pregnancyStatus: '',
      pregnancySpecific: '',
      safety: '',
      symptomDuration: '',
    });
    setCurrentStep(0);
    setHasCompletedTriage(false);
  };

  const currentQ = QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

  const filteredFacilities = selectedRegion === 'All Regions'
    ? ETHIOPIAN_MOCK_FACILITIES
    : ETHIOPIAN_MOCK_FACILITIES.filter((f) => f.region === selectedRegion);

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs no-print">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">
            Module 4
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs font-bold text-[#1F3B8C]">Clinical Triage Flow</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1F3B8C] tracking-tight">
          Seek Care: 7-Question Clinical Triage & Navigation
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Answer 7 structured clinical questions covering bleeding, pain, fever, pregnancy, and safety. You will receive an instant colour-coded triage recommendation (Green, Amber, or Red) and a printable summary to hand to your nurse or clinician.
        </p>

        {/* Dedicated Offline Questionnaires Launcher */}
        {onOpenEmergencyModule && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-red-700 tracking-wider block">
                100% Offline Guided Triage
              </span>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1F3B8C]">
                Dedicated Questionnaires: Pregnancy Danger Signs & HIV/STI 72h PEP
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Run device-only emergency assessments with instant RED/AMBER results, One-Stop Center locators & clinician summaries.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => onOpenEmergencyModule('triage')}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs cursor-pointer whitespace-nowrap"
              >
                Launch Offline Triage →
              </button>
              <button
                onClick={() => onOpenEmergencyModule('emergencies')}
                className="px-3.5 py-2 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-xs shadow-xs cursor-pointer whitespace-nowrap"
              >
                72h PEP & GBV Care
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 1. TRIAGE QUESTIONNAIRE STEPPER (If not completed) */}
      {!hasCompletedTriage ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6 no-print">
          {/* Progress Bar & Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-600">
              <span className="text-[#1F3B8C]">
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span className="text-[#F59E0B] font-extrabold">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#1F3B8C] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-2 border-b border-stone-100 pb-3">
            <h3 className="text-base sm:text-lg font-black text-stone-900">
              {currentQ.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Options List (Large Tap Targets >= 48px) */}
          <div className="space-y-2.5">
            {currentQ.options.map((option) => {
              const isSelected = answers[currentQ.key] === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.key, option.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[56px] flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1F3B8C] text-white border-[#1F3B8C] shadow-md ring-2 ring-blue-300'
                      : option.isRed
                      ? 'bg-red-50/60 hover:bg-red-100/70 text-stone-900 border-red-200 hover:border-red-400'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-white bg-[#F59E0B]'
                          : option.isRed
                          ? 'border-red-500 bg-white'
                          : 'border-stone-400 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#1F3B8C]" />}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-snug">
                      {option.label}
                    </span>
                  </div>

                  {option.isRed && (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 shrink-0">
                      Emergency Sign
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            >
              ← Previous
            </button>

            {answers[currentQ.key] && currentStep < QUESTIONS.length - 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white text-xs font-bold transition-all cursor-pointer shadow-xs min-h-[44px] flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 2. TRIAGE RESULTS VIEW (Green, Amber, or Red) */
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Colour-Coded Result Card */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border-2 shadow-md space-y-4 ${
              triageResult.color === 'red'
                ? 'bg-red-50 border-red-600 text-red-950'
                : triageResult.color === 'amber'
                ? 'bg-amber-50 border-[#F59E0B] text-amber-950'
                : 'bg-emerald-50 border-emerald-600 text-emerald-950'
            }`}
          >
            {/* Urgency Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3.5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider text-white shadow-xs ${
                  triageResult.color === 'red'
                    ? 'bg-red-600 animate-pulse'
                    : triageResult.color === 'amber'
                    ? 'bg-[#F59E0B] text-stone-900'
                    : 'bg-emerald-600'
                }`}
              >
                {triageResult.title}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {triageResult.headline}
              </h3>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                Assessed at: {triageResult.timestamp} (Ethiopian Healthcare Guidelines)
              </p>
            </div>

            {/* Flagged Reasons Callout */}
            {triageResult.reasons.length > 0 && (
              <div className="p-4 rounded-2xl bg-white/80 border border-current/20 space-y-1.5 text-xs">
                <span className="font-extrabold uppercase tracking-wide block">
                  Identified Clinical Concerns:
                </span>
                <ul className="list-disc list-inside space-y-1 font-medium">
                  {triageResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plain-Language Next Steps */}
            <div className="space-y-2 pt-1">
              <h4 className="text-sm font-extrabold uppercase tracking-wide">
                Plain-Language Next Steps:
              </h4>
              <div className="space-y-2 text-xs sm:text-sm font-medium">
                {triageResult.plainLanguageNextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-white/70 p-3 rounded-2xl border border-current/15">
                    <span className="w-5 h-5 rounded-full bg-current text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                      <span className={triageResult.color === 'red' ? 'text-white' : triageResult.color === 'amber' ? 'text-amber-950' : 'text-white'}>
                        {idx + 1}
                      </span>
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Calling Hotlines for Red & Amber */}
            {triageResult.color === 'red' && (
              <div className="pt-3 border-t border-red-200 flex flex-wrap gap-2.5 no-print">
                <a
                  href="tel:907"
                  className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 907 (Red Cross Ambulance)</span>
                </a>
                <a
                  href="tel:8335"
                  className="px-5 py-3 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <PhoneCall className="w-4 h-4 text-[#F59E0B]" />
                  <span>Call 8335 (FMoH Line)</span>
                </a>
                <a
                  href="tel:952"
                  className="px-4 py-3 rounded-2xl bg-stone-800 text-white font-bold text-xs flex items-center gap-2"
                >
                  952 Addis EMS
                </a>
              </div>
            )}
          </div>

          {/* 3. PRINTABLE "SHARE WITH CLINICIAN" SUMMARY */}
          <div className="printable-summary bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-300 shadow-md space-y-6">
            {/* Summary Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1F3B8C] text-[#F59E0B] flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <h3 className="font-black text-base sm:text-lg text-[#1F3B8C]">
                    MAM-to-MAM AI Clinical Hand-Off Summary
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Standardized triage snapshot for Health Extension Workers, Midwives, and Clinicians (Ethiopia)
                </p>
              </div>

              <div className="text-right text-xs text-stone-500">
                <div>Date: <strong>{triageResult.timestamp}</strong></div>
                <div className="font-bold text-[#1F3B8C] uppercase tracking-wide">
                  Triage Status: {triageResult.color.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Patient Reported Symptoms Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-[#1F3B8C]" />
                <span>Patient-Reported Symptom Snapshot</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-800">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block text-[11px]">1. Vaginal Bleeding:</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{answers.bleeding || 'None'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block text-[11px]">2. Pain & Discomfort:</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{answers.pain || 'None'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block text-[11px]">3. Body Temperature / Infection:</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{answers.fever || 'None'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block text-[11px]">4. Pregnancy / Postpartum Status:</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{answers.pregnancyStatus || 'Not pregnant'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block text-[11px]">5. Fetal / Pregnancy Complications:</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{answers.pregnancySpecific || 'None / Not applicable'}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium block text-[11px]">6. Safety / Violence / Crisis:</span>
                  <span className="font-bold text-stone-900 mt-0.5 block">{answers.safety || 'Safe'}</span>
                </div>
              </div>
            </div>

            {/* Provider Clinical Exam & Vitals Checklist */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2.5 text-xs">
              <span className="font-extrabold text-[#1F3B8C] uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#1F3B8C]" />
                <span>Recommended Clinical Vitals & Screening to Check:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-800">
                {triageResult.vitalsToCheck.map((vital, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-medium">
                    <span className="w-3.5 h-3.5 rounded-xs border border-stone-400 bg-white inline-block shrink-0" />
                    <span>{vital}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to Ask the Clinician */}
            <div className="space-y-2 text-xs text-stone-700">
              <span className="font-extrabold uppercase tracking-wider text-stone-800 block">
                Suggested Questions to Ask During Your Visit:
              </span>
              <ul className="list-disc list-inside space-y-1 text-stone-600 font-medium">
                {triageResult.questionsForClinician.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons (Print, Copy, Retake) */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer min-h-[44px]"
                >
                  <Printer className="w-4 h-4 text-[#F59E0B]" />
                  <span>Print Summary</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-2 border border-stone-300 transition-colors cursor-pointer min-h-[44px]"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy for SMS / WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Triage</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ETHIOPIAN HEALTH FACILITY DIRECTORY (ALWAYS AVAILABLE) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-5 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#1F3B8C]" />
              <span>Ethiopian Health Facility Finder</span>
            </h3>
            <p className="text-xs text-stone-500">
              Regional Health Centers, Youth-Friendly Services & Health Posts (Sample Data).
            </p>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {REGIONS.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                  selectedRegion === reg
                    ? 'bg-[#1F3B8C] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-4 rounded-3xl border border-stone-200 bg-stone-50/60 hover:bg-white transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#1F3B8C]">
                    {fac.region}
                  </span>
                  {fac.isYouthFriendly && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Youth-Friendly
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-stone-900 text-sm">
                  {fac.name}
                </h4>
                <div className="text-[11px] text-stone-500 font-semibold mt-0.5">
                  {fac.type} • {fac.woreda}
                </div>

                <p className="text-xs text-stone-600 mt-2 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{fac.address}</span>
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {fac.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white text-stone-600 px-2 py-0.5 rounded-md border border-stone-200"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-stone-700 font-mono">
                  {fac.phone}
                </span>
                {fac.phone.includes('8044') ? (
                  <a
                    href="tel:8044"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs transition-colors cursor-pointer min-h-[36px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Call 8044 (Verified)</span>
                  </a>
                ) : fac.phone.replace(/[^0-9]/g, '').length >= 3 && !fac.phone.includes('[Verify') ? (
                  <a
                    href={`tel:${fac.phone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs transition-colors cursor-pointer min-h-[36px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Call Facility</span>
                  </a>
                ) : (
                  <a
                    href="tel:8335"
                    title="Call 8335 to verify contact details for this facility"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors cursor-pointer min-h-[36px]"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                    <span>Verify via 8335</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
