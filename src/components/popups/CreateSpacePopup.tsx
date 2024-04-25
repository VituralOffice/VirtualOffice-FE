import styled from 'styled-components'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { ButtonProps, PopupProps } from '../../interfaces/Interfaces'
import { OptionBox } from '../forms/OptionBox'
import { useEffect, useState } from 'react'

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

          > .form-session {
            margin-top: 0px;
          }
        
          > .form-session ~ .form-session {
            margin-top: 8px;
          }
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
gap: 4px;
.label {
    color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
}
`

const PasswordInput = styled.div`
display: flex;
&>div {
    display: flex;
    flex-direction: column;
    width: 100%;
    .label{
        display: flex;
        margin-bottom: 4px;
        &>span{
            color: rgb(255, 255, 255);
            font-family: "DM Sans", sans-serif;
            font-weight: 500;
            font-size: 13px;
            line-height: 17px;
        }
    }
    .input{
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
        &>input {
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
        .show-icon {
            display: flex;
            width: 24px;
            color: rgb(255, 255, 255);
            flex-shrink: 0;
            cursor: pointer;
            &>svg{
                width: 100%;
                height: auto;
            }
        }
    }
}
`

const SubmitButtonsContainer = styled.div`
display: flex;
    justify-content: space-between;
    margin-top: 24px;
`

const BackButton = styled.button`
display: flex;
position: relative;
box-sizing: border-box;
outline: none;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: center;
justify-content: center;
font-family: inherit;
font-weight: 700;
transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
cursor: pointer;
opacity: 1;
overflow: hidden;
background-color: rgb(84, 92, 143);
border: 2px solid transparent;
padding: 0px 16px;
width: auto;
min-width: min(104px, 100%);
max-width: 100%;
height: 48px;
border-radius: 12px;
font-size: 15px;
color: rgb(255, 255, 255) !important;
`

const SubmitButton = styled.button<ButtonProps>`
display: flex;
    position: relative;
    box-sizing: border-box;
    outline: none;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
    cursor: default;
    opacity: 0.5;
    overflow: hidden;
    background-color: ${(props) => props.isActive ? 'rgb(6, 214, 160)' : 'rgb(6, 214, 160)'};
    border: 2px solid transparent;
    padding: 0px 16px;
    width: auto;
    min-width: min(104px, 100%);
    max-width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;
    .icon{
        flex: 0 1 0%;
        padding-right: 8px;
        &>span{
            display: flex;
            width: 24px;
            color: rgb(40, 45, 78);
            &>svg{
                width: 100%;
                height: auto;
            }
        }
    }
`

export const CreateSpacePopup: React.FC<PopupProps> = ({ onClosePopup }) => {
    const [spaceName, setSpaceName] = useState('');
    const [securitySelectedOption, setSecuritySelectedOption] = useState(0);
    const spaceOptions = ['Anyone with the office URL can enter', 'Everyone needs to enter password']
    const [password, setPassword] = useState('');
    const [passwordShowing, setPasswordShowing] = useState(false);

    const [formComplete, setFormComplete] = useState(false);

    const checkSpaceName = () => {
        return false;
    }

    const checkPassword = () => {
        return false;
    }

    const submitForm = () => {

    }

    useEffect(() => {
        if (checkSpaceName() && (securitySelectedOption == 0 || checkPassword())) setFormComplete(true);
        else setFormComplete(false);
    }, [spaceName, password])

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
                            <SpaceNameInput className='form-session'>
                                <div className="label">
                                    <label>
                                        <span>Space name* (Appears at the end of URL)</span>
                                    </label>
                                </div>
                                <div className="input">
                                    <input type="text" maxLength={25} placeholder="yourspacename" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} />
                                </div>
                            </SpaceNameInput>

                            <SecurityOptionsContainer className='form-session'>
                                <span className='label'>Security options</span>
                                <OptionBox items={spaceOptions} onSelect={(index) => setSecuritySelectedOption(index)} />
                            </SecurityOptionsContainer>

                            {securitySelectedOption == 1 && <PasswordInput className='form-session'>
                                <div>
                                    <div className='label'>
                                        <span>Password</span>
                                    </div>
                                    <div className='input'>
                                        <input type={passwordShowing ? "text" : "password"} autoComplete="new-password" aria-autocomplete="list" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <span className='show-icon'>
                                            {passwordShowing ? <RemoveRedEyeRoundedIcon onClick={() => setPasswordShowing(false)} /> : <VisibilityOffRoundedIcon onClick={() => setPasswordShowing(true)} />}
                                        </span>
                                    </div>
                                </div>
                            </PasswordInput>}

                            <SubmitButtonsContainer>
                                <div style={{ display: 'flex', marginRight: '8px' }}><BackButton>Back</BackButton></div>
                                <SubmitButton isActive={formComplete} onClick={submitForm}>
                                    <span className='icon'>
                                        <span><CheckCircleRoundedIcon /></span>
                                    </span>
                                    Create space
                                </SubmitButton>
                            </SubmitButtonsContainer>
                        </div>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}
