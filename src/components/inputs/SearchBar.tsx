import styled from 'styled-components'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { SetStateAction } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'

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

  ::placeholder {
    color: white; /* Màu của placeholder */
    opacity: 0.5
  }
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

const ClearSearchButton = styled.div`
  display: flex;
  cursor: pointer;
  & > span {
    display: flex;
    width: 20px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;
    & > svg {
      width: 100%;
      height: auto;
    }
  }
`

interface SearchBarProps {
  search: string
  setSearch: React.Dispatch<SetStateAction<string>>
}

export const SearchBar = ({ search, setSearch }: SearchBarProps) => {
  const handleChange = (e: any) => setSearch(e.target.value)
  const handleClear = () => setSearch('')

  return (
    <SearchBarContainer>
      <SearchBarInner>
        <SearchIcon>
          <SearchRoundedIcon />
        </SearchIcon>
        <SearchInput placeholder='Search' value={search} onChange={handleChange} />
        {search && (
          <ClearSearchButton onClick={handleClear}>
            <span>
              <CancelIcon />
            </span>
          </ClearSearchButton>
        )}
      </SearchBarInner>
    </SearchBarContainer>
  )
}
