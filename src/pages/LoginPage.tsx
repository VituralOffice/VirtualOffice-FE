import styled from "styled-components"
import GoogleLoginButton from "../components/GoogleLoginButton"
import { useContext, useState } from "react"
import { LoginByEmail } from "../apis/AuthApis"
import { useNavigate } from "react-router-dom"
import { isApiSuccess } from "../apis/util"
import { setLoggedIn, setUserInfo } from "../stores/UserStore"
import { useAppDispatch } from "../hook"
import CircularIndeterminate, { FacebookCircularProgress, GradientCircularProgress } from "../components/loadings/LoadingIcon"

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
    & > span{
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
    & > label{
        border: 0;
        font: inherit;
        margin: 0;
        padding: 0;
        vertical-align: initial;
        &>span{
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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loadingShow, setLoadingShow] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [error, setError] = useState('');

    const handleLoginSuccess = (response: any) => {
        console.log('Login successful:', response);
        // Xử lý việc đăng nhập thành công ở đây
    };

    const handleLoginFailure = (error: any) => {
        console.error('Login failed:', error);
        // Xử lý việc đăng nhập thất bại ở đây
    };

    const isEmailValid = (email) => {
        // Biểu thức chính quy để kiểm tra tính hợp lệ của email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmitLoginByEmail = async (event) => {
        event.preventDefault();
        setError("");
        if (isEmailValid(email)) {
            // Gửi yêu cầu API khi địa chỉ email hợp lệ
            setLoadingShow(true);
            const response = await LoginByEmail(email);
            if (isApiSuccess(response)) {
                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('userData', JSON.stringify(response.result));
                dispatch(setUserInfo(response.result));
                dispatch(setLoggedIn(true));
                navigate("/");
            }
            setLoadingShow(false);
        } else {
            // Xử lý khi địa chỉ email không hợp lệ
            console.error('Invalid email address');
            setError("Invalid email address");
        }
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <div style={{ overflowY: 'hidden', height: '100%', width: '100$' }}>
            <div style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
                <Container>
                    <ContentWindow>
                        <div>
                            <HeaderDecorationContainer>
                                <img src="src/images/login/Adam_login.png"></img>
                                <img src="src/images/login/Ash_login.png"></img>
                                <img src="src/images/login/Lucy_login.png"></img>
                                <img src="src/images/login/Nancy_login.png"></img>
                            </HeaderDecorationContainer>
                            <HeaderTitle>
                                <span>Welcome to Virtual Office</span>
                            </HeaderTitle>

                            <GoogleLoginButton onSuccess={handleLoginSuccess} onFailure={handleLoginFailure} />

                            <ORSpan>
                                <span>OR</span>
                            </ORSpan>

                            <form onSubmit={handleSubmitLoginByEmail}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%'
                                }}>
                                    <EmailLabel>
                                        <label>
                                            <span>Email</span>
                                        </label>
                                        {
                                            error && (
                                                <span className="error-txt">{error}</span>
                                            )
                                        }

                                    </EmailLabel>
                                    <EmailInput>
                                        <input type="email" placeholder="Enter your email address" autoComplete="email" onChange={handleEmailChange} />
                                    </EmailInput>
                                </div>

                                <ButtonGroupContainer>
                                    <ButtonSignIn>{
                                        loadingShow ? (
                                            <CircularIndeterminate size={30} color="inherit" />
                                        ) : (
                                            "Sign in with email"
                                        )
                                    }</ButtonSignIn>
                                </ButtonGroupContainer>
                            </form>
                        </div>
                    </ContentWindow>
                </Container>
            </div>
        </div>
    )
}