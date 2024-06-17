import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hook'
import MultipleValueInputWithSuggestion from '../inputs/MultipleValueInputWithSuggestion'
import { FormFieldInput } from './FormFieldInput'
import { FormSelection } from './types'
import { OptionBox } from './OptionBox'
import { SecurityOptionsContainer } from './utils'

export const CreateChatForm = ({
  chatName,
  setChatName,
  selectedMembers,
  setSelectedMembers,
  selectedChatType,
  setSelectedChatType,
  chatTypes,
}) => {
  const room = useAppSelector((state) => state.room)
  const user = useAppSelector((state) => state.user)
  const [suggestions, setSuggestions] = useState<FormSelection[]>([])
  useEffect(() => {
    setSuggestions(
      room.roomData.members
        .filter((m) => m.user._id !== user.userId)
        .map((m) => {
          return { text: m.user.fullname, id: m.user._id }
        })
    )
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {selectedChatType != 0 && (
        <FormFieldInput
          label="Chat name"
          placeHolder="Chat name"
          value={chatName}
          setValue={setChatName}
        />
      )}
      <SecurityOptionsContainer className="form-session">
        <span className="label">Security options</span>
        <OptionBox
          items={chatTypes}
          onSelect={(index: number) => {
            setSelectedChatType(index)
            setSelectedMembers([])
          }}
        />
      </SecurityOptionsContainer>
      {selectedChatType != 2 && (
        <MultipleValueInputWithSuggestion
          label="Add member"
          placeHolder="Member name"
          multiple={selectedChatType == 0 ? false : selectedChatType == 1 ? true : false}
          suggestions={suggestions}
          selections={selectedMembers}
          onSelectionsChange={setSelectedMembers}
        />
      )}
    </div>
  )
}
