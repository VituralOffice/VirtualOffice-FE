import styled from "styled-components"
import { useAppSelector } from "../hook"
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { ButtonProps } from "../interfaces/Interfaces";
import { useState } from "react";
import { MenuPopupContainer, MenuPopupItem } from "../components/popups/DashboardUserMenuPopup";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

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
&>div{
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
    &>div{
        &>div{
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            border-radius: 8px;
            padding: 4px;
            transition: all 0.25s ease-in-out 0s;
            overflow: hidden;
            background-color: ${(props) => props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
            &:hover{
                background-color: rgba(255, 255, 255, 0.1);
            }
            .email{
                color: rgb(255, 255, 255);
                font-family: "DM Sans", sans-serif;
                font-weight: 500;
                font-size: 15px;
                line-height: 20px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .icon{
                display: flex;
                width: 20px;
                color: rgb(189, 189, 189);
                flex-shrink: 0;
                &>svg{
                    width: 100%;
                    height: auto;
                }
            }
        }
    }
`

function EmailMenu() {
    return (<MenuPopupContainer style={{bottom: '-170%', right: '0'}}>
        <MenuPopupItem><span className="icon"><span><LogoutRoundedIcon /></span></span>Sign out</MenuPopupItem>
    </MenuPopupContainer>)
}

export function PreOfficeJoinPage() {
    const user = useAppSelector((state) => state.user)
    const [menuShow, setMenuShow] = useState(false);

    return (
        <div style={{
            display: 'flex',
            height: '100%'
        }}>
            <Background>
                <div>
                    <TopContent>
                        <LogoButton><img src="LogoWithText.svg" style={{
                            width: 'auto',
                            height: '100%'
                        }} /></LogoButton>
                        <EmailButton isActive={menuShow}>
                            <div><div onClick={() => setMenuShow(!menuShow)}>
                                <span className="email">{user.email}</span>
                                <span className="icon"><KeyboardArrowDownRoundedIcon /></span>
                            </div></div>
                            {
                                menuShow && <EmailMenu />
                            }
                        </EmailButton>
                    </TopContent>
                </div>
            </Background>
        </div>
    )
}