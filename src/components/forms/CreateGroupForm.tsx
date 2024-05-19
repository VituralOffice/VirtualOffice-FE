import { FormFieldInput } from "./FormFieldInput"

export const CreateGroupForm = ({ groupName, setGroupName }) => {
    return (
        <FormFieldInput label="Group name" value={groupName} setValue={setGroupName} />
    )
}