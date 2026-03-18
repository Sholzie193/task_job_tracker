export type BenchmarkProvider = "openai";
export type BenchmarkMode = "mock" | "live";
export type RoleCategory = "white-collar" | "hybrid" | "physical";
export type TaskDifficulty = "Low" | "Medium" | "High";
export type HumanDependency = "Low" | "Medium" | "High";
export type ExposureBand =
  | "Minimal"
  | "Limited"
  | "Moderate"
  | "High"
  | "Very High";
export type TaskStatus = "Human-led" | "Assisted" | "Automatable";
export type ExpectedOutputType =
  | "classification"
  | "draft"
  | "summary"
  | "analysis"
  | "checklist"
  | "code"
  | "prioritization"
  | "routing"
  | "explanation";

export interface BenchmarkTaskConfig {
  id: string;
  title: string;
  description: string;
  difficulty: TaskDifficulty;
  scoringNotes: string;
  expectedOutputType: ExpectedOutputType;
}

export interface RoleBenchmarkConfig {
  id: string;
  name: string;
  category: RoleCategory;
  benchmarkNotes: string;
  tasks: BenchmarkTaskConfig[];
}

export interface TaskEvaluationResult {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  difficulty: TaskDifficulty;
  expectedOutputType: ExpectedOutputType;
  taskAutomationConfidence: number;
  autonomyConfidence: number;
  combinedScore: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  humanDependency: HumanDependency;
  status: TaskStatus;
}

export interface RoleTaskSnapshot {
  taskId: string;
  title: string;
  score: number;
  rationale: string;
}

export interface RoleExposureResult {
  roleId: string;
  roleName: string;
  roleCategory: RoleCategory;
  exposureScore: number;
  exposureBand: ExposureBand;
  averageAutomation: number;
  averageAutonomy: number;
  humanDependency: HumanDependency;
  summaryRationale: string;
  taskCount: number;
  tasks: TaskEvaluationResult[];
  topAutomatableTasks: RoleTaskSnapshot[];
  weakestTasks: RoleTaskSnapshot[];
}

export interface RoleExposureSnapshot {
  roleId: string;
  roleName: string;
  exposureScore: number;
  exposureBand: ExposureBand;
  roleCategory: RoleCategory;
}

export interface CategoryExposureSummary {
  category: RoleCategory;
  exposureScore: number;
  roleCount: number;
}

export interface BenchmarkRunMetadata {
  runId: string;
  provider: BenchmarkProvider;
  model: string;
  benchmarkVersion: string;
  runDate: string;
  roleCount: number;
  taskCount: number;
  mode: BenchmarkMode;
}

export interface BenchmarkRunResult {
  meta: BenchmarkRunMetadata;
  overallAverageExposure: number;
  averageAutonomy: number;
  totalAutomatableTasks: number;
  highestExposureRoles: RoleExposureSnapshot[];
  lowestExposureRoles: RoleExposureSnapshot[];
  categoryExposure: CategoryExposureSummary[];
  roleResults: RoleExposureResult[];
}

export interface RunBenchmarkRequest {
  provider: BenchmarkProvider;
  model: string;
  mode: BenchmarkMode;
  apiKey?: string;
}

export interface CurrentRunState {
  run: BenchmarkRunResult;
  isSampleRun: boolean;
}
