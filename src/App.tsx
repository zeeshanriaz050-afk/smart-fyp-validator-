import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UniquenessGauge } from './components/UniquenessGauge';
import { SmartTwistMixer } from './components/SmartTwistMixer';
import { SystemBlueprintView } from './components/SystemBlueprintView';
import { TimelineRoadmap } from './components/TimelineRoadmap';
import { DefenseSimulator } from './components/DefenseSimulator';
import { ProposalDossierModal } from './components/ProposalDossierModal';
import { HallOfClichesModal } from './components/HallOfClichesModal';
import { FYPValidationResult } from './types';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileCheck2,
  Share2,
  GraduationCap,
  Layers,
  Calendar,
  MessageSquareQuote,
  Lightbulb,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

const PRESETS = [
  {
    title: 'Plant Disease Detector',
    idea: 'AI-based plant disease detector using camera and leaf image classification',
    domain: 'Artificial Intelligence & Computer Vision',
    degree: 'BS Computer Science',
    clicheTag: 'Classic Cliché (42% Unique)',
  },
  {
    title: 'Face Recognition Attendance',
    idea: 'Student automated attendance system using classroom CCTV and face recognition',
    domain: 'Computer Vision & Security',
    degree: 'BS Software Engineering',
    clicheTag: 'Overdone Cliché (35% Unique)',
  },
  {
    title: 'University Library System',
    idea: 'Online digital library and book issuing management web application with QR codes',
    domain: 'Cloud & Web Information Systems',
    degree: 'BS Information Technology',
    clicheTag: 'Fatal Cliché (22% Unique)',
  },
  {
    title: 'Indoor Drone Search & Rescue',
    idea: 'Autonomous micro-drone with visual SLAM for indoor search and rescue in GPS-denied environments',
    domain: 'Robotics & Edge Computing',
    degree: 'BE Computer Systems Engineering',
    clicheTag: 'High Potential (74% Unique)',
  },
  {
    title: 'P2P Micro-Grid Energy Trading',
    idea: 'Decentralized peer-to-peer solar energy trading platform using smart contracts and IoT smart meters',
    domain: 'FinTech & Smart Energy IoT',
    degree: 'BS Computer Science',
    clicheTag: 'Novel Concept (82% Unique)',
  },
];

const DOMAINS = [
  'Artificial Intelligence & Machine Learning',
  'Computer Vision & Image Processing',
  'Natural Language Processing & Speech',
  'Internet of Things (IoT) & Robotics',
  'Cloud Systems & Distributed Computing',
  'Cybersecurity, Cryptography & Forensics',
  'Bio-Informatics & Healthcare Tech',
  'FinTech & Blockchain Protocols',
  'Augmented & Virtual Reality (AR/VR)',
];

const DEGREES = [
  'BS Computer Science',
  'BS Software Engineering',
  'BS Data Science / AI',
  'BE Computer Systems / Electrical',
  'BS Information Technology',
];

