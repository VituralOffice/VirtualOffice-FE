import styled from "styled-components"
import { ButtonProps } from "../../interfaces/Interfaces"
import { useState } from "react"
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import DiscreteSlider from "../sliders/DiscreteSlider";

const Container = styled.div`
display: grid;
    gap: 24px;
    grid-template-columns: 1fr auto;
}
`

const RoomPreview = styled.div`
width: 516px;
height: 328px;
display: flex;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: center;
justify-content: center;
background: rgb(0, 0, 0);
border-radius: 16px;
overflow: hidden;
padding: 16px;
&>img{
    max-width: 100%;
    max-height: 100%;
}
`

const LeftContent = styled.div`
width: 248px;
    display: grid;
    gap: 12px;
`

const MapSize = styled.div`
display: grid;
    gap: 6px;
    padding-bottom: 10px;
`

const MapTheme = styled.div`
display: grid;
    gap: 8px;
    overflow: hidden;
    grid-template-rows: auto 1fr;
    .title{
        color: rgb(255, 255, 255);
    font-family: "DM Sans", sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    }
    .theme-container {
        display: grid;
        gap: 16px;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
        align-items: flex-start;
    }
`

const ThemeOptionButon = styled.div<ButtonProps>`
background: rgb(84, 92, 143);
            opacity: 1;
            border: 2px solid ${(props) => props.isEnabled ? 'rgb(6, 214, 160)' : 'transparent'};
            width: 100%;
            height: 76px;
            border-radius: 12px;
            display: inline-grid;
            grid-template-rows: auto auto;
            gap: 4px;
            cursor: pointer;
            
            .icon{
                width: 24px;
                height: 24px;
                display: inline-flex;
                -webkit-box-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                align-items: center;

                place-self: flex-end center;
            }
            .name{
                color: rgb(255, 255, 255);
                font-family: "DM Sans", sans-serif;
                font-weight: 700;
                font-size: 15px;
                line-height: 20px;

                place-self: flex-start center;
            }
`

const SizeSelectHeader = styled.div`
    display: grid;
    gap: 6px;
    grid-template-columns: 1fr auto;
    -webkit-box-align: center;
    align-items: center;
    .title{
        color: rgb(255, 255, 255);
        font-family: "DM Sans", sans-serif;
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0.03em;
        text-transform: uppercase;
    }
    .size-display{
        display: grid;
        gap: 8px;
        grid-template-columns: auto auto;
        -webkit-box-align: center;
        align-items: center;
        .icon {
            display: flex;
            width: 20px;
            color: rgb(255, 255, 255);
            &>svg {
                width: 100%;
                height: auto;
            }
        }
        .number {
            color: rgb(255, 255, 255);
            font-family: "DM Sans", sans-serif;
            font-weight: 700;
            font-size: 14px;
            line-height: 18px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }
    }
`

export const ChooseMap = ({ mapIds, mapId, setMapId, mapSize, setMapSize }) => {
    return (
        <Container>
            <RoomPreview>
                <img src="https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/SBpyJwUS7MorgvE4/9vAI8FK7tgsEpO134jorPf" />
            </RoomPreview>
            <LeftContent>
                <MapSize>
                    <SizeSelectHeader onClick={() => {}}>
                        <span className="title">MAP SIZE</span>
                        <div className="size-display">
                            <span className="icon"><PeopleAltRoundedIcon /></span>
                            <span className="number">{mapSize}</span>
                        </div>
                    </SizeSelectHeader>
                    <DiscreteSlider width={240} label="MAP SIZE" defaultValue={10} step={10} shiftStep={30} min={10} max={30} onChange={(event, value) => setMapSize(value)} />
                </MapSize>
                <MapTheme>
                    <span className="title">MAP THEME</span>
                    <div className="theme-container">
                        {
                            mapIds.map((value) => (
                                <ThemeOptionButon key={value} isEnabled={mapId == value} onClick={() => setMapId(value)}>
                                    <span className="icon">🌳</span>
                                    <span className="name">Courtyard</span>
                                </ThemeOptionButon>
                            ))
                        }
                    </div>
                </MapTheme>
            </LeftContent>
        </Container>
    )
}