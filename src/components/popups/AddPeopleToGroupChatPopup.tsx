import { useState } from "react";
import { FormPopup } from "./FormPopup";
import { PopupProps } from "../../interfaces/Interfaces";
import { AddPeopleToGroupChatForm } from "../forms/AddPeopleToGroupChatForm";

export const AddPeopleToGroupChatPopup = ({ onClosePopup }: PopupProps) => {
    const [playerName, setPlayerName] = useState('');

    const titles = ["Add people"];
    const names = [
        "aaaaaaaa",
        "aaaaabbb",
        "bbbbbbbb",
        "cccccccc",
        "ccccceee",
        "dddddddd",
        "eeeeeeee",
    ]
    const forms = [<AddPeopleToGroupChatForm allNames={names} playerName={playerName} setPlayerName={setPlayerName} />]

    const onSubmit = () => {

    }

    return (
        <FormPopup onClose={onClosePopup} titles={titles} forms={forms} totalSteps={1} formCanBeSubmit={true} onSubmit={onSubmit} submitText='Add' />
    )
}