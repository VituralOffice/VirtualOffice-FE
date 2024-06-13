import { AxiosError } from 'axios'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { SectionBodyContent, FieldInput, SubmitSection, SubmitButton } from '.'
import { InviteUserToRoom } from '../../apis/RoomApis'
import { isApiSuccess } from '../../apis/util'
import { UNKNOWN_ERROR } from '../../constant'
import { SpaceDashboardComponentParams } from './type'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'

export default function ({ room, refreshRoom }: SpaceDashboardComponentParams) {
  const [emailToAdd, setEmailToAdd] = useState('')
  const [canEmailBeSubmit, setEmailCanBeSubmit] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const checkEmailCanBeSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailCanBeSubmit(emailRegex.test(emailToAdd))
  }
  const submitAddPeople = async () => {
    if (!room) return
    if (!canEmailBeSubmit) return
    try {
      if (room?._id) {
        const response = await InviteUserToRoom({ roomId: room._id, email: emailToAdd })
        if (isApiSuccess(response)) {
          refreshRoom()
          toast('Invite user success!')
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
    setEmailToAdd('')
  }
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      checkEmailCanBeSubmit()
    }, 500) // Delay 500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [emailToAdd])
  return (
    <SectionBodyContent>
      <FieldInput>
        <div>
          <input
            placeholder="Room name"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.currentTarget.value)}
            type="text"
          />
        </div>
      </FieldInput>
      <SubmitSection>
        <SubmitButton isActive={canEmailBeSubmit} onClick={submitAddPeople}>
          <button>
            <span>
              <span>
                <MailOutlineRoundedIcon />
              </span>
            </span>
            Add people
          </button>
        </SubmitButton>
      </SubmitSection>
    </SectionBodyContent>
  )
}
