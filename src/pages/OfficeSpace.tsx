import { useEffect, useState } from 'react'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { InitGame, DestroyGame } from '../PhaserGame'
import { JoinOfficePage } from './JoinOfficePage'
import Bootstrap from '../scenes/Bootstrap'
import { GetRoomById } from '../apis/RoomApis'
import { isApiSuccess } from '../apis/util'
import OfficeToolbar from '../components/toolbar/OfficeToolbar'
import MeetingDialog from '../components/meeting/MeetingDialog'
import { CreateMeetingPopup } from '../components/popups/CreateMeetingPopup'
import { useDispatch } from 'react-redux'
import { setShowCreateMeeting } from '../stores/UIStore'
import { setRoomData, setRoomId } from '../stores/RoomStore'
import { GetAllChatsWithMessage } from '../apis/ChatApis'
import { setListChat, setMessageMaps } from '../stores/ChatStore'
import WhiteboardDialog from '../components/whiteboards/WhiteboardDialog'
import { IRoomData } from '../types/Rooms'

export const OfficeSpace = () => {
  let { roomId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [joinPageShow, setJoinPageShow] = useState(true)
  // const [room, setRoom] = useState<IRoomData | null>()
  const roomStore = useAppSelector((state) => state.room)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const meeting = useAppSelector((state) => state.meeting)
  const [gameInittialized, setGameInitialized] = useState(false)

  const handleJoinRoom = async () => {
    try {
      await Bootstrap.getInstance()?.network.joinCustomById(roomStore.roomData!._id)
      setJoinPageShow(false)
    } catch (e: any) {
      if (e.message.includes('not found')) {
        try {
          await Bootstrap.getInstance()?.network.createCustom({
            name: roomStore.roomData!.name,
            id: roomStore.roomData!._id,
            map: roomStore.roomData!.map,
            autoDispose: roomStore.roomData!.autoDispose,
          } as any)
          setJoinPageShow(false)
        } catch (createError) {
          console.log('Error creating room:', createError)
          navigate('/')
        }
        return
      }
      console.log(e)
      navigate('/')
      return
    }
  }

  useEffect(() => {
    if (!roomId) return
    //set roomId if it is not set
    if (roomStore.roomId === '') {
      dispatch(setRoomId(roomId!))
    }

    const fetchData = async () => {
      try {
        const response = await GetRoomById({ _id: roomId! })

        if (!isApiSuccess(response)) {
          navigate('/app')
          return
        }
        dispatch(setRoomData(response.result))
      } catch (error) {
        navigate('/app')
        console.error(error)
        return
      }

      // await InitGame()
    }

    fetchData()

    return () => {
      Bootstrap.getInstance()?.network?.disconnectFromMeeting(meeting.activeMeetingId!)
      return DestroyGame()
    }
  }, [])

  useEffect(() => {
    const loadUserChat = async () => {
      if (!roomId) return
      //load user's chat
      // const chatResponse = await GetAllChats({ roomId })
      const response = await GetAllChatsWithMessage({ roomId })

      // console.log('load all chats:', response.result)

      dispatch(setListChat(response.result.chats))
      dispatch(setMessageMaps(response.result.mapMessages))
    }

    loadUserChat()
  }, [])

  const handleInitGame = async () => {
    if (roomStore.roomData && roomStore.roomData.map && roomStore.roomData.map.json && !gameInittialized) {
      console.log(roomStore.roomData.map.json)
      await InitGame();
      setGameInitialized(true);
    }
  }

  useEffect(() => {
    handleInitGame();
  }, [roomStore.roomData])

  return (
    <>
      {joinPageShow && roomStore.roomData && <JoinOfficePage handleJoinRoom={handleJoinRoom} room={roomStore.roomData} />}
      {!joinPageShow && <OfficeToolbar></OfficeToolbar>}
      {whiteboardDialogOpen && <WhiteboardDialog />}
      {meeting.meetingDialogOpen && <MeetingDialog />}
      <CreateMeetingPopup
        onClosePopup={() => {
          dispatch(setShowCreateMeeting(false))
        }}
      />
    </>
  )
}
