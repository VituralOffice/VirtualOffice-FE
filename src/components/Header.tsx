import styled from 'styled-components'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import UserMenuPopup from './popups/UserMenuPopup'
import { useState } from 'react'
import { ButtonProps } from '../interfaces/Interfaces'
import EditUserProfilePopup from './popups/EditUserProfilePopup'
import { useNavigate } from 'react-router-dom'

const HeaderContainer = styled.div`
  display: flex;
  background-color: rgb(51, 58, 100);
  padding: 16px 24px 16px 40px;
  justify-content: space-between;
  align-items: center;
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin: 0 12px; /* Set margin based on prop */
  }

  > *:first-child {
    margin-left: 0;
  }

  > *:last-child {
    margin-right: 0;
  }
`

const RightContent = styled(LeftContent)``

const LogoContainer = styled.div`
  background-color: rgb(67, 88, 216);
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: none;
  padding: 0px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logo = styled.img`
  height: 40px;
  aspect-ratio: auto 40 / 40;
  width: 40px;
`

const Item = styled.div`
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
  background-color: transparent;
  &:hover {
    background-color: rgb(84, 92, 143);
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

  > * {
    margin: 0 6px; /* Set margin based on prop */
  }

  > *:first-child {
    margin-left: 0;
  }

  > *:last-child {
    margin-right: 0;
  }
`

const ButtonItem = styled(Item) <ButtonProps>`
  /* Preserve button type and props */
  as='button';

  background-color: ${(props) => (props.isActive ? 'rgb(84, 92, 143)' : 'transparent')};
`

const ButtonItemPrimary = styled.button`
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
  background-color: rgb(88, 130, 247);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  min-width: min(85px, 100%);
  max-width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
  color: rgb(255, 255, 255) !important;

  > * {
    margin: 0 6px; /* Set margin based on prop */
  }

  > *:first-child {
    margin-left: 0;
  }

  > *:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: rgb(121, 155, 249);
  }
`

const ButtonItemSecondary = styled.button`
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
  background-color: rgb(6, 214, 160);
  border: 2px solid transparent;
  padding: 0px 16px;
  width: auto;
  min-width: min(104px, 100%);
  max-width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 15px;
  color: rgb(40, 45, 78) !important;

  > * {
    margin: 0 3px; /* Set margin based on prop */
  }

  > *:first-child {
    margin-left: 0;
  }

  > *:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: rgb(81, 226, 189);
  }
`

const AvatarContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  user-select: none;
  flex-shrink: 0;
`

const AvatarBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: rgb(34, 34, 34);
`

const AvatarImg = styled.img`
  object-position: 0px -2px;
  object-fit: contain;
  object-position: 0px 8px;
  width: 100%;
  height: 150%;
  transform: scale(0.75);
  image-rendering: pixelated;
  position: relative;
  top: -10px;
`

const Text = styled.span`
  white-space: nowrap;
`

// const Icon = styled.div`
//     color: white;
//     font-size: 20px;
// `

export default function Header() {
  const [isUserMenuShow, setUserMenuShow] = useState(false);
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <LeftContent>
        <LogoContainer>
          <Logo src="../public/logo_transparent.svg" />
        </LogoContainer>
        <Item>
          <AutoAwesomeIcon /> <Text>My Spaces</Text>
        </Item>
      </LeftContent>
      <RightContent>
        <div>
          <ButtonItem isActive={isUserMenuShow} onClick={() => setUserMenuShow(!isUserMenuShow)}>
            <AvatarContainer>
              <AvatarBackground>
                <AvatarImg src="src/images/login/Adam_login.png" />
              </AvatarBackground>
            </AvatarContainer>
            <Text>Tú Nguyễn</Text>
          </ButtonItem>
          {isUserMenuShow && <UserMenuPopup />}
        </div>
        <ButtonItemPrimary onClick={() => navigate('/signin')}>
          <Text>Sign In</Text>
        </ButtonItemPrimary>
        <ButtonItemSecondary>
          <AddCircleRoundedIcon style={{ width: '20px' }} />
          <Text>Create Space</Text>
        </ButtonItemSecondary>
      </RightContent>
    </HeaderContainer>
  )
}
