import styled from 'styled-components'
import { ButtonProps } from '../../interfaces/Interfaces'
import { useEffect, useState } from 'react'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import DiscreteSlider from '../sliders/DiscreteSlider'
import { StyleMap } from '../popups/CreateSpacePopup'
import { useAppSelector } from '../../hook'
import { toast } from 'react-toastify'

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
  & > img {
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
  .title {
    color: rgb(255, 255, 255);
    font-family: 'DM Sans', sans-serif;
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
  opacity: ${(props) => (props.isDisabled ? '0.5' : '1')};
  border: 2px solid ${(props) => (props.isEnabled ? 'rgb(6, 214, 160)' : 'transparent')};
  width: 100%;
  height: 76px;
  border-radius: 12px;
  display: inline-grid;
  grid-template-rows: auto auto;
  gap: 4px;
  cursor: ${(props) => (props.isDisabled ? 'default' : 'pointer')};

  .icon {
    width: 24px;
    height: 24px;
    display: inline-flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;

    place-self: flex-end center;
  }
  .name {
    color: rgb(255, 255, 255);
    font-family: 'DM Sans', sans-serif;
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
  .title {
    color: rgb(255, 255, 255);
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  .size-display {
    display: grid;
    gap: 8px;
    grid-template-columns: auto auto;
    -webkit-box-align: center;
    align-items: center;
    .icon {
      display: flex;
      width: 20px;
      color: rgb(255, 255, 255);
      & > svg {
        width: 100%;
        height: auto;
      }
    }
    .number {
      color: rgb(255, 255, 255);
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }
  }
`
interface Props {
  setMapId: (id: string) => void
  mapSize: number
  setMapSize: (size: number) => void
}
export const ChooseMap = ({ setMapId, mapSize }: Props) => {
  const subscription = useAppSelector((state) => state.user.subscription)
  const styledMap = useAppSelector((state) => state.map.styledMaps)
  const [style, setStyle] = useState(styledMap[0]?.style)
  const [localSize, setLocalSize] = useState(mapSize)
  useEffect(() => {
    const maps = styledMap.find((m) => m.style === style)?.maps
    if (!maps) return
    const map = maps.find((m) => m.capacity === localSize)
    if (!map) return
    console.log(map)
    setMapId(map._id)
  }, [style, localSize])
  useEffect(() => {
    if (!style) {
      setStyle(styledMap[0]?.style)
    }
  }, [styledMap])
  return (
    <>
      {styledMap && (
        <Container>
          <RoomPreview>
            <img src="https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/SBpyJwUS7MorgvE4/9vAI8FK7tgsEpO134jorPf" />
          </RoomPreview>
          <LeftContent>
            <MapSize>
              <SizeSelectHeader onClick={() => {}}>
                <span className="title">MAP SIZE</span>
                <div className="size-display">
                  <span className="icon">
                    <PeopleAltRoundedIcon />
                  </span>
                  <span className="number">{localSize}</span>
                </div>
              </SizeSelectHeader>
              <DiscreteSlider
                width={240}
                label="MAP SIZE"
                defaultValue={10}
                step={10}
                shiftStep={30}
                min={10}
                max={30}
                disabled={subscription.plan.free}
                // disabled={false}
                onChange={(_, value) => setLocalSize(+value)}
              />
            </MapSize>
            <MapTheme>
              <span className="title">MAP THEME</span>
              <div className="theme-container">
                {styledMap.map((map, idx) => (
                  <ThemeOptionButon
                    key={idx}
                    isEnabled={style === map.style}
                    isDisabled={map.style == 'Classic' ? false : subscription.plan.free}
                    // isDisabled={false}
                    onClick={() => {
                      if (map.style == 'Classic' ? false : subscription.plan.free)
                        toast('This feature is only accessible with a subscription!')
                      else setStyle(map.style)
                    }}
                  >
                    <span className="icon">{map.maps[0]?.icon || '🌳'}</span>
                    <span className="name">{map.style}</span>
                  </ThemeOptionButon>
                ))}
              </div>
            </MapTheme>
          </LeftContent>
        </Container>
      )}
    </>
  )
}
