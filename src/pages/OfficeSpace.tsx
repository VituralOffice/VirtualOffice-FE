import { useEffect, useState } from 'react'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { InitPhaserGame, DestroyGame } from '../PhaserGame'
import { JoinOfficePage } from './JoinOfficePage'
import Bootstrap from '../scenes/Bootstrap'
import OfficeToolbar from '../components/toolbar/OfficeToolbar'
import MeetingDialog from '../components/meeting/MeetingDialog'
import { CreateMeetingPopup } from '../components/popups/CreateMeetingPopup'
import { useDispatch } from 'react-redux'
import { setShowCreateMeeting } from '../stores/UIStore'
import { GetAllChatsWithMessage } from '../apis/ChatApis'
import { setListChat, setMessageMaps } from '../stores/ChatStore'
import WhiteboardDialog from '../components/whiteboards/WhiteboardDialog'
import Network from '../services/Network'
import { JoinRoom } from '../apis/RoomApis'
import { setRoomData } from '../stores/RoomStore'
import { isApiSuccess } from '../apis/util'
import { toast } from 'react-toastify'
import { startLoadingAndWait, stopLoading } from '../stores/LoadingStore'
import Game from '../scenes/Game'

export const OfficeSpace = () => {
  let { roomId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [joinPageShow, setJoinPageShow] = useState(true)
  // const [room, setRoom] = useState<IRoomData | null>()
  const roomStore = useAppSelector((state) => state.room)
  const UICount = useAppSelector((state) => state.ui.openingUIs)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const meeting = useAppSelector((state) => state.meeting)
  const [gameInittialized, setGameInitialized] = useState(false)

  const handleJoinRoom = async () => {
    dispatch(startLoadingAndWait())
    try {
      await Network.getInstance()?.joinCustomById(roomStore.roomData!._id)
      setJoinPageShow(false)
    } catch (e: any) {
      if (e.message.includes('not found')) {
        try {
          await Network.getInstance()?.createCustom({
            name: roomStore.roomData!.name,
            _id: roomStore.roomData!._id,
            map: roomStore.roomData!.map,
          } as any)
          setJoinPageShow(false)
        } catch (createError) {
          console.log('Error creating room:', createError)
          dispatch(stopLoading())
          navigate('/')
        }
        return
      }
      console.log(e)
      dispatch(stopLoading())
      navigate('/')
      return
    }
  }

  const loadRoom = async () => {
    if (!roomId) return
    try {
      const response = await JoinRoom({ roomId })

      if (!isApiSuccess(response)) {
        toast('You are not member of this private room!')
        navigate('/app')
        return
      }
      dispatch(setRoomData(response.result))
    } catch (error) {
      navigate('/app')
      console.error(error)
      return
    }
  }

  useEffect(() => {
    if (!roomId) {
      navigate('/app')
      return
    }
    dispatch(startLoadingAndWait())
    loadRoom()
    return () => {
      Bootstrap.getInstance()?.network?.disconnectFromMeeting(meeting.activeMeetingId!)
      return DestroyGame()
    }
  }, [])

  const loadUserChat = async () => {
    if (!roomId) return
    //load user's chat
    const response = await GetAllChatsWithMessage({ roomId })
    // console.log('load all chats:', response.result)
    dispatch(setListChat(response.result.chats))
    dispatch(setMessageMaps(response.result.mapMessages))
  }

  useEffect(() => {
    if (roomStore.roomData && roomStore.roomData.map.json && !gameInittialized) {
      InitPhaserGame()
      loadUserChat()
      setGameInitialized(true)
    }
  }, [roomStore.roomData])

  useEffect(() => {
    if (roomStore.gameCreated && roomStore.networkConstructed) {
      dispatch(stopLoading())
    }
  }, [roomStore.gameCreated, roomStore.networkConstructed])

  useEffect(() => {
    if (roomStore.gameCreated && roomStore.networkConstructed && roomStore.networkInitialized) {
      dispatch(stopLoading())
    }
  }, [roomStore.networkInitialized])

  useEffect(() => {
    if (UICount > 0) {
      Game.getInstance()?.disableKeys()
    }
    if (UICount == 0) {
      Game.getInstance()?.enableKeys()
    }
  }, [UICount])

  return (
    <>
      {joinPageShow && roomStore.roomData && (
        <JoinOfficePage handleJoinRoom={handleJoinRoom} room={roomStore.roomData} />
      )}
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
