import React from 'react';
import { BookOpen, ShieldCheck, Activity, Hospital, ChevronRight } from 'lucide-react';
import { JourneyStage, LanguageCode } from '../types/srmh';
import { translations } from '../data/translations';

interface JourneyBarProps {
  currentStage: JourneyStage;
  onSelectStage: (stage: JourneyStage) => void;
  language: LanguageCode;
}

const STAGE_CONFIG = [
  { key: 'learn' as JourneyStage, icon: BookOpen, number: '01' },
  { key: 'prevent' as JourneyStage, icon: ShieldCheck, number: '02' },
  { key: 'monitor' as JourneyStage, icon: Activity, number: '03' },
  { key: 'seek_care' as JourneyStage, icon: Hospital, number: '04' },
];

export const JourneyBar: React.FC<JourneyBarProps> = ({
  currentStage,
  onSelectStage,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-stone-200">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">
            4-Step Continuum
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-[#1F3B8C]">
            {t.journeyTitle}
          </h2>
        </div>
        <div className="text-xs font-bold text-[#1F3B8C] bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200/60">
          Step: <span className="text-[#F59E0B] uppercase">{currentStage.replace('_', ' ')}</span>
        </div>
      </div>

      {/* 4-Step Journey Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {STAGE_CONFIG.map(({ key, icon: Icon, number }) => {
          const isCurrent = currentStage === key;
          const stageInfo = t.stages[key];

          return (
            <button
              key={key}
              onClick={() => onSelectStage(key)}
              className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between min-h-[110px] ${
                isCurrent
                  ? 'bg-[#1F3B8C] text-white border-[#1F3B8C] shadow-md ring-2 ring-[#F59E0B]/50 -translate-y-0.5'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      isCurrent
                        ? 'bg-[#F59E0B] text-[#1F3B8C]'
                        : 'bg-white text-[#1F3B8C] border border-stone-200 shadow-2xs'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? 'bg-blue-800/80 text-blue-100'
                        : 'bg-stone-200/70 text-stone-600'
                    }`}
                  >
                    {number}
                  </span>
                </div>

                <div
                  className={`font-black text-sm tracking-tight ${
                    isCurrent ? 'text-white' : 'text-[#1F3B8C]'
                  }`}
                >
                  {stageInfo.title}
                </div>
                <div
                  className={`text-xs font-semibold mt-0.5 ${
                    isCurrent ? 'text-amber-200' : 'text-stone-600'
                  }`}
                >
                  {stageInfo.subtitle}
                </div>
              </div>

              <div
                className={`text-[10px] mt-2 line-clamp-2 leading-relaxed ${
                  isCurrent ? 'text-blue-100' : 'text-stone-500'
                }`}
              >
                {stageInfo.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dedicated HIV, STI, Pregnancy & Emergency Module Quick Bar */}
      <div className="mt-3 pt-3 border-t border-stone-100">
        <button
          onClick={() => onSelectStage('emergency')}
          className={`w-full p-3 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left border ${
            currentStage === 'emergency'
              ? 'bg-red-700 text-white border-red-700 shadow-md ring-2 ring-amber-400'
              : 'bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 text-stone-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                currentStage === 'emergency'
                  ? 'bg-amber-400 text-red-900'
                  : 'bg-red-600 text-white shadow-xs'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm tracking-tight">
                  {t.stages.emergency?.title || 'HIV, STI, Pregnancy & Emergency Health Module'}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    currentStage === 'emergency' ? 'bg-white text-red-900' : 'bg-red-600 text-white'
                  }`}
                >
                  Offline & Online
                </span>
              </div>
              <p
                className={`text-[11px] line-clamp-1 mt-0.5 ${
                  currentStage === 'emergency' ? 'text-red-100' : 'text-stone-600'
                }`}
              >
                {t.stages.emergency?.desc || '72h PEP, emergency contraception, guided danger questionnaires & clinician summaries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1 ${
                currentStage === 'emergency'
                  ? 'bg-white text-red-900'
                  : 'bg-red-600 text-white shadow-xs'
              }`}
            >
              Open Module
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
