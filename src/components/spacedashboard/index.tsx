import styled from "styled-components";

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
  padding-bottom: 32px;
  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 16px;
  }
`