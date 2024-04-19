import styled from 'styled-components'
import GoogleLoginButton from '../components/GoogleLoginButton'
import { useContext, useEffect, useRef, useState } from 'react'
import { LoginByEmail } from '../apis/AuthApis'
import { useNavigate } from 'react-router-dom'
import { isApiSuccess } from '../apis/util'
import { setLoggedIn, setUserInfo } from '../stores/UserStore'
import { useAppDispatch } from '../hook'
import CircularIndeterminate, {
  FacebookCircularProgress,
  GradientCircularProgress,
} from '../components/loadings/LoadingIcon'

const Container = styled.div`
  height: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-image: url(assets/background/Summer2.png);
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

const OtpInputComponent = ({ key, autoFocus, onChange, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Sử dụng useState để lưu trữ giá trị của input
  const [value, setValue] = useState('')

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Xử lý sự kiện khi giá trị của input thay đổi
  const handleChange = (event) => {
    let newValue = event.target.value

    if (value !== '' && newValue) {
      if (inputRef.current && inputRef.current.nextSibling instanceof HTMLInputElement) {
        inputRef.current.nextSibling.value = value
      }
      newValue = newValue[0]
    }

    if (newValue && inputRef.current && inputRef.current.nextSibling instanceof HTMLInputElement) {
      inputRef.current.nextSibling.focus()
    }

    setValue(newValue)
    onChange(newValue)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      if (value === '') {
        event.preventDefault() // Ngăn chặn hành động mặc định của phím backspace
        if (inputRef.current && inputRef.current.previousSibling instanceof HTMLInputElement) {
          const prevInput = inputRef.current.previousSibling as HTMLInputElement
          prevInput.focus() // Focus vào input trước đó
          prevInput.value = '' // Xóa giá trị của input trước đó
        }
      }
    }
  }

  return (
    <OtpInput
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      min="0"
      max="9"
      ref={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loadingShow, setLoadingShow] = useState<boolean>(false)
  const [otpShow, setOtpShow] = useState(true)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [error, setError] = useState('')

  const handleLoginSuccess = (response: any) => {
    console.log('Login successful:', response)
    // Xử lý việc đăng nhập thành công ở đây
  }

  const handleLoginFailure = (error: any) => {
    console.error('Login failed:', error)
    // Xử lý việc đăng nhập thất bại ở đây
  }

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
      const response = await LoginByEmail(email)
      if (isApiSuccess(response)) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('userData', JSON.stringify(response.result))
        dispatch(setUserInfo(response.result))
        dispatch(setLoggedIn(true))
        navigate('/')
      }
      setLoadingShow(false)
    } else {
      // Xử lý khi địa chỉ email không hợp lệ
      console.error('Invalid email address')
      setError('Invalid email address')
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']) // Lưu trữ giá trị của từng input OTP

  // Xử lý khi tất cả các input đều có giá trị
  const handleSubmitOtp = () => {
    const isAllFilled = otpValues.every((value) => value !== '')
    if (isAllFilled) {
      // Gửi yêu cầu OTP API ở đây
      console.log('Send OTP API')
    } else {
      console.log('Not all OTP inputs are filled')
    }
  }

  // Xử lý khi giá trị của một input thay đổi
  const handleOtpInputChange = (index, value) => {
    const otpValuesArr = [...otpValues]
    otpValuesArr[index] = value
    setOtpValues(otpValuesArr)
  }

  return (
    <div style={{ overflowY: 'hidden', height: '100%', width: '100$' }}>
      <div style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
        <Container>
          <ContentWindow>
            {!otpShow ? (
              <div>
                <HeaderDecorationContainer>
                  <img src="assets/login/Adam_login.png"></img>
                  <img src="assets/login/Ash_login.png"></img>
                  <img src="assets/login/Lucy_login.png"></img>
                  <img src="assets/login/Nancy_login.png"></img>
                </HeaderDecorationContainer>
                <HeaderTitle>
                  <span>Welcome to Virtual Office</span>
                </HeaderTitle>

                <GoogleLoginButton onSuccess={handleLoginSuccess} onFailure={handleLoginFailure} />

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
                  <img src="assets/login/Adam_login.png"></img>
                  <img src="assets/login/Ash_login.png"></img>
                  <img src="assets/login/Lucy_login.png"></img>
                  <img src="assets/login/Nancy_login.png"></img>
                </HeaderDecorationContainer>
                <HeaderTitle>
                  <span>Enter your code</span>
                </HeaderTitle>
                <HeaderDescription>
                  We just emailed ${email} with a 6-digit code. If you don't see it, please check
                  your spam folder or
                  <a style={{ color: 'rgb(0, 0, 0', textDecoration: 'none', cursor: 'pointer' }}>
                    resend code
                  </a>
                  .
                </HeaderDescription>
                <OtpContainer>
                  {[...Array(6)].map((_, index) => (
                    <OtpInputComponent
                      key={index}
                      autoFocus={index === 0} // Focus vào input đầu tiên khi mới vào trang
                      maxLength={1} // Chỉ cho phép nhập một ký tự
                      onChange={(value) => handleOtpInputChange(index, value)}
                    />
                  ))}
                </OtpContainer>
              </div>
            )}
          </ContentWindow>
        </Container>
      </div>
    </div>
  )
}
