import { useEffect, useState } from 'react'
import { useAppSelector } from '../hook'
import { useNavigate, useParams } from 'react-router-dom'
import { InitGame, DestroyGame } from '../PhaserGame'
import { JoinOfficePage } from './JoinOfficePage'

export const OfficeSpace = () => {
    const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
    const navigate = useNavigate()

    const [joinPageShow, setJoinPageShow] = useState(true);

    const handleJoin = () => {
        setJoinPageShow(false);
        if (!lobbyJoined) {
            navigate('/app')
            return
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await InitGame();
        };

        fetchData();

        return () => {
            DestroyGame();
        };
    }, []);

    return <>
        {
            joinPageShow && <JoinOfficePage handleSubmit={handleJoin} />
        }
    </>
}