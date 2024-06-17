import React, { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from 'react'
import './CustomInput.scss'
import { FieldInput } from '../forms/utils'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { toast } from 'react-toastify'
import { FormSelection } from '../forms/types'

interface CustomInputProps {
  label: string
  placeHolder?: string
  suggestions?: FormSelection[]
  multiple: boolean
  selections: FormSelection[]
  onSelectionsChange: (selections: FormSelection[]) => void
}

const MultipleValueInputWithSuggestion: React.FC<CustomInputProps> = ({
  label,
  placeHolder = '',
  suggestions = [],
  multiple,
  selections,
  onSelectionsChange,
}) => {
  const [inputValue, setInputValue] = useState<string>('')
  // const [selectedItems, setSelectedItems] = useState<FormSelection[]>()
  const [filteredSuggestions, setFilteredSuggestions] = useState<FormSelection[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!multiple && selections && selections.length > 0) return
    const value = e.target.value
    setInputValue(value)

    if (value) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      if (filtered.length > 0) {
        setShowSuggestions(true)
      } else setShowSuggestions(false)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: FormSelection) => {
    if (multiple) {
      if (selections && selections.findIndex((i) => i.id == suggestion.id) >= 0) {
        toast('Item added')
        setInputValue('')
        setShowSuggestions(false)
        return
      }
      const newSelections = selections ? [...selections, suggestion] : [suggestion]
      onSelectionsChange(newSelections)
      setInputValue('')
      setShowSuggestions(false)
    } else {
      if (selections && selections.length == 0) {
        const newSelections = [suggestion]
        onSelectionsChange(newSelections)
      }
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  // const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (multiple && (e.key === 'Enter' || e.key === ' ')) {
  //     e.preventDefault()
  //     if (inputValue.trim() !== '') {
  //       const newItem: FormSelection = {
  //         text: inputValue.trim(),
  //         id: Math.random().toString(36).substr(2, 9),
  //       }
  //       const newSelections = selectedItems ? [...selectedItems, newItem] : [newItem]
  //       setSelectedItems(newSelections)
  //       onSelectionsChange(newSelections)
  //     }
  //     setInputValue('')
  //     setShowSuggestions(false)
  //   }
  // }

  const removeItem = (index: number) => {
    const newItems = selections ? [...selections] : []
    newItems.splice(index, 1)
    onSelectionsChange(newItems)
  }

  return (
    <div className="custom-input-container">
      <FieldInput className="form-session">
        <div className="label">
          <label>
            <span>{label}</span>
          </label>
        </div>
        <div className="input">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeHolder}
            value={inputValue}
            onChange={handleInputChange}
            // onKeyDown={handleKeyPress}
          />
          {showSuggestions && (
            <ul className="suggestions-list">
              {filteredSuggestions.map((suggestion) => (
                <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </FieldInput>

      <div className="selected-items">
          {selections &&
            selections.map((item, index) => (
              <div key={item.id} className="selected-item">
                {item.text}
                <span className="remove-item" onClick={() => removeItem(index)}>
                  <CancelRoundedIcon />
                </span>
              </div>
            ))}
        </div>
    </div>
  )
}

export default MultipleValueInputWithSuggestion
