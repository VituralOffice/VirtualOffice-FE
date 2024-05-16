import { FieldInput } from "./utils"

export const AddPeopleToOfficeForm = ({ email, setEmail }) => {
    return (
        <FieldInput className='form-session'>
            <div className="label">
                <label>
                    <span>Enter email</span>
                </label>
            </div>
            <div className="input">
                <input type="text" maxLength={25} placeholder="yourspacename" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
        </FieldInput>
    )
}