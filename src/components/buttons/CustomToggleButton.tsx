import styled from "styled-components"
import { ButtonProps } from "../../interfaces/Interfaces"

const OptionButton = styled.div<ButtonProps>`
  display: flex;
  position: relative;
  .button-icon {
    height: 40px;
    width: 50px;
    padding: 8px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border: none;
    border-radius: 20px;
    background-color: ${(props) =>
      props.isEnabled ? 'rgba(6, 214, 160, 0.2)' : 'rgba(255, 48, 73, 0.2)'};
    transition: background-color 200ms ease 0s;
    cursor: pointer;
    position: relative;
    outline: none;
    &:hover {
      background-color: ${(props) =>
        props.isEnabled ? 'rgba(6, 214, 160, 0.4)' : 'rgba(255, 48, 73, 0.4)'};
    }
    & > span {
      display: flex;
      width: 24px;
      color: ${(props) => (props.isEnabled ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)')};
      flex-shrink: 0;
      & > svg {
        width: 100%;
        height: auto;
      }
    }
  }
  .line {
    position: absolute;
    left: 34px;
    top: 10px;
    border-radius: 8px;
    width: 2px;
    height: 20px;
    background-color: ${(props) =>
      props.isEnabled ? 'rgb(6, 214, 160)' : 'rgba(255, 48, 73, 0.2)'};
  }
`

const OptionMenuToggleButton = styled.div<ButtonProps>`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  position: absolute;
  padding-left: 2px;
  left: 36px;
  width: 24px;
  height: 100%;
  border-radius: 0px 20px 20px 0px;
  transition: background-color 200ms ease 0s;
  cursor: pointer;

  & > span {
    display: flex;
    width: 16px;
    color: ${(props) => (props.isActive ? 'rgb(6, 214, 160)' : 'rgb(255, 48, 73)')};
    flex-shrink: 0;
    transform: ${(props) => (props.isEnabled ? 'rotate(180deg)' : 'rotate(0deg)')};
    & > svg {
      width: 100%;
      height: auto;
    }
  }

  background-color: ${(props) =>
    props.isActive
      ? props.isEnabled
        ? 'rgba(6, 214, 160, 0.4)'
        : 'transparent'
      : props.isEnabled
      ? 'rgba(255, 48, 73, 0.4)'
      : 'transparent'};

  &:hover {
    background-color: ${(props) =>
      props.isActive ? 'rgba(6, 214, 160, 0.4)' : 'rgba(255, 48, 73, 0.4)'};
  }
`

export function CustomToggleButton({ enabled, onToggle, OnIcon, OffIcon }) {
    const handleToggle = (e) => {
        e.stopPropagation()
        onToggle()
    }

    return (
        <>
            <OptionButton isEnabled={enabled} onClick={handleToggle}>
                <button className="button-icon">
                    <span>{enabled ? OnIcon : OffIcon}</span>
                </button>
                {/* <div className="line"></div>
          <OptionMenuToggleButton
            isActive={enabled}
            isEnabled={menuShow}
            onClick={handleToggleOpenMenu}
          >
            <span>
              <KeyboardArrowDownRoundedIcon />
            </span>
          </OptionMenuToggleButton> */}
            </OptionButton>
            {/* {menuShow && MenuPopup} */}
        </>
    )
}