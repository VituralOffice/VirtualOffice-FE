import { useEffect, useState } from 'react'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { GetRoomById } from '../apis/RoomApis'
import { isApiSuccess } from '../apis/util'
import Bootstrap from '../scenes/Bootstrap'
import Game from '../scenes/Game'
import { avatars } from '../utils/util'

export const OfficeSpace = () => {
    const user = useAppSelector((state) => state.user)
    const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
    const navigate = useNavigate()
    let { roomId } = useParams();

    useEffect(() => {
        Bootstrap.getInstance()?.launchGame();
        
        const fetchData = async () => {
            if (!lobbyJoined || !user.loggedIn || !roomId) {
                navigate('/app')
                return
            }

            try {
                const response = await GetRoomById({ _id: roomId });

                if (!isApiSuccess(response)) {
                    navigate('/app')
                    return
                }

                Game.getInstance()?.registerKeys()
                Game.getInstance()?.myPlayer.setPlayerName(user.playerName)
                Game.getInstance()?.myPlayer.setPlayerTexture(avatars[user.character_id].name)
                Game.getInstance()?.network.readyToConnect()
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        return () => {
            Bootstrap.getInstance()?.stopGame();
        };
    }, []);
    return <></>
}