import styled from 'styled-components'
import GoogleLoginButton from '../components/buttons/GoogleLoginButton'
import { useEffect, useRef, useState } from 'react'
import { LoginByEmail, VerifyOtpLogin } from '../apis/AuthApis'
import { useNavigate } from 'react-router-dom'
import { isApiSuccess } from '../apis/util'
import { setLoggedIn, setUserInfo } from '../stores/UserStore'
import { useAppDispatch } from '../hook'
import CircularIndeterminate from '../components/loadings/LoadingIcon'
import React from 'react'
import { spinAnimation } from '../anims/CssAnims'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { API_URL } from '../constant'
import LoadingPage from './LoadingPage'

const Container = styled.div`
  height: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-image: url(/assets/background/Summer2.png);
  background-repeat: repeat-x;
  background-size: cover;
  image-rendering: pixelated;
`

const ContentWindow = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  width: 500px;
  border-radius: 32px;
  padding: 56px;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
  & > div {
    display: flex;
    flex-direction: column;
  }
`

const HeaderDecorationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-left: 56px;
  padding-right: 56px;
  & > image {
    height: 64px;
    image-rendering: pixelated;
  }
`

const HeaderTitle = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  & > span {
    color: rgb(40, 45, 78);
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
    text-align: center;
    width: 100%;
  }
`

const ORSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 8px;
  & > span {
    color: rgb(113, 113, 113);
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-align: center;
    padding: 0px 16px;
  }
`

const EmailLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  & > label {
    border: 0;
    font: inherit;
    margin: 0;
    padding: 0;
    vertical-align: initial;
    & > span {
      color: rgb(84, 92, 143);
      font-weight: 500;
      font-size: 13px;
      line-height: 17px;
    }
  }
  .error-txt {
    color: rgb(215, 7, 7);
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
  }
`

const EmailInput = styled.div`
  width: 100%;
  border: 2px solid rgb(151, 151, 151);
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  transition: border 200ms ease 0s;
  box-sizing: border-box;
  height: 48px;
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
    color: rgb(17, 17, 17);
    width: 100%;
    height: 100%;
    &:focus {
      outline: none;
    }
  }
`

const ButtonGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
`

const ButtonSignIn = styled.button`
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

  &:hover {
    background-color: rgb(81, 226, 189);
  }
`

const HeaderDescription = styled.div`
  text-align: center;
  color: rgb(40, 45, 78);
  font-weight: 500;
`

const OtpContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 20px;
`

const OtpInput = styled.input`
  width: 52px;
  height: 64px;
  border: 3px solid rgb(224, 224, 224);
  border-radius: 16px;
  background-color: transparent;
  font-size: 24px;
  font-weight: 500;
  font-family: inherit;
  text-align: center;
  color: rgb(51, 58, 100);

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus,
  &:active,
  &:focus-within {
    border-color: rgb(113, 113, 113) !important;
    outline: none;
  }
`

const OtpLoading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  .icon-loading {
    display: flex;
    animation: 1.5s linear 0s infinite normal none running ${spinAnimation};
    & > span {
      display: flex;
      width: 16px;
      color: rgb(113, 113, 113);
      flex-shrink: 0;
      & > svg {
        width: 100%;
        height: auto;
      }
    }
  }

  .loading-text {
    color: rgb(113, 113, 113);
    font-weight: 500;
    font-size: 13px;
    margin: 0px 8px;
    text-align: center;
  }
`

const NavButtonsContainer = styled.div`
  display: flex;
  margin-top: 16px;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
`

const CancelNav = styled.span`
  color: rgb(17, 17, 17);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  text-align: center;
  width: 100%;
  & > a {
    color: rgb(113, 113, 113);
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`

