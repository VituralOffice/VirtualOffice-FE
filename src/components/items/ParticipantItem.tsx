import styled from "styled-components"

const LayoutContainer = styled.div`
height: 56px;
border-radius: 16px;
display: flex;
-webkit-box-align: center;
align-items: center;
padding: 0px 10px 0px 8px;
cursor: pointer;
gap: 12px;
position: relative;
`

const Avatar = styled.div`
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    &>div{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        position: relative;
        user-select: none;
        .background{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            background-color: rgb(34, 34, 34);
            &>img{
                object-fit: cover;
                object-position: 0px -23px;
                width: 100%;
                height: 200%;
                transform: scale(1.25);
                image-rendering: pixelated;
            }
        }
        .status-dot{
            display: flex;
            position: absolute;
            bottom: 0px;
            right: 0px;
            &>svg{
                margin-bottom: -1px;
                flex-shrink: 0;
            }
        }
    }
`

export const ParticipantItem = () => {
    return(
        <LayoutContainer>
            <Avatar>
                <div>
                    <div className="background">
                        <img src="" alt="" />
                    </div>
                    <div className="status-dot"></div>
                </div>
            </Avatar>
        </LayoutContainer>
    )
}