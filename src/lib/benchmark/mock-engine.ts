import {
  DEFAULT_MODEL,
  DEFAULT_PROVIDER,
} from "@/lib/benchmark/constants";
import { roleBenchmarks } from "@/data/roles";
import {
  aggregateBenchmarkRun,
  aggregateRoleResults,
  buildCombinedScore,
  clampScore,
  createBenchmarkMetadata,
  getTaskStatus,
  mergeHumanDependency,
} from "@/lib/benchmark/scoring";
import type {
  BenchmarkProvider,
  BenchmarkRunResult,
  HumanDependency,
  RoleBenchmarkConfig,
  TaskEvaluationResult,
} from "@/lib/benchmark/types";

type MockProfile = {
  baseAutomation: number;
  baseAutonomy: number;
  defaultHumanDependency: HumanDependency;
  strengthFrame: string;
  constraintFrame: string;
};

const mockProfiles: Record<string, MockProfile> = {
  "customer-support-agent": {
    baseAutomation: 80,
    baseAutonomy: 71,
    defaultHumanDependency: "Medium",
    strengthFrame: "language-heavy customer operations are already highly model-friendly",
    constraintFrame: "policy exceptions and reputational edge cases still need a person in the loop",
  },
  "executive-assistant": {
    baseAutomation: 78,
    baseAutonomy: 66,
    defaultHumanDependency: "Medium",
    strengthFrame: "summarization, drafting, and coordination prep map well to the model",
    constraintFrame: "calendar tradeoffs and executive context remain harder to delegate fully",
  },
  "marketing-assistant": {
    baseAutomation: 84,
    baseAutonomy: 70,
    defaultHumanDependency: "Medium",
    strengthFrame: "copy generation and messaging synthesis are natural strengths for the model",
    constraintFrame: "performance interpretation still benefits from human strategy judgment",
  },
  "research-analyst": {
    baseAutomation: 76,
    baseAutonomy: 63,
    defaultHumanDependency: "Medium",
    strengthFrame: "text synthesis and pattern extraction are strong",
    constraintFrame: "evidence quality control and prioritization under uncertainty still matter",
  },
  "junior-software-developer": {
    baseAutomation: 72,
    baseAutonomy: 58,
    defaultHumanDependency: "Medium",
    strengthFrame: "scoped code generation and explanation work are increasingly tractable",
    constraintFrame: "verification, edge cases, and integration details still limit autonomy",
  },
  recruiter: {
    baseAutomation: 69,
    baseAutonomy: 56,
    defaultHumanDependency: "Medium",
    strengthFrame: "screening and communication tasks are highly compressible into prompts",
    constraintFrame: "candidate evaluation and relationship nuance still need human oversight",
  },
  "project-coordinator": {
    baseAutomation: 73,
    baseAutonomy: 59,
    defaultHumanDependency: "Medium",
    strengthFrame: "coordination summaries and structured follow-through are model-friendly",
    constraintFrame: "real project ownership still depends on human alignment and escalation judgment",
  },
  plumber: {
    baseAutomation: 30,
    baseAutonomy: 18,
    defaultHumanDependency: "High",
    strengthFrame: "the model can help with intake, explanation, and pre-visit structure",
    constraintFrame: "inspection, safety checks, and repair execution are fundamentally embodied",
  },
  "delivery-driver": {
    baseAutomation: 34,
    baseAutonomy: 21,
    defaultHumanDependency: "High",
    strengthFrame: "the model can assist with planning and communication around the route",
    constraintFrame: "navigation, situational awareness, and package handoff stay physical",
  },
};

const difficultyModifiers = {
  Low: { automation: 7, autonomy: 8 },
  Medium: { automation: 0, autonomy: -1 },
  High: { automation: -8, autonomy: -11 },
} as const;

const keywordModifiers = [
  {
    match: /draft|rewrite|summarize|summary|faq|copy|email|notification/i,
    automation: 8,
    autonomy: 6,
    humanDependency: "Low" as HumanDependency,
    positive: "the output is mostly language transformation and benefits from speed",
    caution: "final tone and factual review still deserve a quick check",
  },
  {
    match: /classify|extract|identify category|screen/i,
    automation: 6,
    autonomy: 4,
    humanDependency: "Medium" as HumanDependency,
    positive: "the task has a relatively structured decision surface",
    caution: "ambiguous inputs can still blur the boundaries between labels",
  },
  {
    match: /compare|rank|prioritize|tradeoff|assumptions|missing evidence|blockers/i,
    automation: 1,
    autonomy: -4,
    humanDependency: "Medium" as HumanDependency,
    positive: "the model can still surface useful first-pass structure",
    caution: "judgment quality becomes sensitive to missing business context",
  },
  {
    match: /code|function|refactor|test|bug|implementation/i,
    automation: 5,
    autonomy: 0,
    humanDependency: "Medium" as HumanDependency,
    positive: "structured technical patterns give the model a good scaffold",
    caution: "runtime verification and edge-case correctness remain necessary",
  },
  {
    match: /schedule|route|sequence|agenda|travel/i,
    automation: 2,
    autonomy: -2,
    humanDependency: "Medium" as HumanDependency,
    positive: "the model helps with ordering and planning under constrained inputs",
    caution: "real-world conditions can shift after the plan is produced",
  },
  {
    match: /physical|on-site|visit|delivery|repair|intervention|safety|diagnose/i,
    automation: -16,
    autonomy: -20,
    humanDependency: "High" as HumanDependency,
    positive: "it can still support pre-work triage and communication",
    caution: "the decisive step requires embodied observation or action",
  },
  {
    match: /ambiguous|missing information|vague/i,
    automation: -6,
    autonomy: -9,
    humanDependency: "High" as HumanDependency,
    positive: "the model can ask clarifying questions efficiently",
    caution: "it should not act with high confidence when critical context is absent",
  },
];

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function createStrengths(
  title: string,
  profile: MockProfile,
  score: number,
  positive: string,
) {
  const strengths = [profile.strengthFrame, positive];

  if (score >= 78) {
    strengths.push(`${title} is constrained enough to run with minimal supervision.`);
  } else if (score >= 58) {
    strengths.push(`${title} benefits from the model as a fast first draft or triage layer.`);
  } else {
    strengths.push(`${title} still benefits from model assistance before a human handoff.`);
  }

  return strengths;
}

