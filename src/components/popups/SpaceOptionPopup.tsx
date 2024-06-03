import styled from 'styled-components'
import { IRoomData } from '../../types/Rooms'
import { writeToClipboard } from '../../utils/helpers'
import { toast } from 'react-toastify'

const Container = styled.div`
  display: flex;
  background-color: rgb(40, 45, 78);
  flex-direction: column;
  padding: 0px;
  border-radius: 16px;
  z-index: 8;
  position: absolute;
  overflow: visible;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
  cursor: pointer;
  transform: translate(0px, 120%);
  right: 0px;
  bottom: 0px;
`

const DropdownList = styled.div`
  display: flex;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  flex-direction: column;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
  max-height: 230px;
  overflow-y: auto;
`

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;

  &:hover {
    background: rgba(145, 173, 255, 0.7);
  }

  & > span {
    color: rgb(32, 37, 64);
    font-weight: 500;
    font-size: 15px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`

export default function SpaceOptionPopup({ room }: { room: IRoomData }) {
  const handleCopyUrl = async () => {
    const url = `${window.location.host}/room/${room._id}`
    await writeToClipboard(url)
    toast(`Copy url`)
  }
  return (
    <Container>
      <DropdownList>
        <DropdownItem>
          <span>Manage Space</span>
        </DropdownItem>
        <DropdownItem>
          <span>Edit Map</span>
        </DropdownItem>
        <DropdownItem onClick={handleCopyUrl}>
          <span>Copy URL</span>
        </DropdownItem>
      </DropdownList>
    </Container>
  )
}
