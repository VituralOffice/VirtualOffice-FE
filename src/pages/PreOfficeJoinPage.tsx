import styled from 'styled-components'
import { useAppSelector } from '../hook'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { ButtonProps } from '../interfaces/Interfaces'
import { useState } from 'react'
import { MenuPopupContainer, MenuPopupItem } from '../components/popups/DashboardUserMenuPopup'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { avatars } from '../utils/util'

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgb(51, 58, 100) 0%, rgb(17, 17, 17) 100%);
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  overflow: hidden auto;
  position: relative;
  padding: 20px;
  & > div {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
  }
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
`

const LogoButton = styled.button`
    height: 35px;
    color: rgb(255, 255, 255);
    background-color: transparent;
    border: none;
    font-family: "DM Sans", sans-serif;
    cursor: pointer;
    &>
`

const EmailButton = styled.div<ButtonProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0px;
  & > div {
    & > div {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      border-radius: 8px;
      padding: 4px;
      transition: all 0.25s ease-in-out 0s;
      overflow: hidden;
      background-color: ${(props) => (props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .email {
        color: rgb(255, 255, 255);
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 15px;
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .icon {
        display: flex;
        width: 20px;
        color: rgb(189, 189, 189);
        flex-shrink: 0;
        & > svg {
          width: 100%;
          height: auto;
        }
      }
    }
  }
`

const WelcomeTitle = styled.div`
  width: 100%;
  padding-top: 56px;
  text-align: center;
  font-size: 40px;
  font-weight: 700;
  color: rgb(255, 255, 255);
  & > span {
    color: rgb(202, 216, 255);
  }
`

const BodyContent = styled.div`
  display: grid;
  gap: 80px;
  grid-template-columns: 1fr 1fr;
  margin: auto 0px;
  width: 100%;
  padding: 12px 0px;
  & > div {
    display: flex;
  }
`

const BodyLeftContent = styled.div`
  width: 100%;
  max-width: 345px;
  margin: auto 0px auto auto;
  position: relative;
`

const BodyRightContent = styled.div`
  display: flex;
  .form-join-room {
    -webkit-box-flex: 1;
    flex-grow: 1;
    & > div {
      display: flex;
      gap: 16px;
      width: 100%;
      max-width: 300px;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      .form-body {
        display: flex;
        align-items: center;
        gap: 20px;
      }
    }
  }
`

const EditAvatarButton = styled.div`
  cursor: pointer;
  transition: all 0.25s ease-in-out 0s;
  border-radius: 8px;
  padding: 8px 8px 2px;
  .avatar-block {
    position: relative;
    .shadow {
      position: absolute;
      bottom: 3px;
      width: 50px;
      height: 20px;
      border-radius: 100%;
      background-color: rgb(84, 92, 143);
      opacity: 0.5;
    }
    & > img {
      width: 50px;
      height: 100px;
      margin: -20px 0px;
      object-fit: contain;
      object-position: 0px 0px;
      position: relative;
      z-index: 1;
      image-rendering: pixelated;
    }
  }
  .edit-button {
    text-align: center;
    margin-top: 4px;
    & > span {
      color: rgb(189, 189, 189);
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
    }
  }
`

const PlayerNameInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    & > div {
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
  }
`

const JoinButton = styled.button`
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
  width: 100%;
  min-width: min(104px, 100%);
  max-width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  color: rgb(40, 45, 78) !important;
`

const CameraDisplay = styled.div`
  position: relative;
  height: 0px;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgb(17, 17, 17);
  padding-bottom: 66%;
  border: 2px solid rgb(63, 71, 118);
  .video-display {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    & > div {
      width: 100%;
      height: 100%;
      & > video {
        transform: scale(-1, 1);
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .camera-status-text {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      & > div {
        padding: 4px 12px;
        border-radius: 16px;
        background: rgba(17, 17, 17, 0.7);
        width: 100%;
        max-width: 300px;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        color: rgb(255, 255, 255);
        text-align: center;
        margin: 0px 7px;
        white-space: pre-wrap;
      }
    }
  }
`
const CameraOptionButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  position: absolute;
  width: 100%;
  & > div {
    display: flex;
    gap: 4px;
    .button {
      display: flex;
      position: relative;
      & > span {
      }
    }
  }
`

const OptionButton = styled.div`
  display: flex;
  position: relative;
`

function EmailMenu() {
  return (
    <MenuPopupContainer style={{ bottom: '-170%', right: '0' }}>
      <MenuPopupItem>
        <span className="icon">
          <span>
            <LogoutRoundedIcon />
          </span>
        </span>
        Sign out
      </MenuPopupItem>
    </MenuPopupContainer>
  )
}

function CustomButton() {}

export function PreOfficeJoinPage({onSubmit}) {
  const user = useAppSelector((state) => state.user)
  const [menuShow, setMenuShow] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Background>
        <div>
          <TopContent>
            <LogoButton>
              <img
                src="LogoWithText.svg"
                style={{
                  width: 'auto',
                  height: '100%',
                }}
              />
            </LogoButton>
            <EmailButton isActive={menuShow}>
              <div>
                <div onClick={() => setMenuShow(!menuShow)}>
                  <span className="email">{user.email}</span>
                  <span className="icon">
                    <KeyboardArrowDownRoundedIcon />
                  </span>
                </div>
              </div>
              {menuShow && <EmailMenu />}
            </EmailButton>
          </TopContent>
          <WelcomeTitle>
            Welcome to <span>test space</span>
          </WelcomeTitle>
          <BodyContent>
            <div>
              <BodyLeftContent>
                <CameraDisplay>
                  <div className="video-display">
                    <div>
                      <video playsInline webkit-playsinline="" preload="auto" autoPlay></video>
                    </div>
                  </div>
                  <div className="camera-status-text">
                    <div>
                      <div>Your camera is off</div>
                    </div>
                  </div>
                </CameraDisplay>
              </BodyLeftContent>
            </div>
            <div>
              <BodyRightContent>
                <form action="" className="form-join-room">
                  <div>
                    <div className="form-body">
                      <EditAvatarButton>
                        <div className="avatar-block">
                          <div className="shadow"></div>
                          <img src={avatars[0].img} alt="" />
                        </div>
                        <div className="edit-button">
                          <span>Edit</span>
                        </div>
                      </EditAvatarButton>
                      <PlayerNameInput>
                        <div>
                          <div>
                            <input type="text" maxLength={50} placeholder="What's your name?" />
                          </div>
                        </div>
                      </PlayerNameInput>
                    </div>
                    <JoinButton>Join</JoinButton>
                  </div>
                </form>
              </BodyRightContent>
            </div>
          </BodyContent>
        </div>
      </Background>
    </div>
  )
}
