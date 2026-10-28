import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Flame, Award, HelpCircle } from 'lucide-react';
import { ScoreBreakdown, ClicheComparison } from '../types';

interface UniquenessGaugeProps {
  score: number;
  verdict: string;
  scoreBreakdown: ScoreBreakdown;
  clicheComparison: ClicheComparison;
  professorRedFlags: string[];
}

export const UniquenessGauge: React.FC<UniquenessGaugeProps> = ({
  score,
  verdict,
  scoreBreakdown,
  clicheComparison,
  professorRedFlags,
}) => {
  // SVG circular gauge math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val < 50) return { stroke: '#ef4444', text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' };
    if (val < 70) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (val < 85) return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    return { stroke: '#6366f1', text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' };
  };

  const theme = getScoreColor(score);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Radial Meter */}
        <div className="lg:col-span-5 flex flex-col items-center text-center">
          <div className="relative flex items-center justify-center">
            <svg className="h-44 w-44 -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Value Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={theme.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' }}
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold tracking-tight ${theme.text}`}>
                {score}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                Uniqueness Index
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}>
              {score < 50 ? (
                <ShieldAlert className="h-3.5 w-3.5" />
              ) : score < 75 ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Award className="h-3.5 w-3.5" />
              )}
              {verdict}
            </div>

            <p className="mt-2 text-xs text-slate-500 max-w-xs">
              {score < 50
                ? 'High risk of committee rejection. Professors consider this a textbook tutorial.'
                : score < 75
                ? 'Acceptable foundation, but lacks the cutting-edge novelty needed for an A-grade defense.'
                : 'Excellent distinction! Strong potential for research publication and top-tier evaluation.'}
            </p>
          </div>
        </div>

        {/* Right Column: Professor Jury Reaction & 5D Score Breakdown */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Professor Quote Card */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>
              FYP Evaluation Committee Reality Check:
            </div>
            <blockquote className="text-sm italic text-slate-700 font-medium leading-relaxed">
              "{clicheComparison.professorReaction}"
            </blockquote>
            {clicheComparison.isCliche && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold text-rose-600">Identified Cliché:</span>
                <span>{clicheComparison.closestCliches[0] || 'Overdone University Topic'}</span>
              </div>
            )}
          </div>

          {/* 5-Dimensional Metric Bars */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Academic & Industry Competency Breakdown
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Technical & Algorithmic Depth', value: scoreBreakdown.technicalDepth },
                { label: 'Market & Academic Novelty', value: scoreBreakdown.marketNovelty },
                { label: 'Research Rigor / IEEE Alignment', value: scoreBreakdown.academicRigor },
                { label: 'Industry & Practical Relevance', value: scoreBreakdown.industryRelevance },
                { label: 'Execution Feasibility (2 Semesters)', value: scoreBreakdown.executionFeasibility },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{metric.label}</span>
                    <span className="font-mono text-slate-500">{metric.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        metric.value >= 80 ? 'bg-indigo-600' : metric.value >= 60 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags / Rejection Triggers */}
      {professorRedFlags && professorRedFlags.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-2.5">
            <ShieldAlert className="h-4 w-4" />
            Professor Proposal Red Flags (Defense Vulnerabilities to Address):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
            {professorRedFlags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                <span className="font-mono font-bold text-rose-600 shrink-0">#{idx + 1}</span>
                <span className="leading-snug">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
