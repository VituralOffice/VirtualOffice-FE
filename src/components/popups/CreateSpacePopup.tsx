import styled from 'styled-components'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { ButtonProps, PopupProps } from '../../interfaces/Interfaces'
import { useEffect, useState } from 'react'
import { CreateRoom } from '../../apis/RoomApis';
import { ChooseMap } from '../forms/ChooseMap';
import { CreateRoomPanel } from '../forms/CreateRoom';
import Bootstrap from '../../scenes/Bootstrap';
import { useNavigate } from 'react-router-dom';

const PopupContainer = styled.div`
  display: flex;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 6;
  & > div {
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
    & > div {
      pointer-events: auto;
      position: absolute;
      opacity: 1;
      transform: translate3d(0px, 0px, 0px);
      & > div {
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
        & > div {
          display: flex;
          background-color: rgb(40, 45, 78);
          flex-direction: column;
          padding: 24px;
          border-radius: 16px;
          z-index: 8;
          position: relative;
          overflow: visible;
          box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;

          > .form-session {
            margin-top: 0px;
          }
        
          > .form-session ~ .form-session {
            margin-top: 8px;
          }
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

const Title = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 24px;
  margin-right: 40px;
  min-width: 470px;
  & > span {
    color: rgb(255, 255, 255);
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
  }
`

const SubmitButtonsContainer = styled.div`
display: flex;
    justify-content: space-between;
    margin-top: 24px;
`

const BackButton = styled.button`
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
`

const SubmitButton = styled.button<ButtonProps>`
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
    cursor: ${(props) => props.isActive ? 'pointer' : 'default'};
    opacity: 0.5;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    opacity: ${(props) => props.isActive ? '1' : '0.5'};
    border: 2px solid transparent;
    padding: 0px 16px;
    width: auto;
    min-width: min(104px, 100%);
    max-width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;

    ${(props) => props.isActive && `&:hover {
        background-color: rgb(81, 226, 189);
    }`}
    

    .icon{
        flex: 0 1 0%;
        padding-right: 8px;
        &>span{
            display: flex;
            width: 24px;
            color: rgb(40, 45, 78);
            &>svg{
                width: 100%;
                height: auto;
            }
        }
    }
`

export const CreateSpacePopup: React.FC<PopupProps> = ({ onClosePopup }) => {
    const navigate = useNavigate();

    const [stepIndex, setStepIndex] = useState(0);
    const totalSteps = 2;
    const titles = ['Choose your office template', 'Create a new office space for your team']

    const [spaceName, setSpaceName] = useState('');
    const [securitySelectedOption, setSecuritySelectedOption] = useState(0);
    const spaceOptions = ['Anyone with the office URL can enter', 'Only invited members can enter']

    const mapIds = ['6623f6a93981dda1700fc844', '6623f6a93981dda1700fc845', '6623f6a93981dda1700fc846', '6623f6a93981dda1700fc847']
    const [mapId, setMapId] = useState(mapIds[0]);
    const [mapSize, setMapSize] = useState(10);

    // const [password, setPassword] = useState('');
    // const [passwordShowing, setPasswordShowing] = useState(false);

    const [formComplete, setFormComplete] = useState(false);

    const checkSpaceName = () => {
        if (spaceName && spaceName.length > 0) return true;
        return false;
    }
    const checkSecurityOption = () => {
        if (securitySelectedOption >= 0 && securitySelectedOption <= spaceOptions.length - 1) return true;
        return false;
    }
    const checkMapId = () => mapId && mapId.length > 0;
    const checkMapSize = () => mapSize > 0;

    const submitForm = async () => {
        if (!checkSpaceName() || !checkSecurityOption() || !checkMapId() || !checkMapSize()) return;

        const response = await CreateRoom({ map: '6623f6a93981dda1700fc844', name: spaceName, private: securitySelectedOption == 1 })

        console.log("Room created: " , response)
        await Bootstrap.getInstance()?.network.createCustom({
            name: response.result.name,
            id: response.result._id,
            map: response.result.map,
            autoDispose: false,
        } as any);
        navigate(`/join/${response.result._id}`);
    }

    const PopupContents = [<ChooseMap mapIds={mapIds} mapId={mapId} setMapId={setMapId} mapSize={mapSize} setMapSize={setMapSize} />, <CreateRoomPanel spaceName={spaceName} setSpaceName={setSpaceName} setSecuritySelectedOption={setSecuritySelectedOption} spaceOptions={spaceOptions} />]

    useEffect(() => {
        if (checkSpaceName() && checkSecurityOption()) setFormComplete(true);
        else setFormComplete(false);
    }, [spaceName, securitySelectedOption])

    return (
        <PopupContainer>
            <div>
                <div>
                    <div>
                        <div>
                            <CloseIcon>
                                <span>
                                    <CloseRoundedIcon onClick={onClosePopup} />
                                </span>
                            </CloseIcon>
                            <Title>
                                <span>{titles[stepIndex]}</span>
                            </Title>

                            {
                                PopupContents[stepIndex]
                            }

                            {/* {securitySelectedOption == 1 &&
                                <>
                                    <InviteInput onAdd={addInvitedUser} />
                                    <UserList users={invitedUsers} onRemove={removeInvitedUser} />
                                </>
                            } */}

                            <SubmitButtonsContainer>
                                <div style={{ display: 'flex', marginRight: '8px' }}><BackButton onClick={() => setStepIndex(stepIndex - 1)}>Back</BackButton></div>
                                {
                                    stepIndex == totalSteps - 1 ? (
                                        <SubmitButton isActive={formComplete} onClick={submitForm}>
                                            <span className='icon'>
                                                <span><CheckCircleRoundedIcon /></span>
                                            </span>
                                            Create space
                                        </SubmitButton>
                                    ) : (
                                        <SubmitButton isActive={true} onClick={() => setStepIndex(stepIndex + 1)}>
                                            Confirm selection
                                        </SubmitButton>
                                    )
                                }
                            </SubmitButtonsContainer>

                        </div>
                    </div>
                </div>
            </div>
        </PopupContainer>
    )
}
