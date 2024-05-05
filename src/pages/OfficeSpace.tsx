import { useEffect, useState } from 'react'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { GetRoomById } from '../apis/RoomApis'
import { isApiSuccess } from '../apis/util'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'
import { avatars } from '../utils/util'
import { InitGame, DestroyGame } from '../PhaserGame'
import { JoinOfficePage } from './JoinOfficePage'

export const OfficeSpace = () => {
    const user = useAppSelector((state) => state.user)
    const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
    const navigate = useNavigate()
    let { roomId } = useParams();

    const [joinPageShow, setJoinPageShow] = useState(true);

    const handleJoin = (playerName: string) => {
        setJoinPageShow(false);
        if (!lobbyJoined) {
            navigate('/app')
            return
        }
        Game.getInstance()?.registerKeys()
        Game.getInstance()?.myPlayer.setPlayerName(playerName)
        Game.getInstance()?.myPlayer.setPlayerTexture(avatars[user.character_id].name)
        Game.getInstance()?.network.readyToConnect()
    }

    useEffect(() => {
        const fetchData = async () => {
            await InitGame();
            // Bootstrap.getInstance()?.launchGame();

            try {
                const response = await GetRoomById({ _id: roomId! });

                if (!isApiSuccess(response)) {
                    navigate('/app')
                    return
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        return () => {
            DestroyGame();
        };
    }, []);
    
    return joinPageShow && <JoinOfficePage handleSubmit={handleJoin} />
}