export default function App() {
  const [rawIdea, setRawIdea] = useState('AI-based plant disease detector using camera');
  const [domain, setDomain] = useState('Artificial Intelligence & Machine Learning');
  const [targetDegree, setTargetDegree] = useState('BS Computer Science');
  const [teamSize, setTeamSize] = useState<number>(3);
  const [durationMonths, setDurationMonths] = useState<number>(8);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<FYPValidationResult | null>(null);

  const [activeTwistIds, setActiveTwistIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'twists' | 'blueprint' | 'timeline' | 'defense'>('twists');

  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isClichesOpen, setIsClichesOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Progressive loading text sequence
  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      const steps = [
        'Analyzing topic against 10,000+ university FYP archives...',
        'Screening for cliché patterns and professor rejection red flags...',
        'Synthesizing 4 high-impact architectural twists & hardware upgrades...',
        'Generating 5-tier system blueprint and production tech stack...',
        'Compiling examiner defense cross-examination scripts...',
      ];

      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleValidate = async (customIdea?: string, customTwists: string[] = []) => {
    const queryIdea = customIdea !== undefined ? customIdea : rawIdea;
    if (!queryIdea || queryIdea.trim().length < 3) {
      setErrorMsg('Please describe your project idea in at least a few words.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch('/api/validate-fyp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawIdea: queryIdea,
          domain,
          targetDegree,
          teamSize,
          durationMonths,
          appliedTwists: customTwists,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data: FYPValidationResult = await response.json();
      setResult(data);
      // Pre-select the first 2 twists if not already selected
      if (customTwists.length === 0 && data.smartTwists && data.smartTwists.length >= 2) {
        setActiveTwistIds([data.smartTwists[0].id, data.smartTwists[1].id]);
      } else {
        setActiveTwistIds(customTwists);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Unable to validate at the moment. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial demo validation on mount
  useEffect(() => {
    handleValidate('AI-based plant disease detector using camera', ['twist_edge_iot', 'twist_federated_privacy']);
  }, []);

  const handleSelectPreset = (preset: (typeof PRESETS)[0]) => {
    setRawIdea(preset.idea);
    setDomain(preset.domain);
    setTargetDegree(preset.degree);
    handleValidate(preset.idea, []);
  };

  const handleToggleTwist = (twistId: string) => {
    const updated = activeTwistIds.includes(twistId)
      ? activeTwistIds.filter((id) => id !== twistId)
      : [...activeTwistIds, twistId];
    setActiveTwistIds(updated);
  };

  const handleApplyAllTwists = () => {
    if (!result) return;
    const allIds = result.smartTwists.map((t) => t.id);
    setActiveTwistIds(allIds);
  };

  // Calculate dynamic uniqueness score based on active twists
  const currentUniquenessScore = React.useMemo(() => {
    if (!result) return 0;
    const baseScore = result.uniquenessScore;
    const activeBoost = result.smartTwists
      .filter((t) => activeTwistIds.includes(t.id))
      .reduce((acc, t) => acc + t.projectedScoreBoost, 0);

    return Math.min(98, Math.max(baseScore, 30 + activeBoost));
  }, [result, activeTwistIds]);

  const currentVerdict = React.useMemo(() => {
    if (currentUniquenessScore >= 88) return 'Breakthrough FYP Material';
    if (currentUniquenessScore >= 75) return 'Highly Unique & Innovative';
    if (currentUniquenessScore >= 60) return 'Moderate / Good Potential';
    return 'Common / Needs Significant Upgrade';
  }, [currentUniquenessScore]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar
        onOpenCliches={() => setIsClichesOpen(true)}
        onResetToDemo={() => {
          setRawIdea('AI-based plant disease detector using camera');
          handleValidate('AI-based plant disease detector using camera');
        }}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sparkles className="h-3.5 w-3.5" />
            Stop Building Boring Clichés That Professors Reject
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Smart FYP Scope &amp; Uniqueness Validator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Validate your Final Year Project or Capstone proposal in seconds. Scan for professor rejection red flags, unlock modern 90%+ architectural twists, and generate an end-to-end system blueprint with defense Q&amp;A.
          </p>
        </div>

        {/* Input Deck */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          {/* Preset Buttons */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Try Common University Proposal Presets:
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.title}
                  onClick={() => handleSelectPreset(p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-xs font-medium text-slate-700 transition-all text-left"
                >
                  <span className="font-semibold">{p.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">· {p.clicheTag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Raw Idea Input */}
          <div>
            <label htmlFor="rawIdea" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Type Your Raw Project Idea:
            </label>
            <div className="relative">
              <textarea
                id="rawIdea"
                rows={3}
                value={rawIdea}
                onChange={(e) => setRawIdea(e.target.value)}
                placeholder="e.g., AI-based plant disease detector using smartphone camera, or Autonomous warehouse rover..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Configuration Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Domain / Field
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Degree Program
              </label>
              <select
                value={targetDegree}
                onChange={(e) => setTargetDegree(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              >
                {DEGREES.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Team Size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              >
                <option value={1}>1 Student (Solo Capstone)</option>
                <option value={2}>2 Students (Pair)</option>
                <option value={3}>3 Students (Standard Team)</option>
                <option value={4}>4 Students (Large Group)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Timeline
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-hidden"
              >
                <option value={4}>4 Months (1 Semester)</option>
                <option value={8}>8 Months (2 Semesters / Standard FYP)</option>
                <option value={12}>12 Months (Full Academic Year)</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="h-4 w-4 text-slate-400 shrink-0" />
              <span>
                Free real-time analysis against IEEE/ACM standards &amp; university rejection patterns.
              </span>
            </div>

            <button
              onClick={() => handleValidate()}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Validating Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Validate My Idea &amp; Build Blueprint</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading State Animation */}
        {loading && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-indigo-950">
                Running Academic Capstone Validation Engine
              </h3>
              <p className="text-xs text-indigo-700 font-mono mt-1 transition-all">
                {
                  [
                    'Analyzing topic against 10,000+ university FYP archives...',
                    'Screening for cliché patterns and professor rejection red flags...',
                    'Synthesizing 4 high-impact architectural twists & hardware upgrades...',
                    'Generating 5-tier system blueprint and production tech stack...',
                    'Compiling examiner defense cross-examination scripts...',
                  ][loadingStep]
                }
              </p>
            </div>
          </div>
        )}

        {/* Results Deck */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Top Results Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 px-5 py-3.5 rounded-xl shadow-2xs">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Validated Topic:</span>
                <span className="font-mono text-slate-900 font-bold truncate max-w-md">
                  "{rawIdea}"
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDossierOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  <span>View Proposal Dossier / Print PDF</span>
                </button>
              </div>
            </div>

            {/* Uniqueness Score Gauge */}
            <UniquenessGauge
              score={currentUniquenessScore}
              verdict={currentVerdict}
              scoreBreakdown={result.scoreBreakdown}
              clicheComparison={result.clicheComparison}
              professorRedFlags={result.professorRedFlags}
            />

            {/* Tabbed Interactive Sections */}
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
                {[
                  { id: 'twists', label: '1. Smart Twist Mixer (90%+ Upgrades)', icon: Sparkles },
                  { id: 'blueprint', label: '2. System Blueprint & Architecture', icon: Layers },
                  { id: 'timeline', label: '3. Scope Feasibility & Roadmap', icon: Calendar },
                  { id: 'defense', label: '4. Professor Defense Simulator', icon: MessageSquareQuote },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Smart Twist Mixer */}
              {activeTab === 'twists' && (
                <SmartTwistMixer
                  twists={result.smartTwists}
                  activeTwistIds={activeTwistIds}
                  onToggleTwist={handleToggleTwist}
                  onApplyAllTwists={handleApplyAllTwists}
                  baseScore={result.uniquenessScore}
                />
              )}

              {/* Tab 2: System Blueprint */}
              {activeTab === 'blueprint' && (
                <SystemBlueprintView blueprint={result.systemBlueprint} />
              )}

              {/* Tab 3: Scope Feasibility & Timeline */}
              {activeTab === 'timeline' && (
                <TimelineRoadmap
                  feasibility={result.scopeFeasibility}
                  teamSize={teamSize}
                  durationMonths={durationMonths}
                />
              )}

              {/* Tab 4: Professor Defense Simulator */}
              {activeTab === 'defense' && (
                <DefenseSimulator questions={result.defenseSimulator} />
              )}
            </div>

            {/* Suggested Formal Titles Strip */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Publication-Ready Proposal Titles (Use in Your Formal Synopsis):
                </h4>
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                {result.suggestedProjectTitles.map((title, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-mono font-bold text-indigo-600 shrink-0">Option {idx + 1}:</span>
                    <span className="font-medium text-slate-900">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Why University FYPs Fail / Guide Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            University Committee Cheat Sheet: The 3 Rules to Pass FYP Defense
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 block mb-1 font-bold text-sm">
                1. Avoid Pure CRUD Apps
              </strong>
              <p className="text-slate-600 leading-relaxed">
                If the core feature of your project is creating, reading, updating, and deleting database records (e.g. inventory, hospital booking, student portals), professors will reject it instantly. Always introduce edge sensors, optimization algorithms, or predictive models.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 block mb-1 font-bold text-sm">
                2. Don't Just Call Third-Party APIs
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Building a website that merely wraps an OpenAI or AWS API call is not an engineering thesis. Committees evaluate your mathematical model, data preprocessing pipeline, offline resilience, and edge hardware deployment.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 block mb-1 font-bold text-sm">
                3. Test on Real Messy Data
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Never report "99% accuracy" on a clean Kaggle dataset. Professors know Kaggle benchmarks are artificial. Introduce real-world occlusions, edge noise, low-bandwidth constraints, and measure macro F1-score and inference latency.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">Smart FYP Scope &amp; Uniqueness Validator</span>
            <span>· Built for Computer Science &amp; Engineering students</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <button
              onClick={() => setIsClichesOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Hall of Clichés
            </button>
            <span>·</span>
            <span>IEEE / ACM Aligned</span>
          </div>
        </div>
      </footer>

      {/* Proposal Dossier Modal */}
      {result && (
        <ProposalDossierModal
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          result={result}
          rawIdea={rawIdea}
          domain={domain}
          targetDegree={targetDegree}
        />
      )}

      {/* Hall of Clichés Modal */}
      <HallOfClichesModal
        isOpen={isClichesOpen}
        onClose={() => setIsClichesOpen(false)}
        onSelectTopic={(topic) => {
          setRawIdea(topic);
          handleValidate(topic);
        }}
      />
    </div>
  );
}
