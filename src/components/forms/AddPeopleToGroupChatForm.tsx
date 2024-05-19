import { FormFieldInputWithSuggestion } from "./FormFieldInputWithSuggestion"

export const AddPeopleToGroupChatForm = ({ allNames, playerName, setPlayerName }) => {
    return (
        <FormFieldInputWithSuggestion label="Enter player name" values={allNames} value={playerName} setValue={setPlayerName} />
    )
}