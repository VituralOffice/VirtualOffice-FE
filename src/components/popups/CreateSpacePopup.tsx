import styled from "styled-components"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const PopupContainer = styled.div`
    display: flex;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    z-index: 6;
    &>div {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 8;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        &>div{
            pointer-events: auto;
            position: absolute;
            opacity: 1;
            transform: translate3d(0px, 0px, 0px);
            &>div{
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 8;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                -webkit-box-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                align-items: center;
                &>div{
                    display: flex;
                    background-color: rgb(40, 45, 78);
                    flex-direction: column;
                    padding: 24px;
                    border-radius: 16px;
                    z-index: 8;
                    position: relative;
                    overflow: visible;
                    box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
                }
            }
        }
    }
`

const CloseIcon = styled.div`
    display: flex;
    position: absolute;
    top: 24px;
    right: 24px;
    cursor: pointer;
    z-index: 9;
    &>span{
        display: flex;
        width: 24px;
        color: rgb(255, 255, 255);
        flex-shrink: 0;
        &>svg{
            width: 100%;
            height: auto;
        }
    }
`

const Title = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 24px;
    margin-right: 40px;
    min-width: 470px;
    &>span {
        color: rgb(255, 255, 255);
        font-family: "DM Sans", sans-serif;
        font-weight: 700;
        font-size: 20px;
        line-height: 26px;
    }
`

const SpaceNameInput = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    .label {
        display: flex;
        margin-bottom: 4px;
        &>label{
            &>span{
                color: rgb(255, 255, 255);
                font-family: "DM Sans", sans-serif;
                font-weight: 500;
                font-size: 13px;
                line-height: 17px;
            }
        }
    }
    .input {
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
        &>input{
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
        }
    }
`

export default function CreateSpacePopup() {
    return (
        <PopupContainer>
            <div><div><div><div>
                <CloseIcon><span><CloseRoundedIcon /></span></CloseIcon>
                <Title>
                    <span>Create a new office space for your team</span>
                </Title>
                <SpaceNameInput>
                    <div className="label"><label><span>Space name* (Appears at the end of URL)</span></label></div>
                    <div className="input"><input type="text" maxLength={25} placeholder="yourspacename" /></div>
                </SpaceNameInput>
            </div></div></div></div>
        </PopupContainer>
    )
}