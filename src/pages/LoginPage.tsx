import styled from "styled-components"
import GoogleLoginButton from "../components/GoogleLoginButton"

const Container = styled.div`
height: 100%;
display: flex;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: center;
justify-content: center;
background-image: url(https://cdn.gather.town/v0/b/gather-town.appspot.com/o/images%2Fsignin_bg.png?alt=media&token=be54b54c-34be-4644-a640-7d69507f0941);
background-repeat: repeat-x;
background-size: cover;
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
    const handleLoginSuccess = (response: any) => {
        console.log('Login successful:', response);
        // Xử lý việc đăng nhập thành công ở đây
    };

    const handleLoginFailure = (error: any) => {
        console.error('Login failed:', error);
        // Xử lý việc đăng nhập thất bại ở đây
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

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%'
                            }}>
                                <EmailLabel>
                                    <label>
                                        <span>Email</span>
                                    </label>
                                </EmailLabel>
                                <EmailInput>
                                    <input type="email" placeholder="Enter your email address" />
                                </EmailInput>
                            </div>

                            <ButtonGroupContainer>
                                <ButtonSignIn>Sign in with email</ButtonSignIn>
                            </ButtonGroupContainer>
                        </div>
                    </ContentWindow>
                </Container>
            </div>
        </div>
    )
}