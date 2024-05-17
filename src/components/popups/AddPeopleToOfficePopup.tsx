import { useEffect, useRef, useState } from "react";
import { FormPopup } from "./FormPopup"
import { PopupProps } from "../../interfaces/Interfaces";
import { AddPeopleToOfficeForm } from "../forms/AddPeopleToOfficeForm";
import { useParams } from "react-router-dom";
import { InviteUserToRoom } from "../../apis/RoomApis";

export const AddPeopleToOfficePopup = ({ onClosePopup }: PopupProps) => {
    let { roomId } = useParams()
    const [email, setEmail] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const checkCanSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setCanSubmit(emailRegex.test(email));
    }

    const onSubmit = () => {
        if (roomId)
            InviteUserToRoom({ roomId, email })
        onClosePopup();
    }

    const titles = ["Add people"];
    const forms = [<AddPeopleToOfficeForm email={email} setEmail={setEmail} />]

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            checkCanSubmit();
        }, 500); // Delay 500ms

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [email]);

    return (
        <FormPopup onClose={onClosePopup} titles={titles} forms={forms} totalSteps={1} formCanBeSubmit={canSubmit} onSubmit={onSubmit} submitText='Add' />
    )
}