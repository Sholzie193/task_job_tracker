# Frontier Task Exposure Lab

Frontier Task Exposure Lab is a local-first MVP for benchmarking frontier OpenAI models against realistic role tasks instead of generic model leaderboards. It runs a fixed V1 role set, scores task-level automation and autonomy confidence, and aggregates those results into role exposure dashboards.

## What the app does

- Runs a role exposure benchmark against your chosen OpenAI model
- Shows the exact provider, model, benchmark version, run date, role count, and task count for every result
- Breaks each role into eight realistic tasks for a total of 72 tasks in V1
- Aggregates task scores into role exposure scores and benchmark-level summaries
- Includes a polished mock mode so the UI works immediately without a live API call

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide icons
- OpenAI SDK scaffold for live evaluation

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000`
   The root route redirects to `/overview`.

## App structure

The app now uses progressive disclosure instead of one long scrolling page:

- `/overview` for the minimal high-signal summary
- `/roles` for the role index
- `/roles/[slug]` for dedicated role detail pages with collapsed task accordions
- `/methodology` for benchmark interpretation and guardrails
- `/runs/[id]` for the session-backed run details page and benchmark runner

`/runner` is kept as a legacy redirect to `/runs/latest`.

## How to use the benchmark runner

- Open `/runs/latest`
- Select `Mock baseline` or `Live OpenAI`
- Choose a model from the preset list or type an exact model name manually
- In live mode, paste your OpenAI API key into the runner panel
- Click `Start benchmark`

The UI makes it explicit that the key is only used for the current local run. There is no database storage, auth layer, or team account system in V1.

## Where to add the OpenAI API key

For V1, the key is entered directly in the benchmark runner UI. It is sent only for the current request to the local `/api/benchmark` route and is not persisted in a database.

## Mock mode

Mock mode is fully implemented and is the default starting experience.

- It uses the same typed benchmark dataset as live mode
- It generates deterministic, believable task and role scores
- It is useful for UI development, flow testing, and demonstrating the product without live API calls

Mock generation lives in:

- [src/lib/benchmark/mock-engine.ts](/Users/sola/Desktop/AI_task_taker/src/lib/benchmark/mock-engine.ts)

## Live OpenAI integration scaffold

The live OpenAI path is structured so it can be upgraded later without rewriting the UI:

- [src/app/api/benchmark/route.ts](/Users/sola/Desktop/AI_task_taker/src/app/api/benchmark/route.ts)
- [src/lib/openai/client.ts](/Users/sola/Desktop/AI_task_taker/src/lib/openai/client.ts)
- [src/lib/openai/prompts.ts](/Users/sola/Desktop/AI_task_taker/src/lib/openai/prompts.ts)

The current scaffold:

- Evaluates tasks sequentially
- Requests structured JSON output
- Normalizes results into the benchmark schema
- Handles missing key and error states cleanly

## Benchmark dataset and extension points

The fixed V1 role set and task configs live in:

- [src/data/roles.ts](/Users/sola/Desktop/AI_task_taker/src/data/roles.ts)

Core benchmark types and aggregation logic live in:

- [src/lib/benchmark/types.ts](/Users/sola/Desktop/AI_task_taker/src/lib/benchmark/types.ts)
- [src/lib/benchmark/scoring.ts](/Users/sola/Desktop/AI_task_taker/src/lib/benchmark/scoring.ts)

To extend the benchmark:

1. Add or modify roles/tasks in [src/data/roles.ts](/Users/sola/Desktop/AI_task_taker/src/data/roles.ts)
2. Adjust scoring or aggregation behavior in [src/lib/benchmark/scoring.ts](/Users/sola/Desktop/AI_task_taker/src/lib/benchmark/scoring.ts)
3. Refine mock generation in [src/lib/benchmark/mock-engine.ts](/Users/sola/Desktop/AI_task_taker/src/lib/benchmark/mock-engine.ts)
4. Upgrade live evaluation prompts or response handling in [src/lib/openai/prompts.ts](/Users/sola/Desktop/AI_task_taker/src/lib/openai/prompts.ts) and [src/lib/openai/client.ts](/Users/sola/Desktop/AI_task_taker/src/lib/openai/client.ts)

## Project structure

```text
src/
  app/
    api/benchmark/
    methodology/
    overview/
    roles/
    runs/
  components/
    app-shell/
    benchmark/
    dashboard/
    methodology/
    overview/
    roles/
    runs/
    ui/
    visualizations/
  data/
  lib/
    benchmark/
    openai/
    session/
```

## Notes

- V1 supports OpenAI only
- Results are capability and exposure indicators, not direct job-loss predictions
- Physical roles score lower by design because LLMs are limited in embodied execution
