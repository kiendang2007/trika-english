import TextBlock from './blocks/TextBlock.jsx'
import SectionBlock from './blocks/SectionBlock.jsx'
import FunfactBlock from './blocks/FunfactBlock.jsx'
import QuestionCard from './blocks/ItemBlock.jsx'

export default function MaterialPage({
  material,
  stageMaterials,
  onBack,
  nextStep,
  onOpenMaterial,
  onOpenPractice,
}) {
  const position = stageMaterials.findIndex((m) => m.material_id === material.material_id) + 1

  return (
    <main>
      <div className="screen-header">
        <button type="button" className="link-button" onClick={onBack}>
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          <span>Về danh sách</span>
        </button>
        <span className="pill pill-current">Giai đoạn {material.stage}</span>
      </div>

      <div className="material-heading">
        <h1>{material.title_vi}</h1>
        {stageMaterials.length > 1 && (
          <span className="material-sub">
            Bài {position} trong {stageMaterials.length}
          </span>
        )}
      </div>

      {/* Keys carry material_id and item id, never a position, so a question never inherits
          the state of the question that sat at the same place in the previous material. */}
      {material.blocks.map((block, index) => {
        switch (block.type) {
          case 'text':
            return <TextBlock key={`${material.material_id}:${index}`} block={block} />
          case 'section':
            return <SectionBlock key={`${material.material_id}:${index}`} block={block} />
          case 'funfact':
            return <FunfactBlock key={`${material.material_id}:${index}`} block={block} />
          case 'item':
            return (
              <QuestionCard
                key={`${material.material_id}:${block.item.id}`}
                item={block.item}
              />
            )
          default:
            return null
        }
      })}

      {/* A stage with practice sends the learner there first; after the last material of all,
          the button goes back to the stage list. */}
      {nextStep.kind === 'practice' && (
        <p className="stage-note">Bước tiếp theo: luyện tập giai đoạn {nextStep.stage}</p>
      )}
      <div className="btn-row">
        {nextStep.kind === 'practice' ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onOpenPractice(nextStep.practice)}
          >
            Sang phần luyện tập
          </button>
        ) : nextStep.kind === 'material' ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => onOpenMaterial(nextStep.material)}
          >
            Bước tiếp theo: {nextStep.material.title_vi}
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={onBack}>
            Bước tiếp theo: về danh sách giai đoạn
          </button>
        )}
      </div>
    </main>
  )
}
