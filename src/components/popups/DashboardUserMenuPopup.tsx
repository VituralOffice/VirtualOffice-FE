import styled from 'styled-components'

export const MenuPopupContainer = styled.div`
  display: flex;
  background-color: rgb(69, 77, 123);
  flex-direction: column;
  padding: 8px;
  border-radius: 12px;
  z-index: 8;
  bottom: 80%;
  right: 5%;
  min-width: 188px;
  max-width: 254px;
  position: absolute;
  overflow: visible;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
  border: 1px solid rgb(32, 37, 70);
`

export const MenuPopupItem = styled.button`
  display: flex;
  position: relative;
  box-sizing: border-box;
  outline: none;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: left;
  font-family: inherit;
  font-weight: 700;
  transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
  cursor: pointer;
  opacity: 1;
  overflow: hidden;
  background-color: transparent;
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  min-width: min(104px, 100%);
  max-width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;

  &:hover {
    background: rgb(88, 130, 247);
  }

  .icon {
    flex: 0 1 0%;
    paddingRight: 8px;
    textDecoration: none;
    &>span{
      display: flex;
      width: 20px;
      color: rgb(255, 255, 255);
      &>svg{
        width: 100%;
        height: auto;
      }
    }
  }
`

export default function DashboardUserMenuPopup() {
  return (
    <MenuPopupContainer>
      <MenuPopupItem>Home</MenuPopupItem>

      {/* <MenuPopupItem>Terms of Service</MenuPopupItem> */}

      <MenuPopupItem>Sign Out</MenuPopupItem>
    </MenuPopupContainer>
  )
}
