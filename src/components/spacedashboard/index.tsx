import styled from 'styled-components'
import { ButtonProps } from '../../interfaces/Interfaces'

export const ContentHeader = styled.div`
  padding-top: 56px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  .space-name {
    font-size: 26px;
    font-weight: 700;
    line-height: 34px;
    color: rgb(255, 255, 255);
    padding-right: 24px;
    padding-bottom: 16px;
  }
`

export const ContentBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const SectionHeader = styled.span`
  font-size: 13px;
  font-weight: 700;
  line-height: 17px;
  color: rgb(224, 224, 224);
  text-transform: uppercase;
  margin-top: 24px;
  margin-bottom: 8px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
`

export const SectionBody = styled.div`
  border-radius: 16px;
  background-color: rgb(63, 71, 118);
  display: flex;
  padding: 16px;
  flex-direction: column;
`

export const SectionMainLabel = styled.div`
  margin-bottom: 4px;
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 700;
  line-height: 21px;
`

export const SectionSubLabel = styled.div`
  color: rgb(224, 224, 224);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  margin-bottom: 8px;
`

export const SectionBodyContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const FieldInput = styled.div`
  width: 100%;
  border: 2px solid rgb(144, 156, 226);
  &:focus-within {
    border: 2px solid rgb(236, 241, 255);
  }
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  transition: border 200ms ease 0s;
  box-sizing: border-box;
  min-height: 48px;
  padding: 2px 0px 2px 8px;
  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden auto;
    max-height: 128px;
    flex-wrap: wrap;
    scrollbar-color: rgb(84, 92, 143) transparent;
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
      min-width: 230px;
      outline: none;
    }
  }
`

export const SubmitSection = styled.div`
  display: flex;
  margin-top: 8px;
  justify-content: flex-end;
  width: 100%;
`

export const SubmitButton = styled.div<ButtonProps>`
  display: flex;
  flex-shrink: 0;
  & > button {
    cursor: ${(props) => (props.isActive ? 'pointer' : 'default')};
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
    opacity: ${(props) => (props.isActive ? '1' : '0.5')};
    overflow: hidden;
    background-color: rgb(88, 130, 247);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: auto;
    min-width: min(104px, 100%);
    max-width: 100%;
    height: 40px;
    border-radius: 10px;
    font-size: 15px;
    color: rgb(255, 255, 255) !important;
    & > span {
      flex: 0 1 0%;
      padding-right: 8px;
      & > span {
        display: flex;
        width: 20px;
        color: rgb(255, 255, 255);
        flex-shrink: 0;
        & > svg {
          width: 100%;
          height: auto;
        }
      }
    }
  }
`

export const ButtonSetting = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .info {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    .main-label {
      display: flex;
      align-items: center;
      & > div {
        margin-bottom: 4px;
        color: rgb(255, 255, 255);
        font-size: 16px;
        font-weight: 700;
        line-height: 21px;
      }
    }
    .desc {
      color: rgb(224, 224, 224);
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
    }
  }
  .button {
    display: flex;
    margin-left: 8px;
  }
`

export const GeneralButton = styled.button<ButtonProps>`
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
  &:hover {
    background-color: rgb(118, 125, 165);
  }
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  min-width: min(104px, 100%);
  max-width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;
  opacity: ${(props) => props.isActive ? '1' : '0.5'};
  cursor: ${(props) => props.isActive ? 'pointer' : 'default'};
  & > span {
    flex: 0 1 0%;
    padding-right: 8px;
    & > span {
      display: flex;
      width: 20px;
      color: rgb(255, 255, 255);
      flex-shrink: 0;
      & > svg {
        width: 100%;
        height: auto;
      }
    }
  }
`
