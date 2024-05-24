import { useEffect, useRef, useState } from 'react'
import { FormPopup } from './FormPopup'
import { PopupProps } from '../../interfaces/Interfaces'
import { useParams } from 'react-router-dom'
import { CreateMeetingForm } from '../forms/CreateMeetingForm'
import { CreateGroupChat } from '../../apis/ChatApis'
import { CHAT_TYPE } from '../../constants/constant'
import { useAppSelector } from '../../hook'
import { isApiSuccess } from '../../apis/util'

export const CreateMeetingPopup = ({ onClosePopup, callback }) => {
  let { roomId } = useParams()
  const [title, setTitle] = useState('')
  const [canSubmit, setCanSubmit] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const user = useAppSelector((state) => state.user)

  const checkCanSubmit = () => {
    setCanSubmit(title != '')
  }

  const onSubmit = async () => {
    if (roomId) {
      const response = await CreateGroupChat({
        roomId,
        name: title,
        type: CHAT_TYPE.GROUP,
        member: [user.userId],
      })

      if (isApiSuccess(response)) {
        callback(response)
      }
    }
    onClosePopup()
  }

  const titles = ['Create meeting']
  const forms = [<CreateMeetingForm title={title} setTitle={setTitle} />]

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      checkCanSubmit()
    }, 500) // Delay 500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [title])

  return (
    <FormPopup
      onClose={onClosePopup}
      titles={titles}
      forms={forms}
      totalSteps={1}
      formCanBeSubmit={canSubmit}
      onSubmit={onSubmit}
      submitText="Create"
    />
  )
}
