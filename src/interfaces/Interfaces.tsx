export interface ButtonProps {
  isEnabled?: boolean // Define active prop
  isActive?: boolean
  isDisabled?: boolean
}

export interface PopupProps {
  onClosePopup: () => void
}
