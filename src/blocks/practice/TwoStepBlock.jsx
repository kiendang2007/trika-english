import { useState } from 'react'
import PracticeCard from './PracticeCard.jsx'
import PracticeFeedback from './PracticeFeedback.jsx'
import { CheckCircle } from '../../components/Icons.jsx'
import { buildSentence } from '../../practiceUtils.js'

const SLOT_LABEL = { tense: 'thì', aspect: 'thể', voice: 'dạng' }
const SLOT_KEYS = ['tense', 'aspect', 'voice']

function ComboLine({ values, checkedAgainst }) {
  return (
    <div className="combo-line">
      {SLOT_KEYS.map((key, i) => {
        const value = values[key]
        let slotClass = 'tense-slot'
        let mark = null
        if (checkedAgainst) {
          const isCorrect = value === checkedAgainst[key]
          slotClass = `combo-slot-filled ${isCorrect ? 'correct' : 'wrong'}`
          mark = isCorrect ? '✓' : '✕'
        } else if (value) {
          slotClass = 'combo-slot-filled'
        }
        return (
          <span key={key} style={{ display: 'contents' }}>
            {i > 0 && <span className="combo-plus">+</span>}
            <span className={slotClass}>
              {value || SLOT_LABEL[key]}
              {mark && <span className="combo-mark"> {mark}</span>}
            </span>
          </span>
        )
      })}
    </div>
  )
}

