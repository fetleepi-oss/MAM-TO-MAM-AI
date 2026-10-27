import React, { useState } from 'react';
import {
  Sparkles,
  Droplet,
  Shield,
  ShieldAlert,
  Heart,
  Baby,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { LanguageCode, LearnTopic } from '../../types/srmh';
import { LEARN_TOPICS } from '../../data/srmhData';

interface LearnModuleProps {
  language: LanguageCode;
  onAskQuestion: (prompt: string) => void;
  onOpenEmergencyModule?: (tab?: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Droplet,
  Shield,
  ShieldAlert,
  Heart,
  Baby,
  HeartHandshake,
};

export const LearnModule: React.FC<LearnModuleProps> = ({
  language,
  onAskQuestion,
  onOpenEmergencyModule,
}) => {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(LEARN_TOPICS[0].id);

  const toggleTopic = (id: string) => {
    setExpandedTopicId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">
            Module 1
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs font-bold text-[#1F3B8C]">Evidence-Informed SRH</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1F3B8C] tracking-tight">
          Learn: Sexual, Reproductive & Maternal Health
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Explore clear, stigma-free topics designed for Ethiopian adolescents, young adults, and women. Tap any topic to read the explainer and ask follow-up questions.
        </p>

        {/* Dedicated Cross-Module Deep-Dive Card */}
        {onOpenEmergencyModule && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-red-700 tracking-wider">
                  Specialized Health Deep-Dive
                </span>
                <h4 className="font-extrabold text-sm text-[#1F3B8C]">
                  HIV, STI, Pregnancy & Emergency Module
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Time-critical PEP within 72h, partner treatment, 8 ANC contacts, and 100% offline triage.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenEmergencyModule('guides')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs self-start sm:self-center transition-all cursor-pointer whitespace-nowrap"
            >
              Open Dedicated Module →
            </button>
          </div>
        )}
      </div>

      {/* Topics Grid / Cards */}
      <div className="space-y-3.5">
        {LEARN_TOPICS.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;
          const Icon = ICON_MAP[topic.iconName] || Sparkles;

          const localizedTitle =
            language === 'am' ? topic.titleAm :
            language === 'om' ? topic.titleOm :
            language === 'ti' ? topic.titleTi :
            topic.title;

          return (
            <div
              key={topic.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-white border-[#1F3B8C] shadow-md ring-1 ring-blue-100'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs'
              }`}
            >
              {/* Card Header (Tap Target >= 48px) */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer min-h-[64px]"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-[#1F3B8C] text-[#F59E0B]'
                        : 'bg-blue-50 text-[#1F3B8C]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F59E0B] block">
                      {topic.category.toUpperCase()}
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                      {localizedTitle}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {topic.shortSummary}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl text-stone-400 hover:text-stone-700 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-[#1F3B8C]" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Explainer Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {topic.detailedExplainer.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Key Clinical Facts */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-2">
                    <span className="text-xs font-extrabold text-[#1F3B8C] uppercase tracking-wider block">
                      Key Health Facts (Ethiopian Guidelines):
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-800">
                      {topic.keyFacts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* "Ask a question" Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[11px] text-stone-400 text-center sm:text-left">
                      Have a personal concern about this topic? Ask MAM-to-MAM AI in private.
                    </span>
                    <button
                      onClick={() => onAskQuestion(topic.suggestedPrompt)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#1F3B8C] hover:bg-[#182E6E] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
                      <span>Ask a question about this</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
