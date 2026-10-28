import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileText, Download, GraduationCap } from 'lucide-react';
import { FYPValidationResult } from '../types';

interface ProposalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: FYPValidationResult;
  rawIdea: string;
  domain: string;
  targetDegree: string;
}

export const ProposalDossierModal: React.FC<ProposalDossierModalProps> = ({
  isOpen,
  onClose,
  result,
  rawIdea,
  domain,
  targetDegree,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# CAPSTONE FINAL YEAR PROJECT (FYP) PROPOSAL SYNOPSIS
**Program:** ${targetDegree}
**Domain:** ${domain}
**Original Submission Concept:** ${rawIdea}
**Uniqueness & Novelty Rating:** ${result.uniquenessScore}/100 (${result.verdict})

---

## 1. FORMAL RESEARCH TITLES
${result.suggestedProjectTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

---

## 2. ACADEMIC KEYWORDS (IEEE / ACM)
${result.academicKeywords.join(' · ')}

---

## 3. ARCHITECTURAL OVERVIEW
${result.systemBlueprint.architectureSummary}

### Recommended Production Tech Stack
- **Frontend / Client:** ${result.systemBlueprint.recommendedTechStack.frontend}
- **Backend / Microservices:** ${result.systemBlueprint.recommendedTechStack.backend}
- **AI / ML Pipeline:** ${result.systemBlueprint.recommendedTechStack.aiMl}
- **Persistence & Storage:** ${result.systemBlueprint.recommendedTechStack.database}
- **Infrastructure & Edge:** ${result.systemBlueprint.recommendedTechStack.devopsCloud}

---

## 4. SYSTEM EXECUTION WORKFLOW
${result.systemBlueprint.dataFlowSteps
  .map((s) => `Step ${s.stepNumber} [${s.component}]: ${s.title} - ${s.description}`)
  .join('\n')}

---

## 5. SCOPE & TIMELINE DELIVERABLES
- **Feasibility Assessment:** ${result.scopeFeasibility.feasibilityRating}
- **Estimated Commitment:** ~${result.scopeFeasibility.recommendedTeamHoursPerWeek} hrs/week per student
${result.scopeFeasibility.timelineMilestones
  .map(
    (m) =>
      `### ${m.phase} (${m.monthRange})\nDeliverables: ${m.deliverables.join(', ')} (Risk: ${m.riskLevel})`
  )
  .join('\n\n')}

---

## 6. DEFENSE HIGHLIGHTS & MITIGATIONS
${result.defenseSimulator
  .map(
    (q, i) =>
      `Q${i + 1} [${q.questionType}]: "${q.question}"\nDefense: "${q.recommendedDefenseAnswer}"`
  )
  .join('\n\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              FYP Academic Proposal Dossier
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dossier Document Content (Formatted for Academic Presentation) */}
        <div className="p-8 space-y-8 font-sans text-slate-900 print-area">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">
              Final Year Project (Capstone) Proposal Synopsis
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {result.suggestedProjectTitles[0] || rawIdea}
            </h1>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
              <div>
                <strong>Degree: </strong>
                <span>{targetDegree}</span>
              </div>
              <div>·</div>
              <div>
                <strong>Domain: </strong>
                <span>{domain}</span>
              </div>
              <div>·</div>
              <div>
                <strong>Uniqueness Score: </strong>
                <span className="font-bold text-indigo-700">{result.uniquenessScore}%</span>
              </div>
            </div>
          </div>

          {/* Academic Titles List */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Alternative Formal Project Titles
            </h2>
            <ul className="list-decimal list-inside space-y-1.5 text-sm text-slate-800 font-medium">
              {result.suggestedProjectTitles.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          </div>

          {/* Keywords */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Indexed Keywords (IEEE / ACM)
            </h2>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {result.academicKeywords.map((kw, i) => (
                <span key={i} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Architectural Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Architecture &amp; Methodology
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {result.systemBlueprint.architectureSummary}
            </p>
          </div>

          {/* Tech Stack Specs */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Technical Specification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold block text-slate-900 mb-1">Frontend / Client:</span>
                <span className="font-mono text-slate-700">{result.systemBlueprint.recommendedTechStack.frontend}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold block text-slate-900 mb-1">Backend &amp; Middleware:</span>
                <span className="font-mono text-slate-700">{result.systemBlueprint.recommendedTechStack.backend}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold block text-slate-900 mb-1">AI / Core Algorithm:</span>
                <span className="font-mono text-slate-700">{result.systemBlueprint.recommendedTechStack.aiMl}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold block text-slate-900 mb-1">Database &amp; Storage:</span>
                <span className="font-mono text-slate-700">{result.systemBlueprint.recommendedTechStack.database}</span>
              </div>
            </div>
          </div>

          {/* Timeline Deliverables */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Semester Sprint Milestones
            </h2>
            <div className="space-y-3">
              {result.scopeFeasibility.timelineMilestones.map((m, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-slate-900">{m.phase}</strong>
                    <span className="font-mono text-indigo-700 font-semibold">{m.monthRange}</span>
                  </div>
                  <div className="text-slate-600">
                    Deliverables: {m.deliverables.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
