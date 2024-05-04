import styled from "styled-components";

export const FieldInput = styled.div`
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