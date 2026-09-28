import TextBlock from './blocks/TextBlock.jsx'
import SectionBlock from './blocks/SectionBlock.jsx'
import FunfactBlock from './blocks/FunfactBlock.jsx'
import QuestionCard from './blocks/ItemBlock.jsx'
import Notice from './components/Notice.jsx'

export default function MaterialPage({
  material,
  stageMaterials,
  onBack,
  nextMaterial,
  onOpenMaterial,
  correct,
  onAnswerPick,
  allStagesDone,
  stageNote,
  notice,
  onDismissNotice,
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
                alreadyCorrect={Boolean(correct[`${material.material_id}:${block.item.id}`])}
                onPick={(choiceKey, isCorrect) =>
                  onAnswerPick(material.material_id, block.item.id, choiceKey, isCorrect)
                }
              />
            )
          default:
            return null
        }
      })}

      <Notice notice={notice} onDismiss={onDismissNotice} />

      {/* Every question in this stage is answered, but the practice that opens the next stage
          is not finished yet, so say which one is now the way forward. */}
      {stageNote && <p className="stage-note">{stageNote}</p>}

      {/* The last material of the last stage has nothing after it, so there is no next step to
          name and no button is rendered. Once every stage is done the finished state takes its
          place. */}
      {nextMaterial ? (
        <div className="btn-row">
          <button type="button" className="btn-primary" onClick={() => onOpenMaterial(nextMaterial)}>
            Bước tiếp theo: {nextMaterial.title_vi}
          </button>
        </div>
      ) : (
        allStagesDone && <p className="all-done">Đã học xong tất cả các giai đoạn.</p>
      )}
    </main>
  )
}
