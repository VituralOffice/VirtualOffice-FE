import { useState } from 'react'
import styled from 'styled-components'
import { ButtonProps } from '../../interfaces/Interfaces'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

export interface MenuItem {
  icon: any
  label: string
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative; /* Thêm dòng này để định vị dropdown */
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  & > svg {
    color: white;
  }
`

const ArrowNav = styled.span<ButtonProps>`
  display: flex;
  align-items: center;
  color: white;
  transform: ${(props) => (props.isEnabled ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s;
`

const DropdownMenu = styled.div`
  position: absolute;
  top: 120%;
  left: 0;
  background: rgb(38, 44, 77);
  border: 1px solid rgb(51, 58, 100);
  width: fit-content;
  border-radius: 10px;
  z-index: 1;
`

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  width: fit-content;
  min-width: 100%;
  border-radius: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  & > svg,
  & > span {
    color: white;
  }
`

export interface DropdownParams {
  handleSelect: any
  items: Array<MenuItem>
}

export default function MenuIconDropdown({ items, handleSelect }: DropdownParams) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectItem = (index: number) => {
    setSelectedItemIndex(index)
    setIsOpen(false)
    handleSelect(index)
  }

  return (
    <Container onClick={handleToggleDropdown}>
      <IconContainer>{items[selectedItemIndex].icon}</IconContainer>
      <ArrowNav isEnabled={isOpen}>
        <KeyboardArrowDownRoundedIcon />
      </ArrowNav>
      {isOpen && (
        <DropdownMenu>
          {items.map((item, index) => (
            <DropdownItem key={index} onClick={() => handleSelectItem(index)}>
              {item.icon}
              <span style={{ marginLeft: '8px' }}>{item.label}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Container>
  )
}
