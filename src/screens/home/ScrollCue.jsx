import { ArrowDown } from '../../components/Icons.jsx'

export default function ScrollCue({ onClick }) {
  return (
    <button type="button" className="scroll-cue" aria-label="Cuộn xuống" onClick={onClick}>
      <ArrowDown />
    </button>
  )
}
