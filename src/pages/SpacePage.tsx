import styled from 'styled-components'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { ButtonProps } from '../interfaces/Interfaces'
import Header from '../components/Header'
import { useDispatch } from 'react-redux'
import ApiService from '../apis/ApiService'
import { setLocalStorage } from '../apis/util'
import { setLoggedIn, setUserInfo } from '../stores/UserStore'
import { useNavigate } from 'react-router-dom'
import { GetRoomsByUserId, InviteUserToRoom, JoinRoom } from '../apis/RoomApis'
import { useAppSelector } from '../hook'
import { isApiSuccess } from '../apis/util'
import { SpaceItem } from '../components/SpaceItem'
import { RoomQueryParam } from '../types/Rooms'
import { debounce } from '../utils/helpers'

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

const CustomButton = styled.button<ButtonProps>`
  // Pass ButtonProps to styled.button
  margin: 0px 4px;
  align-items: center;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  padding: 0px 12px;
  opacity: 1;
  background-color: ${(props) => (props.isEnabled ? 'rgb(84, 92, 143)' : 'transparent')};
  filter: brightness(${(props) => (props.isEnabled ? '100%' : '80%')});

  &:hover {
    background-color: rgb(84, 92, 143);
  }
`

const GroupedButtons = ({ setParam }) => {
  const [activeButton, setActiveButton] = useState(1)
  const handleClick = (buttonNumber: number) => {
    setActiveButton(buttonNumber)
    switch (buttonNumber) {
      case 1:
        setParam({ active: true })
        break
      case 2:
        setParam({ owner: true, active: true })
        break
      case 3:
        setParam({ active: false })
        break
      default:
        break
    }
  }
  return (
    <>
      <CustomButton isEnabled={activeButton === 1} onClick={() => handleClick(1)}>
        <Text>Last Visited</Text>
      </CustomButton>
      <CustomButton isEnabled={activeButton === 2} onClick={() => handleClick(2)}>
        <Text>Created Space</Text>
      </CustomButton>
      <CustomButton isEnabled={activeButton === 3} onClick={() => handleClick(3)}>
        <Text>Inactive Space</Text>
      </CustomButton>
    </>
  )
}

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
  const [activeSpaceItemId, setActiveSpaceItemId] = useState('')
  const [spaces, setSpaces] = useState<any[]>([])
  const [param, setParam] = useState<RoomQueryParam>({})
  const [keyword, setKeyword] = useState('')
  const handleOptionPopupShow = (itemId: SetStateAction<string>) => {
    if (activeSpaceItemId === itemId) {
      setActiveSpaceItemId('')
      return
    }
    setActiveSpaceItemId(itemId)
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (keyword !== value) {
      setKeyword(value)
      handleSearch(value)
    }
  }
  const handleSearch = useCallback(
    debounce(async (searchQuery: string) => {
      const response = await GetRoomsByUserId({ ...param, name: searchQuery })
      if (isApiSuccess(response)) {
        setSpaces([...response.result])
      }
    }, 300),
    [param]
  )
  const GetRoomsData = async () => {
    const response = await GetRoomsByUserId(param)
    if (isApiSuccess(response)) {
      setSpaces([...response.result])
    }
  }
  useEffect(() => {
    GetRoomsData()
  }, [])
  useEffect(() => {
    GetRoomsData()
  }, [param])

  return (
    <>
      <Header />
      <TopBar>
        <GroupedButtons setParam={setParam} />
        <SearchBarContainer>
          <SearchBarInner>
            <SearchIcon>
              <SearchRoundedIcon />
            </SearchIcon>
            <SearchInput onChange={handleChange} />
          </SearchBarInner>
        </SearchBarContainer>
      </TopBar>
      <SpacesContainer>
        <SpacesGrid>
          {spaces.map((space) => (
            <SpaceItem
              key={space._id}
              room={space}
              isOptionPopupShow={activeSpaceItemId === space._id}
              setOptionPopupShow={handleOptionPopupShow}
            />
          ))}
        </SpacesGrid>
      </SpacesContainer>
    </>
  )
}