function createWeaknesses(
  profile: MockProfile,
  humanDependency: HumanDependency,
  caution: string,
) {
  const weaknesses = [profile.constraintFrame, caution];

  if (humanDependency === "High") {
    weaknesses.push("Physical execution, safety, or field uncertainty keep the human critical path intact.");
  } else if (humanDependency === "Medium") {
    weaknesses.push("A human reviewer still improves judgment quality on ambiguous cases.");
  } else {
    weaknesses.push("Light oversight is still useful for accuracy and policy alignment.");
  }

  return weaknesses;
}

function buildReasoning({
  model,
  title,
  score,
  positive,
  caution,
}: {
  model: string;
  title: string;
  score: number;
  positive: string;
  caution: string;
}) {
  if (score >= 76) {
    return `${model} performs strongly on ${title.toLowerCase()} because ${positive}. ${caution}.`;
  }

  if (score >= 50) {
    return `${model} is useful on ${title.toLowerCase()} as a co-pilot, but ${caution}.`;
  }

  return `${model} can contribute to ${title.toLowerCase()} in a narrow advisory way, but ${caution}.`;
}

function evaluateMockTask(
  role: RoleBenchmarkConfig,
  task: RoleBenchmarkConfig["tasks"][number],
  model: string,
): TaskEvaluationResult {
  const profile = mockProfiles[role.id];
  const jitterSeed = hashString(`${model}:${task.id}`);
  const jitter = (jitterSeed % 11) - 5;
  const difficulty = difficultyModifiers[task.difficulty];
  let automation =
    profile.baseAutomation + difficulty.automation + jitter * 0.9;
  let autonomy = profile.baseAutonomy + difficulty.autonomy + jitter * 1.1;
  let humanDependency = profile.defaultHumanDependency;
  let positive =
    "the task maps cleanly to text understanding, transformation, or structured output";
  let caution =
    "context gaps or real-world exceptions can still reduce reliability";

  for (const modifier of keywordModifiers) {
    if (modifier.match.test(`${task.title} ${task.description}`)) {
      automation += modifier.automation;
      autonomy += modifier.autonomy;
      humanDependency = mergeHumanDependency(
        humanDependency,
        modifier.humanDependency,
      );
      positive = modifier.positive;
      caution = modifier.caution;
    }
  }

  if (role.category === "physical") {
    autonomy -= 6;
  }

  if (role.category === "white-collar" && task.expectedOutputType === "draft") {
    automation += 3;
  }

  const taskAutomationConfidence = clampScore(automation);
  const autonomyConfidence = clampScore(autonomy);
  const combinedScore = buildCombinedScore(
    taskAutomationConfidence,
    autonomyConfidence,
  );

  return {
    taskId: task.id,
    taskTitle: task.title,
    taskDescription: task.description,
    difficulty: task.difficulty,
    expectedOutputType: task.expectedOutputType,
    taskAutomationConfidence,
    autonomyConfidence,
    combinedScore,
    reasoning: buildReasoning({
      model,
      title: task.title,
      score: combinedScore,
      positive,
      caution,
    }),
    strengths: createStrengths(task.title, profile, combinedScore, positive),
    weaknesses: createWeaknesses(profile, humanDependency, caution),
    humanDependency,
    status: getTaskStatus(combinedScore),
  };
}

export function generateMockBenchmarkRun({
  provider = DEFAULT_PROVIDER as BenchmarkProvider,
  model = DEFAULT_MODEL,
  runDate,
}: {
  provider?: BenchmarkProvider;
  model?: string;
  runDate: string;
}): BenchmarkRunResult {
  const roleResults = roleBenchmarks.map((role) => {
    const tasks = role.tasks.map((task) => evaluateMockTask(role, task, model));
    return aggregateRoleResults(role, tasks);
  });

  return aggregateBenchmarkRun(
    roleResults,
    createBenchmarkMetadata({
      provider,
      model,
      runDate,
      mode: "mock",
    }),
  );
}

