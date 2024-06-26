import styled from 'styled-components'
import { IRoomData } from '../../types/Rooms'
import { writeToClipboard } from '../../utils/helpers'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../hook'
import { useNavigate } from 'react-router-dom'
import { LeaveRoom } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'

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

export default function SpaceOptionPopup({
  room,
  refreshRoom,
}: {
  room: IRoomData
  refreshRoom: any
}) {
  const userId = useAppSelector((state) => state.user.userId)
  const navigate = useNavigate()
  const handleCopyUrl = async () => {
    const url = `${window.location.host}/room/${room._id}`
    await writeToClipboard(url)
    toast(`Copy url`)
  }
  const handleLeaveRoom = async () => {
    if (!room) return
    try {
      if (room?._id) {
        const response = await LeaveRoom(room._id)
        if (isApiSuccess(response)) {
          toast('Leave room success!')
          navigate("/app")
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
    refreshRoom()
  }
  return (
    <Container>
      <DropdownList>
        {room.active && (
          <DropdownItem onClick={handleCopyUrl}>
            <span>Copy URL</span>
          </DropdownItem>
        )}
        {userId == room.creator && (
          <DropdownItem onClick={() => navigate(`/dashboard/room/${room._id}`)}>
            <span>Manage Space</span>
          </DropdownItem>
        )}
        {userId != room.creator && (
          <DropdownItem onClick={handleLeaveRoom}>
            <span>Leave Space</span>
          </DropdownItem>
        )}
      </DropdownList>
    </Container>
  )
}
