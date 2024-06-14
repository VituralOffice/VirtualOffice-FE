import { AxiosError } from 'axios'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { ChangeRoomSetting } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { UNKNOWN_ERROR } from '../../constant'
import { IOSSwitch } from '../switches/CustomSwitches'
import { SpaceDashboardComponentParams } from './type'

export default function RoomPrivateToggle({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const [isRoomPrivate, setIsRoomPrivate] = useState<boolean>(room ? room.private : true)
  const [isCooldown, setIsCooldown] = useState(false)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  const toggleRoomPrivacy = async () => {
    if (!room) return
    if (isCooldown) return
    setIsCooldown(true)
    try {
      if (room!._id) {
        const response = await ChangeRoomSetting(room!._id, { private: !isRoomPrivate })
        if (isApiSuccess(response)) {
          setIsRoomPrivate(!isRoomPrivate)
          refreshRoom()
          toast('Change room private success!')
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    } finally {
      cooldownRef.current = setTimeout(() => {
        setIsCooldown(false)
      }, 1000) // 1 second cooldown
    }
  }

  // Cleanup timeout if component unmounts
  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setIsRoomPrivate(room ? room.private : true)
  }, [room?.private])

  return <IOSSwitch checked={!isRoomPrivate} onClick={toggleRoomPrivacy} />
}
