import { useEffect, useRef, useState } from 'react'
import { FormPopup } from './FormPopup'
import { PopupProps } from '../../interfaces/Interfaces'
import { useParams } from 'react-router-dom'
import { CreateMeetingForm } from '../forms/CreateMeetingForm'
import { CreateGroupChat } from '../../apis/ChatApis'
import { CHAT_TYPE } from '../../constants/constant'
import { useAppSelector } from '../../hook'
import { isApiSuccess } from '../../apis/util'
import { useDispatch } from 'react-redux'
import { setCreateMeetingCallback } from '../../stores/UIStore'
import { setActiveChat } from '../../stores/ChatStore'

export const CreateMeetingPopup = ({ onClosePopup }) => {
  let { roomId } = useParams()
  const [title, setTitle] = useState('')
  const [canSubmit, setCanSubmit] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const user = useAppSelector((state) => state.user)
  const ui = useAppSelector((state) => state.ui)
  const dispatch = useDispatch()

  useEffect(() => {
    if (ui.showCreateMeeting) {
      setTitle('')
    }
  }, [ui.showCreateMeeting])

  const checkCanSubmit = () => {
    setCanSubmit(title != '')
  }

  const onSubmit = async () => {
    if (roomId) {
      // const response = await CreateGroupChat({
      //   roomId,
      //   name: title,
      //   type: CHAT_TYPE.GROUP,
      //   member: [user.userId],
      // })

      // if (isApiSuccess(response)) {
      //   console.log("New group chat: ", response.result)
      //   ui.createMeetingCallback!(response.result.name, response.result._id)
      //   dispatch(setCreateMeetingCallback(null))
      //   dispatch(setActiveChat(response.result))
      // }

      ui.createMeetingCallback!(title)
      dispatch(setCreateMeetingCallback(null))
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

  return ui.showCreateMeeting ? (
    <FormPopup
      onClose={onClosePopup}
      titles={titles}
      forms={forms}
      totalSteps={1}
      formCanBeSubmit={canSubmit}
      onSubmit={onSubmit}
      submitText="Create"
    />
  ) : (
    <></>
  )
}
