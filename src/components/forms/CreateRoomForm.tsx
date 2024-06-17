import styled from "styled-components"
import { FieldInput, SecurityOptionsContainer } from "./utils"
import { OptionBox } from "./OptionBox"
import { useState } from "react"

const PasswordInput = styled.div`
display: flex;
&>div {
    display: flex;
    flex-direction: column;
    width: 100%;
    .label{
        display: flex;
        margin-bottom: 4px;
        &>span{
            color: rgb(255, 255, 255);
            font-family: "DM Sans", sans-serif;
            font-weight: 500;
            font-size: 13px;
            line-height: 17px;
        }
    }
    .input{
        width: 100%;
        border: 2px solid rgb(144, 156, 226);
        border-radius: 12px;
        display: flex;
        flex-direction: row;
        -webkit-box-align: center;
        align-items: center;
        transition: border 200ms ease 0s;
        box-sizing: border-box;
        height: 48px;
        padding: 0px 8px 0px 16px;
        &:focus-within {
            border-color: rgb(236, 241, 255);
        }
        &>input {
            border: none;
            box-shadow: none;
            background: transparent;
            -webkit-box-flex: 1;
            flex-grow: 1;
            font-weight: 500;
            font-size: 15px;
            font-family: inherit;
            line-height: 20px;
            color: rgb(255, 255, 255);
            width: 100%;
            height: 100%;

            &:focus {
                outline: none;
            }
        }
        .show-icon {
            display: flex;
            width: 24px;
            color: rgb(255, 255, 255);
            flex-shrink: 0;
            cursor: pointer;
            &>svg{
                width: 100%;
                height: auto;
            }
        }
    }
}
`

const UserList = ({ users, onRemove }) => {
    return (
        <ul className="user-list">
            {users.map((user, index) => (
                <li key={index}>
                    {user}
                    <button onClick={() => onRemove(index)}>X</button>
                </li>
            ))}
        </ul>
    );
};

const InviteInput = ({ onAdd }) => {
    const [email, setEmail] = useState('');

    const handleAddClick = () => {
        if (email) {
            onAdd(email);
            setEmail('');
        }
    };

    return (
        <div className="invite-input-container">
            <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
            />
            <button onClick={handleAddClick}>Add</button>
        </div>
    );
};

export const CreateRoomForm = ({ spaceName, setSpaceName, setSecuritySelectedOption, spaceOptions }) => {
    // const [invitedUsers, setInvitedUsers] = useState<string[]>([]);

    // const addInvitedUser = (email) => {
    //     setInvitedUsers([...invitedUsers, email]);
    // };

    // const removeInvitedUser = (index) => {
    //     setInvitedUsers(invitedUsers.filter((_, i) => i !== index));
    // };
    
    return (
        <>
            <FieldInput className='form-session'>
                <div className="label">
                    <label>
                        <span>Space name* (Appears at the end of URL)</span>
                    </label>
                </div>
                <div className="input">
                    <input type="text" maxLength={25} placeholder="yourspacename" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} />
                </div>
            </FieldInput>

            <SecurityOptionsContainer className='form-session'>
                <span className='label'>Security options</span>
                <OptionBox items={spaceOptions} onSelect={(index) => setSecuritySelectedOption(index)} />
            </SecurityOptionsContainer>
        </>
    )
}