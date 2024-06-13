import { AxiosError } from 'axios'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { SectionBodyContent, FieldInput, SubmitSection, SubmitButton } from '.'
import { ChangeRoomSetting } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { UNKNOWN_ERROR } from '../../constant'
import { SpaceDashboardComponentParams } from './type'

export default function ChangeRoomName({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const [roomName, setRoomName] = useState('')
  const [canRoomNameBeSubmit, setCanRoomNameBeSubmit] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const checkRoomNameCanBeSubmit = () => {
    if (roomName.length <= 0) {
      // toast("Room name can not be empty!")
      setCanRoomNameBeSubmit(false)
      return
    }
    if (roomName == room?.name) {
      // toast("New room name has to be identical to the current name!")
      setCanRoomNameBeSubmit(false)
      return
    }

    setCanRoomNameBeSubmit(true)
  }

  const changeRoomName = async () => {
    if (!room) return
    if (!canRoomNameBeSubmit) return
    try {
      if (room?._id) {
        const response = await ChangeRoomSetting(room!._id, { name: roomName })
        if (isApiSuccess(response)) {
          toast('Change room name success!')
          refreshRoom()
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
    setRoomName('')
  }

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      checkRoomNameCanBeSubmit()
    }, 500) // Delay 500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [roomName])

  return (
    <SectionBodyContent>
      <FieldInput>
        <div>
          <input
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.currentTarget.value)}
            type="text"
          />
        </div>
      </FieldInput>
      <SubmitSection>
        <SubmitButton isActive={canRoomNameBeSubmit} onClick={changeRoomName}>
          <button>Submit</button>
        </SubmitButton>
      </SubmitSection>
    </SectionBodyContent>
  )
}
