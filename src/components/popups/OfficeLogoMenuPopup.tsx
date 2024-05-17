import styled from "styled-components";
import { MenuPopupContainer, MenuPopupItem } from "./DashboardUserMenuPopup";
import { useAppSelector } from "../../hook";
import { getAvatarById } from "../../utils/util";
import SettingsIcon from '@mui/icons-material/Settings';

const AvatarContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  user-select: none;
  flex-shrink: 0;
`

const AvatarBackground = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: rgb(34, 34, 34);
`

const AvatarImg = styled.img`
  object-position: 0px -2px;
  object-fit: contain;
  object-position: 0px 8px;
  width: 100%;
  height: 150%;
  transform: scale(0.75);
  image-rendering: pixelated;
  position: relative;
  top: -10px;
`

const UsernameText = styled.span`
    color: white;
    font-weight: 700;
    font-size: 20px;
    text-align: center
`

export default function OfficeLogoMenuPopup() {
    const user = useAppSelector((state) => state.user)

    return (
        <MenuPopupContainer style={{ bottom: '110%', left: '0'}}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', padding: '0px 16px' }}>
                <AvatarContainer>
                    <AvatarBackground>
                        <AvatarImg src={"/" + getAvatarById(user.character_id).img} />
                    </AvatarBackground>
                </AvatarContainer>
                <UsernameText>{user.username}</UsernameText>
            </div>
            <hr
                style={{
                    width: '92%',
                    border: '1px solid rgb(84, 92, 143)',
                    margin: '4px 0px',
                    alignSelf: 'center',
                }}
            ></hr>
            <MenuPopupItem>
                <span
                    style={{
                        flex: '0 1 0%',
                        paddingRight: '8px',
                        textDecoration: 'none',
                    }}
                >
                    <span
                        style={{
                            display: 'flex',
                            width: '20px',
                            color: 'rgb(255, 255, 255)',
                        }}
                    >
                        <SettingsIcon
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </span>
                </span>Setting</MenuPopupItem>
        </MenuPopupContainer>
    )
}