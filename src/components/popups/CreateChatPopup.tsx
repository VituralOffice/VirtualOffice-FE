import { useEffect, useState } from 'react'
import { FormPopup } from './FormPopup'
import { CreateChatForm } from '../forms/CreateChatForm'
import { PopupProps } from '../../interfaces/Interfaces'
import { CreateGroupChatParams } from '../../apis/types'
import { CreateGroupChat } from '../../apis/ChatApis'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../../constant'
import { CHAT_TYPE } from '../../constants/constant'
import { FormSelection } from '../forms/types'
import { useAppSelector } from '../../hook'

export const CreateChatPopup = ({ onClosePopup }: PopupProps) => {
  const room = useAppSelector((state) => state.room)
  const userId = useAppSelector((state) => state.user.userId)
  const [chatName, setChatName] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<FormSelection[]>([])
  const chatTypes = userId == room.roomData.creator ? [CHAT_TYPE.PRIVATE, CHAT_TYPE.GROUP, CHAT_TYPE.PUBLIC] : [CHAT_TYPE.PRIVATE, CHAT_TYPE.GROUP]
  const [selectedChatType, setSelectedChatType] = useState(0)

  const titles = ['Create Chat']
  const forms = [
    <CreateChatForm
      chatName={chatName}
      setChatName={setChatName}
      selectedMembers={selectedMembers}
      setSelectedMembers={setSelectedMembers}
      selectedChatType={selectedChatType}
      setSelectedChatType={setSelectedChatType}
      chatTypes={chatTypes}
    />,
  ]

  const onSubmit = async () => {
    try {
      const response = await CreateGroupChat({
        roomId: room.roomData._id,
        name: chatName,
        type: chatTypes[selectedChatType],
        members: selectedMembers.map((m) => m.id),
      } as CreateGroupChatParams)
      toast('Create chat success')
      onClosePopup()
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
    }
  }

  return (
    <FormPopup
      onClose={onClosePopup}
      titles={titles}
      forms={forms}
      totalSteps={1}
      formCanBeSubmit={true}
      onSubmit={onSubmit}
      submitText="Create"
    />
  )
}
