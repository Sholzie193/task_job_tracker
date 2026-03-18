import {
  BENCHMARK_VERSION,
  DEFAULT_PROVIDER,
} from "@/lib/benchmark/constants";
import {
  BENCHMARK_ROLE_COUNT,
  BENCHMARK_TASK_COUNT,
} from "@/data/roles";
import type {
  BenchmarkMode,
  BenchmarkProvider,
  BenchmarkRunMetadata,
  BenchmarkRunResult,
  CategoryExposureSummary,
  ExposureBand,
  HumanDependency,
  RoleBenchmarkConfig,
  RoleExposureResult,
  RoleExposureSnapshot,
  RoleTaskSnapshot,
  TaskEvaluationResult,
  TaskStatus,
} from "@/lib/benchmark/types";

const dependencyRank: Record<HumanDependency, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
};

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildRunId(model: string, runDate: string) {
  const timestamp = new Date(runDate).getTime().toString(36);
  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return `${modelSlug}-${timestamp}`;
}

export function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildCombinedScore(
  taskAutomationConfidence: number,
  autonomyConfidence: number,
) {
  return clampScore(taskAutomationConfidence * 0.62 + autonomyConfidence * 0.38);
}

export function getExposureBand(score: number): ExposureBand {
  if (score <= 20) {
    return "Minimal";
  }
  if (score <= 40) {
    return "Limited";
  }
  if (score <= 60) {
    return "Moderate";
  }
  if (score <= 80) {
    return "High";
  }
  return "Very High";
}

export function getTaskStatus(score: number): TaskStatus {
  if (score >= 72) {
    return "Automatable";
  }
  if (score >= 45) {
    return "Assisted";
  }
  return "Human-led";
}

export function mergeHumanDependency(
  first: HumanDependency,
  second: HumanDependency,
): HumanDependency {
  return dependencyRank[first] >= dependencyRank[second] ? first : second;
}

export function deriveAverageHumanDependency(
  dependencies: HumanDependency[],
): HumanDependency {
  const score = average(dependencies.map((dependency) => dependencyRank[dependency]));

  if (score >= 1.5) {
    return "High";
  }
  if (score >= 0.5) {
    return "Medium";
  }
  return "Low";
}

function toRoleTaskSnapshot(
  task: TaskEvaluationResult,
  rationale: string,
): RoleTaskSnapshot {
  return {
    taskId: task.taskId,
    title: task.taskTitle,
    score: task.combinedScore,
    rationale,
  };
}

function buildRoleSummary(
  role: RoleBenchmarkConfig,
  exposureScore: number,
  averageAutomation: number,
  averageAutonomy: number,
  strongestTask: TaskEvaluationResult,
  weakestTask: TaskEvaluationResult,
): string {
  if (role.category === "physical") {
    return `${role.name} stays comparatively insulated because the model helps with triage and communication, but ${weakestTask.taskTitle.toLowerCase()} still depends on inspection, safety judgment, or physical execution. ${strongestTask.taskTitle} remains useful as prep work.`;
  }

  if (exposureScore >= 72) {
    return `${role.name} is highly exposed because much of the workload is text-native, structured, and repeatable. ${strongestTask.taskTitle} stands out as especially automatable, while ${weakestTask.taskTitle.toLowerCase()} still needs human judgment.`;
  }

  if (exposureScore >= 50) {
    return `${role.name} lands in the middle: the model is useful across drafting and synthesis work, but autonomy breaks down faster when priorities shift or context is incomplete. ${averageAutomation.toFixed(0)} automation confidence outpaces ${averageAutonomy.toFixed(0)} autonomy confidence for that reason.`;
  }

  return `${role.name} shows limited exposure because even when the model can assist with language-heavy work, the role still relies on human judgment, stakeholder handling, or physical follow-through. ${weakestTask.taskTitle} is a clear constraint.`;
}

