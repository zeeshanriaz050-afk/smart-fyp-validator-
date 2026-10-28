import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, Sparkles, MessageSquareQuote } from 'lucide-react';
import { DefenseQuestion } from '../types';

interface DefenseSimulatorProps {
  questions: DefenseQuestion[];
}

export const DefenseSimulator: React.FC<DefenseSimulatorProps> = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const getQuestionTypeBadge = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('novelty')) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (t.includes('arch')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (t.includes('data') || t.includes('acc')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (t.includes('fail') || t.includes('risk')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <MessageSquareQuote className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Professor Proposal Defense Prep Simulator
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Tough defense cross-examination questions university examiners ask during the proposal &amp; mid-eval stages, with bulletproof answer scripts.
          </p>
        </div>

        <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg self-start sm:self-center">
          {questions.length} Defense Scenarios Loaded
        </span>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-purple-300 bg-purple-50/20 ring-1 ring-purple-200/50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleQuestion(idx)}
                className="w-full text-left p-4 flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono shrink-0 mt-0.5">
                    Q{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${getQuestionTypeBadge(q.questionType)}`}>
                        {q.questionType} Trap
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 leading-snug">
                      "{q.question}"
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0 mt-1">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-purple-100/80 space-y-3 text-xs">
                  {/* Why Professor Asks */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-slate-600">
                    <strong className="text-slate-800 block mb-0.5">
                      The Professor's Angle &amp; Intention:
                    </strong>
                    {q.whyProfessorAsks}
                  </div>

                  {/* Recommended Answer */}
                  <div className="bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-200 text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                      <ShieldCheck className="h-4 w-4" />
                      Recommended High-Scoring Defense Script:
                    </div>
                    <p className="leading-relaxed italic text-emerald-900">
                      "{q.recommendedDefenseAnswer}"
                    </p>
                  </div>

                  {/* Pro Tip */}
                  <div className="flex items-start gap-2 text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                    <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Defense Strategy Pro-Tip: </strong>
                      {q.proTip}
                    </span>
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
