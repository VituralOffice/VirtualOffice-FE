import styled from "styled-components"
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector } from "../../../hook";
import { SearchBar } from "../../inputs/SearchBar";
import { useState } from "react";
import { ParticipantDropdown } from "../../dropdowns/ParticipantDropdown";

const LayoutContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  min-height: calc(100vh - 90px);
  min-width: 342px;
  padding: 10px 10px;
  background-color: rgb(32, 37, 64);
  border-radius: 8px;
  transform 500ms ease 0s;
}
`

const CloseSidebarButton = styled.div`
    display: flex;
    position: absolute;
    right: 12px;
    top: 12px;
    color: white;
    z-index: 2;
    &>button {
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
        background-color: transparent;
        border: 2px solid transparent;
        padding: 0px;
        width: 32px;
        max-width: 100%;
        height: 32px;
        border-radius: 12px;
        font-size: 15px;
        color: rgb(255, 255, 255) !important;
        &>svg {
            display: flex;
            width: 20px;
            color: rgb(255, 255, 255);
            flex-shrink: 0;
        }
    }
`

const ContentLayout = styled.div`
    display: flex;
    color: white;
    flex-direction: column;
    width: 100%;
    padding-top: 12px;
    overflow: hidden;
`

const SidebarHeader = styled.div`
    padding-bottom: 8px;
    max-width: 256px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    min-height: 32px;
    box-sizing: content-box;
    &>div{
        display: flex;
        padding-left: 16px;
        padding-right: 8px;
        &>span{
            color: white;
            font-weight: 700;
            font-size: 18px;
            line-height: 24px;
            overflow-wrap: anywhere;
        }
    }
`

const ParticipantContentLayout = styled.div`
    display: flex;
    position: relative;
    overflow: hidden auto;
    scroll-behavior: smooth;
    scrollbar-gutter: stable;
    -webkit-box-flex: 1;
    flex-grow: 1;
    flex-direction: column;
    padding-left: 12px;
    padding-right: 4px;
    &>div{
        display: flex;
        -webkit-box-flex: 1;
        flex-grow: 1;
        width: 100%;
        flex-direction: column;
    }
`



export const OfficeParticipantSidebar = () => {
    const [searchUserTxt, setSearchUserTxt] = useState<string>('');
    const user = useAppSelector((state) => state.user);
    return (
        <LayoutContainer>
            <CloseSidebarButton>
                <button>
                    <CloseIcon />
                </button>
            </CloseSidebarButton>
            <ContentLayout>
                <SidebarHeader>
                    <div><span>{user.username}</span></div>
                </SidebarHeader>
                <div style={{
                    display: 'flex',
                    marginBottom: '16px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                }}>
                    <SearchBar search={searchUserTxt} setSearch={setSearchUserTxt} />
                </div>
                <ParticipantContentLayout>
                    <ParticipantDropdown items={[]} />
                </ParticipantContentLayout>
            </ContentLayout>
        </LayoutContainer>
    )
}