export function aggregateRoleResults(
  role: RoleBenchmarkConfig,
  tasks: TaskEvaluationResult[],
): RoleExposureResult {
  const averageAutomation = clampScore(
    average(tasks.map((task) => task.taskAutomationConfidence)),
  );
  const averageAutonomy = clampScore(
    average(tasks.map((task) => task.autonomyConfidence)),
  );
  const exposureScore = clampScore(average(tasks.map((task) => task.combinedScore)));
  const sortedTasks = [...tasks].sort((left, right) => right.combinedScore - left.combinedScore);
  const strongestTask = sortedTasks[0];
  const weakestTask = sortedTasks[sortedTasks.length - 1];

  return {
    roleId: role.id,
    roleName: role.name,
    roleCategory: role.category,
    exposureScore,
    exposureBand: getExposureBand(exposureScore),
    averageAutomation,
    averageAutonomy,
    humanDependency: deriveAverageHumanDependency(
      tasks.map((task) => task.humanDependency),
    ),
    summaryRationale: buildRoleSummary(
      role,
      exposureScore,
      averageAutomation,
      averageAutonomy,
      strongestTask,
      weakestTask,
    ),
    taskCount: tasks.length,
    tasks,
    topAutomatableTasks: sortedTasks.slice(0, 3).map((task) =>
      toRoleTaskSnapshot(
        task,
        `${task.taskTitle} scores well because the output is highly structured and language-native.`,
      ),
    ),
    weakestTasks: [...sortedTasks]
      .reverse()
      .slice(0, 3)
      .map((task) =>
        toRoleTaskSnapshot(
          task,
          `${task.taskTitle} stays harder because human context, uncertainty, or real-world execution still dominates.`,
        ),
      ),
  };
}

function summarizeRole(role: RoleExposureResult): RoleExposureSnapshot {
  return {
    roleId: role.roleId,
    roleName: role.roleName,
    exposureScore: role.exposureScore,
    exposureBand: role.exposureBand,
    roleCategory: role.roleCategory,
  };
}

function buildCategoryExposure(
  roles: RoleExposureResult[],
): CategoryExposureSummary[] {
  const categories = ["white-collar", "hybrid", "physical"] as const;

  return categories.map((category) => {
    const categoryRoles = roles.filter((role) => role.roleCategory === category);

    return {
      category,
      exposureScore: clampScore(
        average(categoryRoles.map((role) => role.exposureScore)),
      ),
      roleCount: categoryRoles.length,
    };
  });
}

export function createBenchmarkMetadata({
  provider = DEFAULT_PROVIDER,
  model,
  runDate,
  mode,
}: {
  provider?: BenchmarkProvider;
  model: string;
  runDate: string;
  mode: BenchmarkMode;
}): BenchmarkRunMetadata {
  return {
    runId: buildRunId(model, runDate),
    provider,
    model,
    benchmarkVersion: BENCHMARK_VERSION,
    runDate,
    roleCount: BENCHMARK_ROLE_COUNT,
    taskCount: BENCHMARK_TASK_COUNT,
    mode,
  };
}

export function aggregateBenchmarkRun(
  roleResults: RoleExposureResult[],
  metadata: BenchmarkRunMetadata,
): BenchmarkRunResult {
  const sortedRoles = [...roleResults].sort(
    (left, right) => right.exposureScore - left.exposureScore,
  );

  return {
    meta: metadata,
    overallAverageExposure: clampScore(
      average(roleResults.map((role) => role.exposureScore)),
    ),
    averageAutonomy: clampScore(
      average(roleResults.map((role) => role.averageAutonomy)),
    ),
    totalAutomatableTasks: roleResults.reduce(
      (count, role) =>
        count + role.tasks.filter((task) => task.status === "Automatable").length,
      0,
    ),
    highestExposureRoles: sortedRoles.slice(0, 3).map(summarizeRole),
    lowestExposureRoles: [...sortedRoles].reverse().slice(0, 3).map(summarizeRole),
    categoryExposure: buildCategoryExposure(roleResults),
    roleResults,
  };
}
