import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Info,
  RotateCcw,
} from 'lucide-react';
import { LanguageCode, PreventAnswers } from '../../types/srmh';

interface PreventModuleProps {
  language: LanguageCode;
  onAskQuestion: (prompt: string) => void;
  onOpenEmergencyModule?: (tab?: string) => void;
}

export const PreventModule: React.FC<PreventModuleProps> = ({
  language,
  onAskQuestion,
  onOpenEmergencyModule,
}) => {
  const [answers, setAnswers] = useState<PreventAnswers>({
    ageGroup: '',
    pregnancyIntention: '',
    currentMethod: '',
    preferences: [],
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleTogglePreference = (pref: string) => {
    setAnswers((prev) => {
      const exists = prev.preferences.includes(pref);
      return {
        ...prev,
        preferences: exists
          ? prev.preferences.filter((p) => p !== pref)
          : [...prev.preferences, pref],
      };
    });
  };

  const isFormComplete =
    answers.ageGroup !== '' &&
    answers.pregnancyIntention !== '' &&
    answers.currentMethod !== '';

  const handleReset = () => {
    setAnswers({
      ageGroup: '',
      pregnancyIntention: '',
      currentMethod: '',
      preferences: [],
    });
    setHasSubmitted(false);
  };

  // Determine personalized guidance based on user answers
  const generateGuidance = () => {
    const isTeen = answers.ageGroup === '15-19';
    const wantsAvoid = answers.pregnancyIntention === 'avoid_now' || answers.pregnancyIntention === 'next_1_2_years';
    const isTrying = answers.pregnancyIntention === 'trying_now';
    const wantsDiscreet = answers.preferences.includes('discreet');
    const wantsBreastfeeding = answers.preferences.includes('breastfeeding');
    const wantsLongTerm = answers.preferences.includes('long_term');
    const wantsHormoneFree = answers.preferences.includes('hormone_free');
    const wantsDualProtection = answers.preferences.includes('dual_protection');

    const recommended: { name: string; tag: string; desc: string; ethiopiaContext: string }[] = [];

    if (isTrying) {
      recommended.push({
        name: 'Preconception Care & Folic Acid',
        tag: 'Fertility Preparation',
        desc: 'Begin taking daily Folic Acid (0.4mg) at least 1 month before conception to protect fetal spine development. Track your fertile window (ovulation occurs ~14 days before your period).',
        ethiopiaContext: 'Folic acid supplements are readily available at public health centers and pharmacies across Ethiopia.',
      });
      recommended.push({
        name: 'Discontinuing Current Contraceptives',
        tag: 'Fertility Return',
        desc: 'If stopping implants, pills, or IUDs, fertility returns immediately. If stopping 3-month injectables (Depo), average return to ovulation is 6 to 10 months.',
        ethiopiaContext: 'Visit your Kebele Health Extension Worker to safely remove your implant or IUD when ready.',
      });
    } else if (wantsAvoid) {
      // Long-term preference
      if (wantsLongTerm || (!wantsHormoneFree && !isTeen)) {
        recommended.push({
          name: 'Contraceptive Implants (Implanon NXT / Jadelle)',
          tag: 'Highly Recommended (LARC)',
          desc: 'Flexible matchstick-sized rod placed under the skin of the upper arm. Provides >99% continuous protection for 3 to 5 years. Can be removed at any time.',
          ethiopiaContext: 'Widely accessible and free of charge in Kebele Health Posts throughout Ethiopia. Highly favored for private, low-maintenance contraception.',
        });
      }

      // Hormone-free preference
      if (wantsHormoneFree || wantsLongTerm) {
        recommended.push({
          name: 'Copper Intrauterine Device (Copper IUD / Loop)',
          tag: 'Hormone-Free Long-Term',
          desc: 'Small T-shaped device inserted into the uterus. Preserves natural menstrual cycles without hormones. Effective for up to 10–12 years with immediate fertility return.',
          ethiopiaContext: 'Available at Woreda Health Centers, General Hospitals, and Marie Stopes / FGAE reproductive clinics.',
        });
      }

      // Discreet or short-term
      if (wantsDiscreet || answers.currentMethod === 'none') {
        recommended.push({
          name: '3-Month Injectable (Depo-Provera / Sayana Press)',
          tag: 'Discreet & Widely Used',
          desc: 'Single injection every 12 to 13 weeks. Requires no daily routine and remains completely confidential. Safe during breastfeeding.',
          ethiopiaContext: 'The most popular contraceptive method in Ethiopia, routinely administered by Kebele Health Extension Workers.',
        });
      }

      // Dual protection
      recommended.push({
        name: 'Male & Female Condoms (Dual Protection)',
        tag: 'Essential Barrier Protection',
        desc: 'The only method providing dual protection against unintended pregnancy AND Sexually Transmitted Infections (STIs & HIV).',
        ethiopiaContext: 'Freely distributed at government health centers, youth-friendly clinics, and widely accessible in local kiosks.',
      });
    }

    return {
      recommended,
      isTeen,
      hasRecentUnprotected: answers.currentMethod === 'none',
      wantsBreastfeeding,
      wantsDualProtection,
    };
  };

  const results = hasSubmitted ? generateGuidance() : null;

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">
            Module 2
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs font-bold text-[#1F3B8C]">Anonymous Prevention</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1F3B8C] tracking-tight">
          Prevent: Personalized Contraception & Protection
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Answer a 3-question anonymous assessment to discover contraceptive and STI prevention options tailored to your life stage and priorities in Ethiopia.
        </p>

        {/* Time-Sensitive Prevention Notice */}
        {onOpenEmergencyModule && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-red-700 tracking-wider block">
                Time-Sensitive Emergency Prevention
              </span>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1F3B8C]">
                HIV PEP (within 72h) & Emergency Contraception (within 72–120h)
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                If unprotected sex, condom breakage, or assault occurred recently, emergency medication works best within hours.
              </p>
            </div>
            <button
              onClick={() => onOpenEmergencyModule('emergencies')}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs cursor-pointer whitespace-nowrap self-start sm:self-center"
            >
              Check 72h Emergency Options →
            </button>
          </div>
        )}
      </div>

      {/* Questionnaire Form */}
      {!hasSubmitted ? (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          {/* Question 1: Age Group */}
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1F3B8C] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>What is your age group?</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: '15-19', label: '15 – 19 (Adolescent / Youth)' },
                { id: '20-24', label: '20 – 24 (Young Adult)' },
                { id: '25-34', label: '25 – 34' },
                { id: '35+', label: '35+' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, ageGroup: item.id }))}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer min-h-[48px] flex items-center justify-center ${
                    answers.ageGroup === item.id
                      ? 'bg-[#1F3B8C] text-white border-[#1F3B8C] shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Pregnancy Intention */}
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1F3B8C] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>What is your pregnancy intention?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'avoid_now', label: 'Delay or avoid pregnancy for now' },
                { id: 'next_1_2_years', label: 'Space child: wait 1 to 2+ years' },
                { id: 'trying_now', label: 'Actively trying to conceive' },
                { id: 'unsure', label: 'Not sure / Need reproductive guidance' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, pregnancyIntention: item.id }))}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer min-h-[48px] flex items-center ${
                    answers.pregnancyIntention === item.id
                      ? 'bg-[#1F3B8C] text-white border-[#1F3B8C] shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Current Method */}
          <div className="space-y-3">
            <label className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1F3B8C] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>What method are you currently using?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { id: 'none', label: 'No method / Unprotected' },
                { id: 'condoms', label: 'Condoms only' },
                { id: 'injectable', label: '3-Month Injectable (Depo / Sayana)' },
                { id: 'implant', label: 'Implant (Implanon / Jadelle)' },
                { id: 'iud', label: 'Copper IUD (Loop)' },
                { id: 'pills', label: 'Daily Oral Pills' },
                { id: 'calendar', label: 'Calendar / Withdrawal method' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, currentMethod: item.id }))}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer min-h-[48px] flex items-center ${
                    answers.currentMethod === item.id
                      ? 'bg-[#1F3B8C] text-white border-[#1F3B8C] shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences (Optional Multi-Select) */}
          <div className="space-y-3 pt-1">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-600 block">
              Optional Preferences (Select any that apply):
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'discreet', label: 'Discreet & Private' },
                { id: 'long_term', label: 'Long-Lasting (Years)' },
                { id: 'breastfeeding', label: 'Safe While Breastfeeding' },
                { id: 'hormone_free', label: 'Hormone-Free' },
                { id: 'dual_protection', label: 'Dual STI/HIV Protection' },
              ].map((pref) => {
                const isSelected = answers.preferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => handleTogglePreference(pref.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[40px] ${
                      isSelected
                        ? 'bg-[#F59E0B] text-[#1F3B8C] border-[#F59E0B] font-bold shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {pref.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              onClick={() => isFormComplete && setHasSubmitted(true)}
              disabled={!isFormComplete}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>View Personalized Options</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        results && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Top Warning Banner / Disclaimer to Confirm with Clinician */}
            <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
                <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>Mandatory Clinical Confirmation Note:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                This is personalized educational guidance, <strong>not a medical prescription</strong>. Always confirm your medical eligibility, blood pressure, and individual health history with a clinician, midwife, or your local Kebele Health Extension Worker (HEW).
              </p>
            </div>

            {/* Emergency Contraceptive Reminder if Unprotected */}
            {results.hasRecentUnprotected && (
              <div className="p-4 rounded-3xl bg-rose-50 border border-rose-300 text-rose-950 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 block">
                  Time-Sensitive Emergency Contraception:
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-800">
                  If you had unprotected sexual intercourse within the last <strong>72 hours (up to 120 hours)</strong>, an Emergency Contraceptive Pill (ECP, such as Postinor-2) or urgent Copper IUD insertion can prevent pregnancy. ECPs are available without a prescription at community pharmacies.
                </p>
              </div>
            )}

            {/* Youth Friendly Service Note */}
            {results.isTeen && (
              <div className="p-4 rounded-3xl bg-blue-50 border border-blue-200 text-[#1F3B8C] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider block">
                  Adolescent & Youth-Friendly Services in Ethiopia:
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Ethiopian public health centers offer confidential Youth-Friendly Services (YFS) where trained health officers and nurses provide judgment-free counsel and free contraception.
                </p>
              </div>
            )}

            {/* Recommended Methods List */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-extrabold text-[#1F3B8C] uppercase tracking-wider">
                Tailored Family Planning Options:
              </h3>

              {results.recommended.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#1F3B8C]">
                        {item.tag}
                      </span>
                      <h4 className="font-extrabold text-stone-900 text-base mt-1">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-800">
                    <strong>Availability in Ethiopia:</strong> {item.ethiopiaContext}
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() =>
                        onAskQuestion(
                          `Tell me more about ${item.name} for family planning in Ethiopia. What are the common side effects and who should not use it?`
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3B8C] hover:text-[#182E6E] py-1.5 px-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Ask MAM AI about this method</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Retake Questionnaire Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Assessment</span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
