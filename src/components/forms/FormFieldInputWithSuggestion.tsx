import { useState } from "react";
import { FieldInputWithSuggestionProps } from "./types"
import { FieldInput } from "./utils"
import styled from "styled-components";

const Dropdown = styled.ul`
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
    position: absolute;
    background: white;
    width: calc(100% - 20px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1;
    &>li {
        padding: 8px 12px;
        cursor: pointer;
    }
    &>li:hover {
        background-color: #f0f0f0;
    }
`

export const FormFieldInputWithSuggestion = ({ label, value, values, setValue }: FieldInputWithSuggestionProps) => {
    const [filteredNames, setFilteredNames] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const input = e.target.value;
        setValue(input);
        if (input) {
            const matches = values.filter(name => name.toLowerCase().includes(input.toLowerCase()));
            setFilteredNames(matches);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleNameClick = (name) => {
        setValue(name);
        setShowDropdown(false);
    };
    return (
        <FieldInput className='form-session'>
            <div className="label">
                <label>
                    <span>{label}</span>
                </label>
            </div>
            <div className="input">
                <input type="text" maxLength={25} placeholder="playername" value={value} onChange={handleInputChange} />
                {showDropdown && (
                    <Dropdown>
                        {filteredNames.map((name, index) => (
                            <li key={index} onClick={() => handleNameClick(name)}>
                                {name}
                            </li>
                        ))}
                    </Dropdown>
                )}
            </div>
        </FieldInput>
    )
}