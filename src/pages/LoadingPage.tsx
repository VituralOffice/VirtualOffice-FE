import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components"
import { spinAnimation } from "../anims/CssAnims";

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


    useEffect(() => {
        setLoading(true);

        const promise = new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
        });

        promise.then(() => setLoading(false));

        return () => setLoading(false);
    }, [location]);
    return (
        <>
            {
                loading && (
                    <Container>
                        <div>
                            <div>
                                <Spinner src="logo_transparent.svg" />
                                <LoadingText>Loading ...</LoadingText>
                            </div>
                        </div>
                    </Container>
                )
            }
        </>
    )
}