function LoginPage() {
  const [email, setEmail] = useState('')
  const [loadingShow, setLoadingShow] = useState<boolean>(false)
  const [otpShow, setOtpShow] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [otpShow])

  const isEmailValid = (email) => {
    // Biểu thức chính quy để kiểm tra tính hợp lệ của email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  const handleSubmitLoginByEmail = async (event) => {
    event.preventDefault()
    setError('')
    if (isEmailValid(email)) {
      // Gửi yêu cầu API khi địa chỉ email hợp lệ
      setLoadingShow(true)
      try {
        const response = await LoginByEmail(email)
        setLoadingShow(false)
        if (isApiSuccess(response)) {
          setOtpShow(true)
        }
      } catch (error) {
        console.error('Error occurred during API call:', error)
        setLoadingShow(false)
        setError('An error occurred during the login process. Please try again later.')
      }
    } else {
      // Xử lý khi địa chỉ email không hợp lệ
      console.error('Invalid email address')
      setError('Invalid email address')
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([...Array(6)].map(() => null))

  const handleOtpInputChange = (index) => {
    if (otpInputRefs.current[index]!.value !== '') {
      otpInputRefs.current[index]!.value = otpInputRefs.current[index]!.value.slice(-1)
      if (index < 5) {
        if (
          otpInputRefs.current[index] &&
          otpInputRefs.current[index]!.nextSibling instanceof HTMLInputElement
        ) {
          otpInputRefs.current[index + 1]!.focus()
        }
      }
    }

    checkOtpInputs()
  }

  const handleInputKeydown = (index, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (otpInputRefs.current[index]!.value !== '') {
        otpInputRefs.current[index]!.value = ''
      }
      if (index > 0) {
        otpInputRefs.current[index - 1]!.focus()
      }
      event.preventDefault()
    }
  }

  const handlePasteOtp = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const clipboardData = event.clipboardData.getData('text')
    const otpSlice = clipboardData.slice(0, 6).split('') // Slice chuỗi từ index 0 đến 6
    if (!/^[0-9]$/.test(otpSlice[0])) return
    let index = 0
    otpInputRefs.current.forEach((input, idx) => {
      if (input!.value.length == 0 && otpSlice) {
        input!.value = otpSlice[index]
        if (idx < 5) {
          otpInputRefs.current[idx + 1]!.focus()
        }
        index++
      }
    })
    checkOtpInputs()
  }
  const validateOtp = (evt: any) => {
    let theEvent = evt || window.event
    let key = theEvent.keyCode || theEvent.which
    key = String.fromCharCode(key)
    const regex = /[0-9]|\./
    if (!regex.test(key)) {
      theEvent.returnValue = false
      if (theEvent.preventDefault) theEvent.preventDefault()
    }
  }
  const checkOtpInputs = () => {
    let otp = ''
    for (let i = 0; i < otpInputRefs.current.length; i++) {
      otp += otpInputRefs.current[i]!.value
    }
    if (otp.length == 6) handleSendOtpApi(otp)
  }

  const handleSendOtpApi = async (otp: string) => {
    setError('')
    if (isEmailValid(email)) {
      setLoadingShow(true)
      try {
        const response = await VerifyOtpLogin(email, otp)
        setLoadingShow(false)
        if (isApiSuccess(response)) {
          dispatch(setUserInfo(response.result.user))
          dispatch(setLoggedIn(true))
          navigate('/')
        } else setError('That code is invalid or has expired, please try again.1')
      } catch (error) {
        setLoadingShow(false)
        console.log(error)
        setError('That code is invalid or has expired, please try again.')
      }
    } else {
      // Xử lý khi địa chỉ email không hợp lệ
      console.error('Invalid Email')
      setError('Invalid Email')
    }
  }

  return (
    <div style={{ overflowY: 'hidden', height: '100%', width: '100$' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
        <Container>
          <ContentWindow>
            {!otpShow ? (
              <div>
                <HeaderDecorationContainer>
                  <img src="/assets/login/Adam_login.png"></img>
                  <img src="/assets/login/Ash_login.png"></img>
                  <img src="/assets/login/Lucy_login.png"></img>
                  <img src="/assets/login/Nancy_login.png"></img>
                </HeaderDecorationContainer>
                <HeaderTitle>
                  <span>Welcome to Virtual Office</span>
                </HeaderTitle>

                <GoogleLoginButton
                  onClick={(ev) => {
                    ev.preventDefault()
                    window.open(API_URL + '/v1/auth/google', '_self')
                  }}
                />

                <ORSpan>
                  <span>OR</span>
                </ORSpan>

                <form onSubmit={handleSubmitLoginByEmail}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <EmailLabel>
                      <label>
                        <span>Email</span>
                      </label>
                      {error && <span className="error-txt">{error}</span>}
                    </EmailLabel>
                    <EmailInput>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="email"
                        onChange={handleEmailChange}
                      />
                    </EmailInput>
                  </div>

                  <ButtonGroupContainer>
                    <ButtonSignIn>
                      {loadingShow ? (
                        <CircularIndeterminate size={30} color="inherit" />
                      ) : (
                        'Sign in with email'
                      )}
                    </ButtonSignIn>
                  </ButtonGroupContainer>
                </form>
              </div>
            ) : (
              <div>
                <HeaderDecorationContainer>
                  <img src="/assets/login/Adam_login.png"></img>
                  <img src="/assets/login/Ash_login.png"></img>
                  <img src="/assets/login/Lucy_login.png"></img>
                  <img src="/assets/login/Nancy_login.png"></img>
                </HeaderDecorationContainer>
                <HeaderTitle>
                  <span>Enter your code</span>
                </HeaderTitle>
                <HeaderDescription>
                  We just emailed {email} with a 6-digit code. If you don't see it, please check
                  your spam folder or
                  <a style={{ color: 'rgb(0, 0, 0', textDecoration: 'none', cursor: 'pointer' }}>
                    resend code
                  </a>
                  .
                </HeaderDescription>
                <OtpContainer>
                  {[...Array(6)].map((_, index) => (
                    <OtpInput
                      onKeyPress={validateOtp}
                      key={index}
                      type="text"
                      autoFocus={index === 0} // Focus vào input đầu tiên khi mới vào trang
                      inputMode="numeric"
                      pattern="[0-9]"
                      min="0"
                      max="9"
                      maxLength={1} // Chỉ cho phép nhập một ký tự
                      onChange={() => handleOtpInputChange(index)}
                      onKeyDown={(event) => handleInputKeydown(index, event)}
                      onPaste={handlePasteOtp}
                      ref={(ref) => (otpInputRefs.current[index] = ref)}
                    />
                  ))}
                </OtpContainer>

                {error && (
                  <p
                    style={{
                      color: 'rgb(221, 41, 63)',
                      fontWeight: '500',
                      fontSize: '13px',
                      margin: '0px',
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </p>
                )}

                {loadingShow && (
                  <OtpLoading>
                    <div className="icon-loading">
                      <span>
                        <AutorenewRoundedIcon />
                      </span>
                    </div>
                    <p className="loading-text">Checking code</p>
                  </OtpLoading>
                )}

                <NavButtonsContainer>
                  <CancelNav onClick={() => setOtpShow(false)}>
                    <a>Cancel</a>
                  </CancelNav>
                </NavButtonsContainer>
              </div>
            )}
          </ContentWindow>
        </Container>
      </div>
    </div>
  )
}

export default LoadingPage(LoginPage)
