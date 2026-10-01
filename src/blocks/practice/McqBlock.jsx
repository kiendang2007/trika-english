import ChoiceBlock from './ChoiceBlock.jsx'
import { QuotedBold } from '../../components/RichText.jsx'

export default function McqBlock({ item, onNext }) {
  return (
    <ChoiceBlock
      label="Trắc nghiệm"
      prompt={<QuotedBold text={item.prompt_vi} />}
      options={item.options}
      answerKey={item.answer}
      ruleVi={item.rule_vi}
      onNext={onNext}
    />
  )
}
