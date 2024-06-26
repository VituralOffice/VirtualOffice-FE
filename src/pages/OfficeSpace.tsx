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
import { toast } from 'react-toastify'
// import { setWait, startLoadingAndWait, stopLoading } from '../stores/LoadingStore'
import Game from '../scenes/Game'
import { AxiosError } from 'axios'
import { UNKNOWN_ERROR } from '../constant'
import LoadingPage from './LoadingPage'

interface OfficeSpaceProps {
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const OfficeSpace: React.FC<OfficeSpaceProps> = ({ loading, setLoading }) => {
  let { roomId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [joinPageShow, setJoinPageShow] = useState(true)
  const ui = useAppSelector((state) => state.ui)
  const roomStore = useAppSelector((state) => state.room)
  const UICount = useAppSelector((state) => state.ui.openingUIs)
  const whiteboardDialogOpen = useAppSelector((state) => state.whiteboard.whiteboardDialogOpen)
  const meeting = useAppSelector((state) => state.meeting)
  const [gameInittialized, setGameInitialized] = useState(false)

  const handleJoinRoom = async () => {
    setLoading?.(true)
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
          navigate('/app')
        }
        return
      }
      console.log(e)
      navigate('/app')
      return
    }
  }

  const loadRoom = async () => {
    if (!roomId) return
    try {
      const response = await JoinRoom({ roomId })
      // if (!isApiSuccess(response)) {
      //   toast('You are not member of this private room!')
      //   navigate('/app')
      //   return
      // }
      dispatch(setRoomData(response.result))
    } catch (error) {
      if (error instanceof AxiosError) toast(error.response?.data?.message)
      else toast(UNKNOWN_ERROR)
      navigate('/app')
      return
    }
  }

  useEffect(() => {
    if (!roomId) {
      navigate('/app')
      return
    }
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
      setLoading?.(false)
    }
  }, [roomStore.gameCreated, roomStore.networkConstructed])

  useEffect(() => {
    if (roomStore.gameCreated && roomStore.networkConstructed && roomStore.networkInitialized) {
      setLoading?.(false)
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

  // useEffect(() => {
  //   console.log(`cam: ${meeting.cameraON}, mic: ${meeting.microphoneON}`)
  // }, [meeting.cameraON, meeting.microphoneON])

  return (
    <>
      {joinPageShow && roomStore.roomData && (
        <JoinOfficePage handleJoinRoom={handleJoinRoom} room={roomStore.roomData} />
      )}
      {!joinPageShow && <OfficeToolbar></OfficeToolbar>}
      {whiteboardDialogOpen && <WhiteboardDialog />}
      {meeting.meetingDialogOpen && <MeetingDialog />}
      {ui.showCreateMeeting && (
        <CreateMeetingPopup
          onClosePopup={() => {
            dispatch(setShowCreateMeeting(false))
          }}
        />
      )}
    </>
  )
}

export default LoadingPage(OfficeSpace, { autoHideLoading: false })