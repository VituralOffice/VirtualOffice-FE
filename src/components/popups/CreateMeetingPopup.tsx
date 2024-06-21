import { useEffect, useRef, useState } from 'react'
import { FormPopup } from './FormPopup'
import { useParams } from 'react-router-dom'
import { CreateMeetingForm } from '../forms/CreateMeetingForm'
import { useAppSelector } from '../../hook'
import { useDispatch } from 'react-redux'
import {
  decreaseOpeningCount,
  increaseOpeningCount,
  setCreateMeetingCallback,
} from '../../stores/UIStore'

export const CreateMeetingPopup = ({ onClosePopup }) => {
  let { roomId } = useParams()
  const [title, setTitle] = useState('')
  const [canSubmit, setCanSubmit] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const ui = useAppSelector((state) => state.ui)
  const dispatch = useDispatch()

  const checkCanSubmit = () => {
    setCanSubmit(title != '')
  }

  const onSubmit = async () => {
    if (roomId) {
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

  useEffect(() => {
    dispatch(increaseOpeningCount())

    return () => {
      dispatch(decreaseOpeningCount())
    }
  }, [])

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
