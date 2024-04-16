import styled from 'styled-components'
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import EditUserProfilePopup from './EditUserProfilePopup'
import { useState } from 'react'
import { ButtonProps } from '../../interfaces/Interfaces'
import EditUserCharacterPopup from './EditUserCharacterPopup'

const Container = styled.div`
  display: flex;
  background-color: rgb(69, 77, 123);
  flex-direction: column;
  padding: 8px;
  border-radius: 12px;
  z-index: 8;
  top: 72px;
  min-width: 188px;
  max-width: 254px;
  position: absolute;
  overflow: visible;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
  border: 1px solid rgb(32, 37, 70);
`

const NavItem = styled.button`
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
`

const UserNameText = styled.span`
  color: rgb(255, 255, 255);
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const UserEditButton = styled.button<ButtonProps>`
  width: 24px;
  height: 24px;
  border-radius: 8px;
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
  background-color: ${(props) => (props.isActive ? 'rgb(118, 125, 165)' : 'rgb(84, 92, 143)')};
  border: 2px solid transparent;
  padding: 0px;
  max-width: 100%;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;

  &:hover {
    background-color: rgb(118, 125, 165);
  }
`

export default function UserMenuPopup() {
  const [isEditUserProfilePopupShow, setEditUserProfilePopupShow] = useState(false)
  const [isEditUserCharacterPopupShow, setEditUserCharacterPopupShow] = useState(false)

  return (
    <>
      <Container>
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <UserNameText>Tú Nguyễn</UserNameText>
              <div
                style={{
                  display: 'flex',
                  marginLeft: '4px',
                }}
              ></div>
              <UserEditButton
                isActive={isEditUserProfilePopupShow}
                onClick={() => setEditUserProfilePopupShow(!isEditUserProfilePopupShow)}
              >
                <span
                  style={{
                    display: 'flex',
                    width: '20px',
                    color: 'rgb(255, 255, 255)',
                    flexShrink: '0',
                  }}
                >
                  <EditRoundedIcon style={{ width: '100%', height: 'auto' }} />
                </span>
              </UserEditButton>
            </div>
            <span
              style={{
                color: 'rgb(224, 224, 224)',
                // font-family: "DM Sans", sans-serif,
                fontWeight: '500',
                fontSize: '14px',
                lineHeight: '18px',
              }}
            >
              tunguyenhv@gmail.com
            </span>
          </div>
          <hr
            style={{
              width: '92%',
              border: '1px solid rgb(84, 92, 143)',
              margin: '4px 0px',
              alignSelf: 'center',
            }}
          ></hr>
        </>
        <NavItem onClick={() => setEditUserCharacterPopupShow(!isEditUserCharacterPopupShow)}>
          <span
            style={{
              flex: '0 1 0%',
              paddingRight: '8px',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                display: 'flex',
                width: '20px',
                color: 'rgb(255, 255, 255)',
              }}
            >
              <AccessibilityNewRoundedIcon
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </span>
          </span>
          Edit Character
        </NavItem>

        <NavItem>
          <span
            style={{
              flex: '0 1 0%',
              paddingRight: '8px',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                display: 'flex',
                width: '20px',
                color: 'rgb(255, 255, 255)',
              }}
            >
              <LoginRoundedIcon
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </span>
          </span>
          Sign In
        </NavItem>

        <NavItem>
          <span
            style={{
              flex: '0 1 0%',
              paddingRight: '8px',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                display: 'flex',
                width: '20px',
                color: 'rgb(255, 255, 255)',
              }}
            >
              <LogoutRoundedIcon
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </span>
          </span>
          Sign Out
        </NavItem>
      </Container>
      {isEditUserProfilePopupShow && (
        <EditUserProfilePopup onClosePopup={() => setEditUserProfilePopupShow(false)} />
      )}
      {isEditUserCharacterPopupShow && (
        <EditUserCharacterPopup onClosePopup={() => setEditUserCharacterPopupShow(false)} />
      )}
    </>
  )
}
