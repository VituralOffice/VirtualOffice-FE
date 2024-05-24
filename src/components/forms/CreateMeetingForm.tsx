import { FormFieldInput } from "./FormFieldInput"

export const CreateMeetingForm = ({ title, setTitle }) => {
    return (
        <FormFieldInput label="Enter meeting title" value={title} setValue={setTitle} />
    )
}