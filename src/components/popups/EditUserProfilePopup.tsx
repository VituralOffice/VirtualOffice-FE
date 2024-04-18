import styled from 'styled-components'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { PopupProps } from '../../interfaces/Interfaces'
import { useAppSelector } from '../../hook'

const Layout = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
`

const PopupContainer = styled.div`
  display: flex;
  background-color: rgb(32, 37, 64);
  flex-direction: column;
  padding: 32px;
  border-radius: 16px;
  z-index: 8;
  position: relative;
  overflow: visible;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
`

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const IconCloseContainer = styled.div`
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

const UpperContentContainer = styled.div`
  border-radius: 16px 16px 0px 0px;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgb(51, 58, 100);
  display: flex;
  height: 30vh;
  position: relative;
  min-height: 200px;
  max-height: 240px;
  margin: -32px -32px 0px;

  & > img {
    width: 85px;
    height: 130px;
    object-fit: cover;
    object-position: 0px 0px;
    position: absolute;
    bottom: 40px;
    z-index: 1;
    image-rendering: pixelated;
  }
`

const UsernameTopDisplay = styled.div`
  display: flex;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;

  & > span {
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
  }
`
const LowerContentContainer = styled.div`
  display: flex;
  padding-top: 20px;
  width: 372px;
  flex-direction: column;

  & > div {
    display: flex;
    flex-direction: column;
  }
`

const UserShadow = styled.div`
  position: absolute;
  width: 79px;
  height: 63px;
  background: rgba(17, 17, 17, 0.2);
  bottom: 17px;
  border-radius: 50%;
`

const UserInputBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & > div {
    width: 100%;
    border: 2px solid rgb(144, 156, 226);
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    transition: border 200ms ease 0s;
    box-sizing: border-box;
    height: 40px;
    padding: 0px 8px 0px 16px;
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

const ButtonBack = styled.div`
  display: flex;
  & > button {
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
  }
`

const ButtonFinish = styled.div`
  display: flex;
  width: 170px;
  & > button {
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
  }
`

const EditUserProfilePopup: React.FC<PopupProps> = ({ onClosePopup }) => {
  const user = useAppSelector((state) => state.user);

  return (
    <Layout>
      <PopupContainer>
        <IconCloseContainer onClick={onClosePopup}>
          <span>
            <CloseRoundedIcon />
          </span>
        </IconCloseContainer>
        <PopupContent>
          <UpperContentContainer>
            <img src="assets/login/Adam_login.png" />
            <UserShadow />
          </UpperContentContainer>
          <UsernameTopDisplay>
            <span>{user.username}</span>
          </UsernameTopDisplay>
          <LowerContentContainer>
            <div
              style={{
                display: 'flex',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  color: 'rgb(255, 255, 255)',
                  fontWeight: '700',
                  fontSize: '18px',
                  lineHeight: '24px',
                }}
              >
                What's your name?
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  color: 'rgb(202, 216, 255)',
                  fontWeight: '500',
                  fontSize: '14px',
                  lineHeight: '18px',
                }}
              >
                Your name shows above your character. You’ll be able to change it anytime.
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '4px',
              }}
            >
              <UserInputBar>
                <div>
                  <input type="text" maxLength={50} placeholder="Enter your name"></input>
                </div>
              </UserInputBar>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexDirection: 'row',
              }}
            >
              <ButtonBack>
                <button onClick={onClosePopup}>Back</button>
              </ButtonBack>
              <ButtonFinish>
                <button onClick={onClosePopup}>Finish</button>
              </ButtonFinish>
            </div>
          </LowerContentContainer>
        </PopupContent>
      </PopupContainer>
    </Layout>
  )
}

export default EditUserProfilePopup
