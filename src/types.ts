export interface ScoreBreakdown {
  technicalDepth: number;
  marketNovelty: number;
  academicRigor: number;
  industryRelevance: number;
  executionFeasibility: number;
}

export interface SmartTwist {
  id: string;
  category: string;
  title: string;
  description: string;
  projectedScoreBoost: number;
  hardwareOrApiRequirements: string[];
  whyProfessorsLoveIt: string;
}

export interface ArchitectureLayer {
  name: string;
  technologies: string[];
  role: string;
}

export interface DataFlowStep {
  stepNumber: number;
  title: string;
  description: string;
  component: string;
}

export interface RecommendedTechStack {
  frontend: string;
  backend: string;
  aiMl: string;
  database: string;
  devopsCloud: string;
  justification: string;
}

export interface SystemBlueprint {
  architectureSummary: string;
  layers: ArchitectureLayer[];
  dataFlowSteps: DataFlowStep[];
  recommendedTechStack: RecommendedTechStack;
}

export interface TimelineMilestone {
  phase: string;
  monthRange: string;
  deliverables: string[];
  riskLevel: 'Low' | 'Medium' | 'High' | string;
}

export interface ScopeFeasibility {
  feasibilityRating: string;
  recommendedTeamHoursPerWeek: number;
  timelineMilestones: TimelineMilestone[];
  scopeWarningOrRecommendation: string;
}

export interface DefenseQuestion {
  question: string;
  questionType: string;
  whyProfessorAsks: string;
  recommendedDefenseAnswer: string;
  proTip: string;
}

export interface ClicheComparison {
  isCliche: boolean;
  closestCliches: string[];
  clicheRiskReason: string;
  professorReaction: string;
}

export interface FYPValidationResult {
  uniquenessScore: number;
  verdict: string;
  clicheComparison: ClicheComparison;
  scoreBreakdown: ScoreBreakdown;
  professorRedFlags: string[];
  smartTwists: SmartTwist[];
  systemBlueprint: SystemBlueprint;
  scopeFeasibility: ScopeFeasibility;
  defenseSimulator: DefenseQuestion[];
  academicKeywords: string[];
  suggestedProjectTitles: string[];
}

export interface CuratedClicheItem {
  topic: string;
  rejectionRate: number;
  category: string;
  status: string;
  flaw: string;
  rescueUpgrade: string;
}
