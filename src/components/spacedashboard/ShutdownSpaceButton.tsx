import LockRoundedIcon from '@mui/icons-material/LockRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import { GeneralButton } from '.'
import { SpaceDashboardComponentParams } from './type'
import { useEffect, useState } from 'react'
import { ChangeRoomSetting } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'

export default function ShutDownSpaceButton({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const [isRoomActive, setIsRoomActive] = useState(room ? room.active : false)
  const [isCooldown, setIsCooldown] = useState(false)

  const toggleShutDownRoom = async () => {
    if (!room) return
    if (isCooldown) return
    setIsCooldown(true)
    try {
      if (room!._id) {
        const response = await ChangeRoomSetting(room!._id, { active: !room.active })
        if (isApiSuccess(response)) {
          setIsRoomActive(!room.active)
          refreshRoom()
          toast('Shut down space success!')
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
    setIsCooldown(false)
  }

  useEffect(() => {
    if(room) setIsRoomActive(room.active)
  }, [room?.active])

  return (
    <GeneralButton isActive={!isCooldown} onClick={toggleShutDownRoom}>
      <span>
        <span>{isRoomActive ? <LockRoundedIcon /> : <LockOpenRoundedIcon />}</span>
      </span>
      {isRoomActive ? 'Shut Down' : 'Re-Open'}
    </GeneralButton>
  )
}
