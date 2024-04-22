import { useEffect } from 'react'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'
import { useAppSelector } from '../hook'
import { useNavigate } from 'react-router-dom'
import { avatars } from '../utils/util'
import { PreOfficeJoinPage } from './PreOfficeJoinPage'

export default function TestSpace() {
  const user = useAppSelector((state) => state.user)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const game = phaserGame.scene.keys.game as Game
  const navigate = useNavigate()

  const JoinOffice = () => {
    game.registerKeys()
    game.myPlayer.setPlayerName(avatars[0].name)
    game.myPlayer.setPlayerTexture(avatars[0].name)
    game.network.readyToConnect()
  }

  useEffect(() => {
    if (!lobbyJoined || !user.loggedIn) {
      navigate('/app')
      return
    }
    const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap

    const boostIntoGame = () => {
      bootstrap.launchGame()
    }

    bootstrap.network
      .createCustom({ name: 'test', description: 'desc', password: '', autoDispose: false } as any)
      .then(() => boostIntoGame())
      .catch((error) => console.error(error))

    return () => bootstrap.stopGame()
  }, []) // Chạy chỉ một lần khi ứng dụng khởi động
  return <PreOfficeJoinPage onSubmit={JoinOffice} />
}