function OptionChipRow({ label, options, value, onPick, disabled }) {
  return (
    <div className="chip-group">
      <div className="chip-group-label">{label}</div>
      <div className="chip-row">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`option-chip${value === opt ? ' selected' : ''}`}
            disabled={disabled}
            onClick={() => onPick(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function TwoStepBlock({ item, onNext }) {
  const { step1, step2 } = item
  const [values, setValues] = useState({ tense: null, aspect: null, voice: null })
  const [step1Status, setStep1Status] = useState('building') // building | correct | wrong
  const [reviewOpen, setReviewOpen] = useState(false)

  const [placedIds, setPlacedIds] = useState([])
  const [step2Status, setStep2Status] = useState('building')

  const allFilled = SLOT_KEYS.every((k) => values[k])

  function pickValue(key, value) {
    if (step1Status !== 'building') return
    setValues({ ...values, [key]: value })
  }

  function checkStep1() {
    const isCorrect = SLOT_KEYS.every((k) => values[k] === step1.answer[k])
    setStep1Status(isCorrect ? 'correct' : 'wrong')
  }

  function retryStep1() {
    setValues({ tense: null, aspect: null, voice: null })
    setStep1Status('building')
  }

  const step1WrongLines = SLOT_KEYS.map((k) => {
    const ok = values[k] === step1.answer[k]
    return `${SLOT_LABEL[k].charAt(0).toUpperCase() + SLOT_LABEL[k].slice(1)}: ${ok ? 'đúng' : 'chưa đúng'}`
  }).join('. ')

  const step1AnswerText = SLOT_KEYS.map((k) => step1.answer[k]).join(' + ')

  // Step 2. Each item has exactly two decoy chips (one spare auxiliary, one spare main-verb
  // form); Kiểm tra locks only when both of those specific chips are on the answer line, not
  // whenever two auxiliary-looking words appear (a correct sentence like "will have finished"
  // legitimately uses two auxiliary words).
  const chips2 = step2.chips.map((text, i) => ({ id: i, text }))
  const placed2 = placedIds.map((id) => chips2.find((c) => c.id === id))
  const pool2 = chips2.filter((c) => !placedIds.includes(c.id))

  const decoyIds = step2.decoys.map((text) => chips2.find((c) => c.text === text).id)
  const bothDecoysPlaced = decoyIds.every((id) => placedIds.includes(id))
  const duplicateWords = bothDecoysPlaced ? step2.decoys : []

  const step2Ready = pool2.length === step2.decoys.length && !bothDecoysPlaced

  function place2(id) {
    if (step2Status !== 'building') return
    setPlacedIds([...placedIds, id])
  }

  function unplace2(id) {
    if (step2Status !== 'building') return
    setPlacedIds(placedIds.filter((i) => i !== id))
  }

  function checkStep2() {
    const built = buildSentence(placed2.map((c) => c.text))
    const isCorrect = built === step2.answer
    setStep2Status(isCorrect ? 'correct' : 'wrong')
  }

  function retryStep2() {
    setPlacedIds([])
    setStep2Status('building')
  }

  const built2 = buildSentence(placed2.map((c) => c.text))

  function chip2Class(chip) {
    if (step2Status === 'correct' || step2Status === 'wrong') return `order-chip ${step2Status}`
    return bothDecoysPlaced && decoyIds.includes(chip.id) ? 'order-chip suspect' : 'order-chip placed'
  }

  if (step1Status !== 'correct') {
    const badge = 'Bước 1 / 2'
    return (
      <PracticeCard
        label="Hai bước"
        badge={badge}
        prompt={step1.prompt_vi}
        footer={
          step1Status === 'building'
            ? allFilled
              ? 'Bấm Kiểm tra để xem kết quả.'
              : 'Nút Kiểm tra mở khi cả ba ô đã có chip.'
            : null
        }
      >
        <p className="sentence-box">{item.prompt_vi}</p>
        <ComboLine values={values} checkedAgainst={step1Status === 'wrong' ? step1.answer : null} />

        {step1Status === 'wrong' && (
          <p className="hint">{step1WrongLines}</p>
        )}

        {step1Status === 'building' && (
          <>
            <OptionChipRow
              label="Thì"
              options={step1.tense_options}
              value={values.tense}
              onPick={(v) => pickValue('tense', v)}
            />
            <OptionChipRow
              label="Thể"
              options={step1.aspect_options}
              value={values.aspect}
              onPick={(v) => pickValue('aspect', v)}
            />
            <OptionChipRow
              label="Dạng"
              options={step1.voice_options}
              value={values.voice}
              onPick={(v) => pickValue('voice', v)}
            />
            <button type="button" className="btn-primary" disabled={!allFilled} onClick={checkStep1}>
              Kiểm tra
            </button>
          </>
        )}

        {step1Status === 'wrong' && (
          <PracticeFeedback
            status="wrong"
            quote={step1AnswerText}
            explanation={item.rule_vi}
            ghiNho={step1AnswerText}
            onRetry={retryStep1}
          />
        )}
      </PracticeCard>
    )
  }

  return (
    <PracticeCard label="Hai bước" badge="Bước 2 / 2" prompt={step2.prompt_vi}>
      <div className="step1-summary">
        <div className="step1-summary-top">
          <span className="step1-summary-label">Bước 1 · xong</span>
          <button type="button" className="step1-summary-link" onClick={() => setReviewOpen(!reviewOpen)}>
            Xem lại
          </button>
        </div>
        <div className="step1-summary-combo">
          <CheckCircle size={16} />
          <span>{step1AnswerText}</span>
        </div>
        {reviewOpen && (
          <p className="hint">
            Thì: {step1.answer.tense}. Thể: {step1.answer.aspect}. Dạng: {step1.answer.voice}.
          </p>
        )}
      </div>

      <p className="sentence-box">{item.prompt_vi}</p>

      <div className="warning-callout">
        <span className="warning-glyph" aria-hidden="true">!</span>
        <span>{step2.prompt_vi}</span>
      </div>

      <div className="answer-line building">
        {placed2.length === 0 ? (
          <span className="answer-line-empty">Bấm một từ ở dưới để đặt vào đây</span>
        ) : step2Status === 'building' ? (
          placed2.map((c) => (
            <button key={c.id} type="button" className={chip2Class(c)} onClick={() => unplace2(c.id)}>
              {c.text}
              <span className={`chip-return${bothDecoysPlaced && decoyIds.includes(c.id) ? ' suspect' : ''}`}>
                ↩
              </span>
            </button>
          ))
        ) : (
          placed2.map((c) => (
            <span key={c.id} className={chip2Class(c)}>
              {c.text}
            </span>
          ))
        )}
      </div>

      {bothDecoysPlaced && step2Status === 'building' && (
        <div className="warning-callout">
          <span className="warning-glyph" aria-hidden="true">!</span>
          <span>
            Trong dòng đang có cả hai từ thừa: <strong>{duplicateWords[0]}</strong> và{' '}
            <strong>{duplicateWords[1]}</strong>. Bấm một trong hai để trả về bể.
          </span>
        </div>
      )}

      {step2Status === 'building' && (
        <div className="chip-pool">
          <span className="chip-pool-label">Bể từ · còn {pool2.length}</span>
          <div className="chip-pool-row">
            {pool2.map((c) => (
              <button key={c.id} type="button" className="order-chip" onClick={() => place2(c.id)}>
                {c.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {step2Status === 'building' && (
        <button type="button" className="btn-primary" disabled={!step2Ready} onClick={checkStep2}>
          Kiểm tra
        </button>
      )}

      {step2Status === 'building' && (
        <p className="hint">
          {bothDecoysPlaced
            ? 'Nút Kiểm tra vẫn đóng cho tới khi chỉ còn một trợ động từ và một dạng của động từ chính.'
            : 'Bấm hết các từ đúng vào dòng để mở nút Kiểm tra. Hai từ thừa sẽ còn lại trong bể.'}
        </p>
      )}

      {step2Status !== 'building' && (
        <PracticeFeedback
          status={step2Status}
          quote={built2}
          explanation={item.rule_vi}
          ghiNho={step2Status === 'wrong' ? step2.answer : null}
          onNext={onNext}
          onRetry={retryStep2}
        />
      )}
    </PracticeCard>
  )
}
