import { FormFieldInput } from "./FormFieldInput"

export const AddPeopleToOfficeForm = ({ email, setEmail }) => {
    return (
        <FormFieldInput label="Enter email" value={email} setValue={setEmail} />
    )
}