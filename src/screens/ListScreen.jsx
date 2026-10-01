import { STAGE_COUNT } from '../stages.js'

function StageCard({ stage, materials, practiceSets, onOpenMaterial, onOpenPractice }) {
  return (
    <div className="stage-card">
      <div className="stage-card-head">
        <h2 className="stage-title">Giai đoạn {stage}</h2>
      </div>
      <ul className="material-list">
        {materials.map((m) => (
          <li key={m.material_id}>
            <button type="button" className="material-link" onClick={() => onOpenMaterial(m)}>
              {m.title_vi}
            </button>
          </li>
        ))}
      </ul>
      {practiceSets.length > 0 && (
        <div className="practice-list">
          <span className="practice-list-label">Luyện tập</span>
          <ul className="material-list">
            {practiceSets.map((p) => (
              <li key={p.practice_id}>
                <button type="button" className="material-link" onClick={() => onOpenPractice(p)}>
                  {p.title_vi}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// The stage trail. Every stage is open: tapping any material or practice opens it.
export default function ListScreen({ materials, practiceSets, onOpenMaterial, onOpenPractice }) {
  const stages = []
  for (let stage = 1; stage <= STAGE_COUNT; stage++) {
    stages.push({
      stage,
      materials: materials
        .filter((m) => m.stage === stage)
        .sort((a, b) => a.material_id - b.material_id),
    })
  }

  return (
    <main>
      <ol className="stage-trail">
        {stages.map(({ stage, materials: stageMaterials }) => (
          <li key={stage}>
            <div className="stage-row">
              <div className="trail-rail">
                <div className="trail-marker">
                  <span aria-hidden="true">{stage}</span>
                </div>
                <div className="trail-line" />
              </div>
              <StageCard
                stage={stage}
                materials={stageMaterials}
                practiceSets={practiceSets.filter((p) => p.stage === stage)}
                onOpenMaterial={onOpenMaterial}
                onOpenPractice={onOpenPractice}
              />
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
