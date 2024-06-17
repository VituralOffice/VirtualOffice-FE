export type FieldInputProps = {
    label: string,
    placeHolder?: string,
    value: string,
    setValue: any,
}

export type FieldInputWithSuggestionProps = {
    label: string,
    value: string,
    values: Array<string>,
    setValue: any,
}

export interface FormSelection {
    text: string
    id: string
  }