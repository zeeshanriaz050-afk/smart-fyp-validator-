import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Users, Compass } from 'lucide-react';
import { ScopeFeasibility } from '../types';

interface TimelineRoadmapProps {
  feasibility: ScopeFeasibility;
  teamSize: number;
  durationMonths: number;
}

export const TimelineRoadmap: React.FC<TimelineRoadmapProps> = ({
  feasibility,
  teamSize,
  durationMonths,
}) => {
  const getRiskBadge = (risk: string) => {
    const r = risk.toLowerCase();
    if (r.includes('high')) return <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">High Risk Phase</span>;
    if (r.includes('medium')) return <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Moderate Risk</span>;
    return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Low Risk</span>;
  };

  const getFeasibilityBadge = (rating: string) => {
    const r = rating.toLowerCase();
    if (r.includes('balanced') || r.includes('high')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (r.includes('challenging')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Calendar className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Scope Feasibility &amp; Semester Sprint Roadmap
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Workload estimation calibrated for {teamSize} {teamSize === 1 ? 'student' : 'students'} over a {durationMonths}-month academic timeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>~{feasibility.recommendedTeamHoursPerWeek} hrs/week/student</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getFeasibilityBadge(feasibility.feasibilityRating)}`}>
            {feasibility.feasibilityRating} Feasibility
          </div>
        </div>
      </div>

      {/* 4-Phase Milestone Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {feasibility.timelineMilestones.map((milestone, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {milestone.monthRange}
                </span>
                {getRiskBadge(milestone.riskLevel)}
              </div>

              <h4 className="text-xs font-bold text-slate-900 leading-snug mb-3">
                {milestone.phase}
              </h4>

              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Deliverables:
                </div>
                {milestone.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Sprint #{idx + 1}</span>
              <span>Milestone Checkpoint</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scope Creep Warning / Guidance Box */}
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 flex items-start gap-3">
        <Compass className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-900 block mb-0.5">
            Supervisor Scope Negotiation Tip:
          </span>
          <p className="text-amber-800 leading-relaxed">
            {feasibility.scopeWarningOrRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
