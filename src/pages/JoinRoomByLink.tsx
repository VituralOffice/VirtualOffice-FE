import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hook'
import queryString from 'query-string'
import ApiService from '../apis/ApiService'
import { useEffect } from 'react'
export const JoinRoomByLink = () => {
  let { roomId } = useParams()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.user)
  const { token } = queryString.parse(useLocation().search)
  const handleJoinRoom = async () => {
    try {
      if (!token || !roomId || !user) return navigate('/')
      await ApiService.getInstance().post(`/rooms/${roomId}/join`, { token })
      return navigate(`/room/${roomId}`)
    } catch (error) {
      console.log({ error })
      return navigate('/')
    }
  }
  useEffect(() => {
    handleJoinRoom()
  }, [])
  return <div></div>
}
