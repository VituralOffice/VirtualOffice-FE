import styled from "styled-components"
import { ButtonProps } from "../../interfaces/Interfaces"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { ReactElement, useRef, useState } from "react"
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export const PopupContainer = styled.div`
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

export const FormCloseIcon = styled.div`
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

export const FormTitle = styled.div`
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

export const FormSubmitButtonsContainer = styled.div`
display: flex;
    justify-content: space-between;
    margin-top: 24px;
`

export const FormBackButton = styled.button`
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

export const FormSubmitButton = styled.button<ButtonProps>`
    margin-left: auto;
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
    cursor: ${(props) => props.isActive ? 'pointer' : 'default'};
    opacity: 0.5;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    opacity: ${(props) => props.isActive ? '1' : '0.5'};
    border: 2px solid transparent;
    padding: 0px 16px;
    width: auto;
    min-width: min(104px, 100%);
    max-width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;

    ${(props) => props.isActive && `&:hover {
        background-color: rgb(81, 226, 189);
    }`}
    

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

interface Props {
    onClose: () => void;
    titles: Array<string>;
    forms: Array<ReactElement>;
    totalSteps: number;
    formCanBeSubmit: boolean;
    onSubmit: any;
    submitText?: string;
}

export const FormPopup = ({onClose, titles, forms, totalSteps, formCanBeSubmit, onSubmit, submitText}: Props) => {
    const [stepIndex, setStepIndex] = useState(0);
    const lastSubmitTimeRef = useRef<number>(0);

    const handleSubmit = () => {
      const now = Date.now();
      if (now - lastSubmitTimeRef.current >= 1000) { // 1000 milliseconds = 1 second
        lastSubmitTimeRef.current = now;
        onSubmit();
      }
    };
    return(
        <PopupContainer>
            <div>
                <div>
                    <div>
                        <div>
                            <FormCloseIcon>
                                <span>
                                    <CloseRoundedIcon onClick={onClose} />
                                </span>
                            </FormCloseIcon>
                            <FormTitle>
                                <span>{titles[stepIndex]}</span>
                            </FormTitle>

                            {
                                forms[stepIndex]
                            }

                            {/* {securitySelectedOption == 1 &&
                                <>
                                    <InviteInput onAdd={addInvitedUser} />
                                    <UserList users={invitedUsers} onRemove={removeInvitedUser} />
                                </>
                            } */}

                            <FormSubmitButtonsContainer>
                                {
                                    stepIndex > 0 && (
                                        <div style={{ display: 'flex', marginRight: '8px' }}><FormBackButton onClick={() => setStepIndex(stepIndex - 1)}>Back</FormBackButton></div>
                                    )
                                }
                                {
                                    stepIndex == totalSteps - 1 ? (
                                        <FormSubmitButton isActive={formCanBeSubmit} onClick={handleSubmit}>
                                            <span className='icon'>
                                                <span><CheckCircleRoundedIcon /></span>
                                            </span>
                                            {submitText ? submitText : "Submit"}
                                        </FormSubmitButton>
                                    ) : (
                                        <FormSubmitButton isActive={true} onClick={() => setStepIndex(stepIndex + 1)}>
                                            Next
                                        </FormSubmitButton>
                                    )
                                }
                            </FormSubmitButtonsContainer>

                        </div>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}