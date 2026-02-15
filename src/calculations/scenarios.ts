import { calculateWealthProjection, ProjectionInput } from "./wealthProjection"

export type ScenarioType = "bear" | "base" | "bull"

const scenarioModifiers: Record<ScenarioType, number> = {
  bear: -0.02,
  base: 0,
  bull: +0.02
}

export function calculateScenarios(
  input: ProjectionInput
) {
  return {
    bear: calculateWealthProjection({
      ...input,
      annualReturn: input.annualReturn + scenarioModifiers.bear
    }),
    base: calculateWealthProjection({
      ...input,
      annualReturn: input.annualReturn + scenarioModifiers.base
    }),
    bull: calculateWealthProjection({
      ...input,
      annualReturn: input.annualReturn + scenarioModifiers.bull
    })
  }
}
