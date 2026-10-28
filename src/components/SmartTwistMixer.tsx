import React from 'react';
import { Cpu, Zap, Network, Globe, Plus, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { SmartTwist } from '../types';

interface SmartTwistMixerProps {
  twists: SmartTwist[];
  activeTwistIds: string[];
  onToggleTwist: (twistId: string) => void;
  onApplyAllTwists: () => void;
  baseScore: number;
}

export const SmartTwistMixer: React.FC<SmartTwistMixerProps> = ({
  twists,
  activeTwistIds,
  onToggleTwist,
  onApplyAllTwists,
  baseScore,
}) => {
  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('iot') || category.toLowerCase().includes('edge') || category.toLowerCase().includes('hardware')) {
      return <Cpu className="h-4 w-4 text-emerald-600" />;
    }
    if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('ml') || category.toLowerCase().includes('neural')) {
      return <Zap className="h-4 w-4 text-amber-600" />;
    }
    if (category.toLowerCase().includes('enterprise') || category.toLowerCase().includes('cloud') || category.toLowerCase().includes('mesh')) {
      return <Network className="h-4 w-4 text-indigo-600" />;
    }
    return <Globe className="h-4 w-4 text-cyan-600" />;
  };

  const totalBoost = twists
    .filter((t) => activeTwistIds.includes(t.id))
    .reduce((sum, t) => sum + t.projectedScoreBoost, 0);

  const estimatedUpgradedScore = Math.min(98, baseScore + totalBoost);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Smart Twist &amp; Upgrade Engine (The 90%+ Score Elevators)
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Select modern architectural twists to rescue an overdone topic and elevate your project from a basic tutorial to an A+ university FYP.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium">Projected Uniqueness</span>
            <span className="text-lg font-black text-indigo-600 font-mono">
              {estimatedUpgradedScore}%
            </span>
          </div>

          <button
            onClick={onApplyAllTwists}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Apply All Twists
          </button>
        </div>
      </div>

      {/* Twist Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {twists.map((twist) => {
          const isActive = activeTwistIds.includes(twist.id);

          return (
            <div
              key={twist.id}
              onClick={() => onToggleTwist(twist.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-500/80 bg-indigo-50/30 shadow-xs ring-1 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div>
                {/* Card Top: Category & Score Boost */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    {getCategoryIcon(twist.category)}
                    <span>{twist.category}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      +{twist.projectedScoreBoost}% Boost
                    </span>

                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                        isActive
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {twist.title}
                </h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {twist.description}
                </p>

                {/* Hardware / API requirements */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Key Dependencies / Stack:
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-600">
                    {twist.hardwareOrApiRequirements.map((req, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom: Why Professors Love It */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-1.5">
                <span className="font-semibold text-indigo-600 shrink-0">Why Professors Approve:</span>
                <span className="italic leading-snug">{twist.whyProfessorsLoveIt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Twist Status Strip */}
      <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200/80 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">
            {activeTwistIds.length} of {twists.length} Twists Enabled
          </span>
          <span>·</span>
          <span>
            Combined Novelty Elevation: <strong className="text-emerald-700">+{totalBoost}%</strong>
          </span>
        </div>
        <span className="text-slate-500 text-[11px]">
          Toggle any twist above to update the architecture and defense blueprint in real-time.
        </span>
      </div>
    </div>
  );
};
