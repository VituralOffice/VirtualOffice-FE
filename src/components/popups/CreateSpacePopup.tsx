import styled from 'styled-components'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { PopupProps } from '../../interfaces/Interfaces'

const PopupContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 6;
  & > div {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 8;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    & > div {
      pointer-events: auto;
      position: absolute;
      opacity: 1;
      transform: translate3d(0px, 0px, 0px);
      & > div {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 8;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        & > div {
          display: flex;
          background-color: rgb(40, 45, 78);
          flex-direction: column;
          padding: 24px;
          border-radius: 16px;
          z-index: 8;
          position: relative;
          overflow: visible;
          box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
        }
      }
    }
  }
`

const CloseIcon = styled.div`
  display: flex;
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 9;
  & > span {
    display: flex;
    width: 24px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    & > svg {
      width: 100%;
      height: auto;
    }
  }
`

const Title = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 24px;
  margin-right: 40px;
  min-width: 470px;
  & > span {
    color: rgb(255, 255, 255);
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
  }
`

const SpaceNameInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .label {
    display: flex;
    margin-bottom: 4px;
    & > label {
      & > span {
        color: rgb(255, 255, 255);
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 13px;
        line-height: 17px;
      }
    }
  }
  .input {
    width: 100%;
    border: 2px solid rgb(144, 156, 226);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    transition: border 200ms ease 0s;
    box-sizing: border-box;
    height: 48px;
    padding: 0px 8px 0px 16px;
    &:focus-within {
        border-color: rgb(236, 241, 255);
    }
    & > input {
      border: none;
      box-shadow: none;
      background: transparent;
      -webkit-box-flex: 1;
      flex-grow: 1;
      font-weight: 500;
      font-size: 15px;
      font-family: inherit;
      line-height: 20px;
      color: rgb(255, 255, 255);
      width: 100%;
      height: 100%;
      &:focus {
        outline: none;
      }
    }
  }
`

const SecurityOptionsContainer = styled.div`
display: flex;
flex-direction: column;
margin-top: 8px;
gap: 4px;
.label {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
}
.options-box {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    .container {
        -webkit-box-align: center;
        align-items: center;
        cursor: pointer;
        display: flex;
        flex-wrap: wrap;
        -webkit-box-pack: justify;
        justify-content: space-between;
        min-height: 48px;
        position: relative;
        transition: all 0.2s ease -0.1s;
        background-color: rgb(84, 92, 143);
        border-color: transparent;
        border-radius: 12px;
        border-style: solid;
        border-width: 0px;
        box-shadow: none;
        box-sizing: border-box;
        opacity: 1;
        outline: 0px !important;
        .current-option {
            -webkit-box-align: center;
            align-items: center;
            display: grid;
            flex: 1 1 0%;
            flex-wrap: wrap;
            position: relative;
            overflow: hidden;
            padding: 2px 8px;
            box-sizing: border-box;
            .text {
                grid-area: 1 / 1 / 2 / 3;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: rgb(255, 255, 255);
                margin-left: 2px;
                margin-right: 2px;
                box-sizing: border-box;
                font-size: 15px;
                font-weight: 600;
            }
        }
    }
}
`

export const CreateSpacePopup: React.FC<PopupProps> = ({ onClosePopup }) => {
  return (
    <PopupContainer>
      <div>
        <div>
          <div>
            <div>
              <CloseIcon>
                <span>
                  <CloseRoundedIcon />
                </span>
              </CloseIcon>
              <Title>
                <span>Create a new office space for your team</span>
              </Title>
              <SpaceNameInput>
                <div className="label">
                  <label>
                    <span>Space name* (Appears at the end of URL)</span>
                  </label>
                </div>
                <div className="input">
                  <input type="text" maxLength={25} placeholder="yourspacename" />
                </div>
              </SpaceNameInput>
            </div>
          </div>
        </div>
      </div>
    </PopupContainer>
  )
}
