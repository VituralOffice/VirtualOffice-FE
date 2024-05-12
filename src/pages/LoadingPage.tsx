import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components"
import { spinAnimation } from "../anims/CssAnims";
import { useDispatch } from "react-redux";
import { GetUserProfile } from "../apis/UserApis";
import { getLocalStorage, setLocalStorage } from "../apis/util";
import { setLoggedIn, setUserInfo } from "../stores/UserStore";
import { useAppSelector } from "../hook";
import { addStopAllTrackBeforeUnloadEvent } from "../utils/util";

const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-color: rgb(51, 58, 100);
    &>div{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 600;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        &>div{
            display: flex;
            padding: 40px;
            flex-direction: column;
            position: fixed;
            align-items: center;
            gap: 24px;
        }
    }
`

const Spinner = styled.img`
    width: 70px;
    animation: 1s ease 0s infinite normal none running ${spinAnimation};
`

const LoadingText = styled.span`
    color: rgb(224, 224, 224);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
`

export default function LoadingPage() {
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useAppSelector((state) => state.user);

    const getUserProfile = async () => {
        try {
            const response = await GetUserProfile();
            if (response.message === `Success` && response.result) {
                setLocalStorage('userData', response.result)
                dispatch(setUserInfo(response.result))
                dispatch(setLoggedIn(true))
            } else {
                dispatch(setLoggedIn(false))
                navigate('/signin')
            }
        } catch (error) {
            dispatch(setLoggedIn(false))
            navigate('/signin')
        }
    }

    useEffect(() => {
        if (!user.loggedIn) {
            getUserProfile();
            return;
        }
        const userData = getLocalStorage('userData')
        if (userData) {
            dispatch(setUserInfo(userData));
            dispatch(setLoggedIn(true));
        } else {
            dispatch(setLoggedIn(false))
            navigate('/signin')
        }
    }, []); // Run only once when the application starts


    useEffect(() => {
        setLoading(true);

        const stopAllTracks = async () => {
            const stream = await navigator.mediaDevices
                ?.getUserMedia({
                    audio: true,
                    video: true,
                })
                console.log(stream.getTracks().length)
            stream.getTracks().forEach((t) => t.stop());
            stream.getAudioTracks().forEach((t) => t.stop());
            stream.getVideoTracks().forEach((t) => t.stop());
        }

        

        const promise = new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
        });

        promise.then(() => {
            setLoading(false)
            stopAllTracks();
        });

        return () => setLoading(false);
    }, [location]);
    return (
        <>
            {
                loading && (
                    <Container>
                        <div>
                            <div>
                                <Spinner src="/logo_transparent.svg" />
                                <LoadingText>Loading ...</LoadingText>
                            </div>
                        </div>
                    </Container>
                )
            }
        </>
    )
}