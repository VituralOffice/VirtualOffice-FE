import { useState } from "react";
import { FormPopup } from "./FormPopup";
import { CreateGroupForm } from "../forms/CreateGroupForm";
import { PopupProps } from "../../interfaces/Interfaces";

export const CreateGroupChatPopup = ({ onClosePopup }: PopupProps) => {
    const [groupName, setGroupName] = useState('');

    const titles = ["Add people"];
    const forms = [<CreateGroupForm groupName={groupName} setGroupName={setGroupName} />]

    const onSubmit = () => {

    }

    return (
        <FormPopup onClose={onClosePopup} titles={titles} forms={forms} totalSteps={1} formCanBeSubmit={true} onSubmit={onSubmit} submitText='Add' />
    )
}