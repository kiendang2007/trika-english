const practiceModules = import.meta.glob('/content/practice/*.json', { eager: true })

export const practiceSets = Object.values(practiceModules)
  .map((mod) => mod.default ?? mod)
  .sort((a, b) => {
    const [aStage, aPart] = a.practice_id.split('.').map(Number)
    const [bStage, bPart] = b.practice_id.split('.').map(Number)
    return aStage - bStage || aPart - bPart
  })

export function practiceSetsForStage(stage) {
  return practiceSets.filter((p) => p.stage === stage)
}
