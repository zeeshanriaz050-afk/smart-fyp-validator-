import React, { useState } from 'react';
import { Layers, ArrowRight, Server, Database, Cpu, Layout, Cloud, Copy, Check, Info } from 'lucide-react';
import { SystemBlueprint } from '../types';

interface SystemBlueprintViewProps {
  blueprint: SystemBlueprint;
}

export const SystemBlueprintView: React.FC<SystemBlueprintViewProps> = ({ blueprint }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyStack = () => {
    const stackText = `FYP SYSTEM ARCHITECTURE & TECH STACK:
- Frontend: ${blueprint.recommendedTechStack.frontend}
- Backend: ${blueprint.recommendedTechStack.backend}
- AI/ML Frameworks: ${blueprint.recommendedTechStack.aiMl}
- Database & Cache: ${blueprint.recommendedTechStack.database}
- DevOps & Cloud: ${blueprint.recommendedTechStack.devopsCloud}

Architectural Justification:
${blueprint.recommendedTechStack.justification}`;

    navigator.clipboard.writeText(stackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLayerIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('client') || n.includes('presentation') || n.includes('frontend')) return <Layout className="h-4 w-4 text-sky-600" />;
    if (n.includes('gateway') || n.includes('api') || n.includes('service')) return <Server className="h-4 w-4 text-indigo-600" />;
    if (n.includes('ai') || n.includes('core') || n.includes('ml')) return <Cpu className="h-4 w-4 text-amber-600" />;
    if (n.includes('data') || n.includes('database') || n.includes('cache')) return <Database className="h-4 w-4 text-emerald-600" />;
    return <Cloud className="h-4 w-4 text-purple-600" />;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              System Architecture &amp; Data Pipeline Blueprint
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            {blueprint.architectureSummary}
          </p>
        </div>

        <button
          onClick={handleCopyStack}
          className="self-start sm:self-center px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied Stack' : 'Copy Tech Stack'}</span>
        </button>
      </div>

      {/* 5-Tier Architecture Stack */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Layered System Decomposition
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {blueprint.layers.map((layer, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    {getLayerIcon(layer.name)}
                    <span className="truncate">{layer.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">L{idx + 1}</span>
                </div>

                <p className="text-xs text-slate-600 leading-snug line-clamp-3 mb-3">
                  {layer.role}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Stack:
                </div>
                <div className="flex flex-wrap gap-1">
                  {layer.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Flow Diagram / Dataflow Pipeline */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          End-to-End Execution &amp; Dataflow Pipeline
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {blueprint.dataFlowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[11px] font-bold font-mono">
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {step.component}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-snug mt-1">
                    {step.description}
                  </p>
                </div>

                {idx < blueprint.dataFlowSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 border border-slate-200 text-slate-400">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curated Tech Stack Matrix & Justification */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
            Recommended Production Stack &amp; Supervisor Defense Justification
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mb-3">
          <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
            <span className="font-semibold text-slate-500 block mb-0.5">Frontend / UI:</span>
            <span className="font-mono text-slate-800 font-medium">{blueprint.recommendedTechStack.frontend}</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
            <span className="font-semibold text-slate-500 block mb-0.5">Backend &amp; API:</span>
            <span className="font-mono text-slate-800 font-medium">{blueprint.recommendedTechStack.backend}</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
            <span className="font-semibold text-slate-500 block mb-0.5">AI / ML Pipeline:</span>
            <span className="font-mono text-slate-800 font-medium">{blueprint.recommendedTechStack.aiMl}</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80">
            <span className="font-semibold text-slate-500 block mb-0.5">Database &amp; Caching:</span>
            <span className="font-mono text-slate-800 font-medium">{blueprint.recommendedTechStack.database}</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-indigo-100/80 md:col-span-2">
            <span className="font-semibold text-slate-500 block mb-0.5">DevOps, Edge &amp; Cloud:</span>
            <span className="font-mono text-slate-800 font-medium">{blueprint.recommendedTechStack.devopsCloud}</span>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-white/70 p-3 rounded-lg border border-indigo-100">
          <strong className="text-indigo-900">Why this stack wins the committee: </strong>
          {blueprint.recommendedTechStack.justification}
        </div>
      </div>
    </div>
  );
};
