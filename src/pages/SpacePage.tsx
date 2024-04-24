import styled from "styled-components"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import SpaceItem from "../components/SpaceItem";
import { ButtonProps } from "../interfaces/Interfaces";
import Header from "../components/Header";

const TopBar = styled.div`
display: flex;
background-color: rgb(40, 45, 78);
padding-right: 52px;
justify-content: flex-end;
padding-top: 16px;
padding-bottom: 16px;

> * {
    margin: 0 4px; /* Set margin based on prop */
}

> *:first-child {
    margin-left: 0;
}

> *:last-child {
    margin-right: 0;
}
`

const CustomButton = styled.button<ButtonProps>` // Pass ButtonProps to styled.button
    margin: 0px 4px;
    align-items: center;
    border-radius: 16px;
    border: none;
    cursor: pointer;
    padding: 0px 12px;
    opacity: 1;
    background-color: ${props => (props.isEnabled ? 'rgb(84, 92, 143)' : 'transparent')};
    filter: brightness(${props => (props.isEnabled ? '100%' : '80%')});

    &:hover {
        background-color: rgb(84, 92, 143);
    }
`;

const GroupedButtons = () => {
    const [activeButton, setActiveButton] = useState(1);

    const handleClick = (buttonNumber: number) => {
        setActiveButton(buttonNumber);
    };

    return (
        <>
            <CustomButton isEnabled={activeButton === 1} onClick={() => handleClick(1)}><Text>Last Visited</Text></CustomButton>
            <CustomButton isEnabled={activeButton === 2} onClick={() => handleClick(2)}><Text>Created Space</Text></CustomButton>
        </>
    );
};

const SearchBarContainer = styled.div`
display: flex;
    flex-direction: column;
    width: 240px;
`

const SearchInput = styled.input`
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
    outline: none;
`

const SearchBarInner = styled.div`
width: 100%;
border: 2px solid rgb(144, 156, 226);
border-radius: 10px;
display: flex;
flex-direction: row;
-webkit-box-align: center;
align-items: center;
transition: border 200ms ease 0s;
box-sizing: border-box;
height: 40px;
padding: 0px 8px 0px 16px;
> * {
    margin: 0 3px; /* Set margin based on prop */
}

> *:first-child {
    margin-left: 0;
}

> *:last-child {
    margin-right: 0;
}

&:focus-within {
    border: 2px solid rgb(255, 255, 255);
}
`

const SearchIcon = styled.span`
display: flex;
    width: 20px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    svg {
        width: 100%;
        height: auto;
    }
`
const Text = styled.span`
    color: rgb(255, 255, 255);
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
`

const SpacesContainer = styled.div`
display: flex;
    background-color: rgb(40, 45, 78);
    height: 100%;
    flex-direction: column;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
`

const SpacesGrid = styled.div`
display: grid;
    grid-template-columns: repeat(auto-fill, minmax(312px, 1fr));
    gap: 32px;
    -webkit-box-align: start;
    align-items: start;
    margin: 20px;
`

export default function SpacePage() {
    const [activeSpaceItemId, setActiveSpaceItemId] = useState(-1);

    const handleOptionPopupShow = (itemId: SetStateAction<number>) => {
        if (activeSpaceItemId === itemId) {
            setActiveSpaceItemId(-1);
            return;
        }
        setActiveSpaceItemId(itemId);
    };

    const spaceItemIds = [1, 2, 3, 4];

    const handleClickOutside = () => {
        if (activeSpaceItemId !== -1) {
            handleOptionPopupShow(-1);
            console.log(activeSpaceItemId);
        }
    };


    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <Header />
            <TopBar>
                <GroupedButtons />
                <SearchBarContainer>
                    <SearchBarInner>
                        <SearchIcon><SearchRoundedIcon /></SearchIcon>
                        <SearchInput />
                    </SearchBarInner>
                </SearchBarContainer>
            </TopBar>
            <SpacesContainer>
                <SpacesGrid>
                    {spaceItemIds.map(id => (
                        <SpaceItem
                            key={id}
                            id={id}
                            isOptionPopupShow={activeSpaceItemId === id}
                            setOptionPopupShow={handleOptionPopupShow}
                        />
                    ))}
                </SpacesGrid>
            </SpacesContainer>
        </>
    )
}