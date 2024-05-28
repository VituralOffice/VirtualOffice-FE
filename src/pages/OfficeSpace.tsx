import { useEffect, useState } from 'react'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { InitGame, DestroyGame, PhaserGameInstance, loadGameScene } from '../PhaserGame'
import { JoinOfficePage } from './JoinOfficePage'
import Bootstrap from '../scenes/Bootstrap'
import { GetRoomById } from '../apis/RoomApis'
import { IRoomData } from '../types/Rooms'
import { isApiSuccess } from '../apis/util'
import OfficeToolbar from '../components/toolbar/OfficeToolbar'
import MeetingDialog from '../components/meeting/MeetingDialog'
import { CreateMeetingPopup } from '../components/popups/CreateMeetingPopup'
import { useDispatch } from 'react-redux'
import { setShowCreateMeeting } from '../stores/UIStore'
import Game from '../scenes/Game'

export const OfficeSpace = () => {
  let { roomId } = useParams()
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [joinPageShow, setJoinPageShow] = useState(true)
  const [room, setRoom] = useState<IRoomData | null>()
  const meeting = useAppSelector((state) => state.meeting)
  const ui = useAppSelector((state) => state.ui)

  const handleJoinRoom = async () => {
    try {
      await Bootstrap.getInstance()?.network.joinCustomById(room!._id)
      setJoinPageShow(false)
    } catch (e: any) {
      if (e.message.includes('not found')) {
        try {
          await Bootstrap.getInstance()?.network.createCustom({
            name: room!.name,
            id: room!._id,
            map: room!.map,
            autoDispose: room!.autoDispose,
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
    if (!lobbyJoined) {
      navigate('/app')
      return
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetRoomById({ _id: roomId! })

        if (!isApiSuccess(response)) {
          navigate('/app')
          return
        }
        setRoom(response.result)
      } catch (error) {
        console.error(error)
      }

      await InitGame()
    }

    fetchData()

    return () => {
      DestroyGame()
    }
  }, [])

  return (
    <>
      {joinPageShow && <JoinOfficePage handleJoinRoom={handleJoinRoom} />}
      {!joinPageShow && <OfficeToolbar></OfficeToolbar>}
      {meeting.meetingDialogOpen && <MeetingDialog />}
      <CreateMeetingPopup onClosePopup={() => {
        dispatch(setShowCreateMeeting(false));
      }} />
    </>
  )
}
