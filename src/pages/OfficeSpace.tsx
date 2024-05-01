import { useEffect, useState } from 'react'
import phaserGame from '../PhaserGame'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { avatars } from '../utils/util'
import { JoinOfficePage } from './JoinOfficePage'
import { GetRoomData } from '../apis/RoomApis'
import { isApiSuccess } from '../apis/util'

export const OfficeSpace = () => {
    const [preJoinPageShow, setPreJoinPageShow] = useState(true)
    const user = useAppSelector((state) => state.user)
    const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
    const game = phaserGame.scene.keys.game as Game
    const navigate = useNavigate()
    let { roomId } = useParams();
    const JoinOffice = (playerName: string) => {
        game.registerKeys()
        game.myPlayer.setPlayerName(playerName)
        game.myPlayer.setPlayerTexture(avatars[user.character_id].name)
        game.network.readyToConnect()
        setPreJoinPageShow(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!lobbyJoined || !user.loggedIn || !roomId) {
                navigate('/app')
                return
            }

            try {
                const response = await GetRoomData({ roomId });

                if (!isApiSuccess(response)) {
                    navigate('/app')
                    return
                }

console.log(response)

                // const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;

                // const boostIntoGame = () => {
                //     bootstrap.launchGame();
                // };

                // // todo: create/get room to get roomId
                // await bootstrap.network.createCustom({
                //     name: response.result.name,
                //     id: response.result._id,
                //     map: response.result.map,
                //     autoDispose: false,
                // } as any);

                // boostIntoGame();
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        return () => {
            const bootstrap = phaserGame.scene.keys.bootstrap as Bootstrap;
            bootstrap.stopGame();
        };
    }, []);
    return preJoinPageShow ? <JoinOfficePage onSubmit={JoinOffice} /> : <></>
}