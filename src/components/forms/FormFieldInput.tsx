import { FieldInputProps } from "./types"
import { FieldInput } from "./utils"

export const FormFieldInput = ({ label, value, setValue }: FieldInputProps) => {
    return (
        <FieldInput className='form-session'>
            <div className="label">
                <label>
                    <span>{label}</span>
                </label>
            </div>
            <div className="input">
                <input type="text" maxLength={25} placeholder="playername" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        </FieldInput>
    )
}