import { FormPopup } from './FormPopup'
import { YesNoForm } from '../forms/YesNoForm'

export const YesNoPopup = ({ onClosePopup, onSubmit }) => {
  const titles = ['Warning']
  const forms = [
    <YesNoForm
      question={
        'You are the admin meeting. If you leave the meeting will end. Do you want to continue?'
      }
    />,
  ]

  return (
    <FormPopup
      onClose={onClosePopup}
      titles={titles}
      forms={forms}
      totalSteps={1}
      formCanBeSubmit={true}
      onSubmit={onSubmit}
      submitText="Leave"
    />
  )
}
