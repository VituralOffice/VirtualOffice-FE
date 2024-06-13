import { FormPopup } from './FormPopup'
import { YesNoForm } from '../forms/YesNoForm'

export const YesNoPopup = ({ title, text, submitText, onClosePopup, onSubmit }) => {
  const titles = [title]
  const forms = [<YesNoForm question={text} />]

  return (
    <FormPopup
      onClose={onClosePopup}
      titles={titles}
      forms={forms}
      totalSteps={1}
      formCanBeSubmit={true}
      onSubmit={onSubmit}
      submitText={submitText}
    />
  )
}
