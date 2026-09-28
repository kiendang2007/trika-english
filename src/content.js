import { stageFor } from './stages.js'

const materialModules = import.meta.glob('/content/materials/*.json', { eager: true })

// `stage` is the one field the site does not take straight from the file. See src/stages.js.
export const materials = Object.values(materialModules)
  .map((mod) => mod.default ?? mod)
  .map((material) => ({ ...material, stage: stageFor(material) }))
  .sort((a, b) => a.material_id - b.material_id)

export function itemIdsFor(material) {
  return material.blocks
    .filter((block) => block.type === 'item')
    .map((block) => block.item.id)
}
