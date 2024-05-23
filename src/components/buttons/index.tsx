import styled from "styled-components";
import { ButtonProps } from "../../interfaces/Interfaces";

export const ToolbarButton = styled.button<ButtonProps>`
  height: 40px;
  padding: 8px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.isEnabled ? '' : 'transparent')};
  ${(props) =>
    props.isEnabled
      ? 'background-color: rgb(84, 92, 143);'
      : `
  background-color: transparent;
  &:hover {background-color: rgb(51, 58, 100)};
    `}
  transition: background-color 200ms ease 0s;
  cursor: pointer;
  position: relative;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    & > span {
      display: flex;
      width: 24px;
      color: rgb(224, 224, 224);
      flex-shrink: 0;
      & > svg {
        width: 100%;
        height: auto;
      }
    }
  }
`

export const ToolbarExitButton = styled(ToolbarButton)`
  background-color: ${(props) => (props.isActive ? 'rgb(221, 41, 63)' : 'rgb(51, 58, 100)')};
  &:hover {
    background-color: rgb(221, 41, 63);
  }
`