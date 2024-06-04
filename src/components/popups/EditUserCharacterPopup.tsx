import styled from 'styled-components'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { PopupProps } from '../../interfaces/Interfaces'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useAppSelector } from '../../hook'
import { useEffect, useState } from 'react'
import { setCharacter as setUserCharacter } from '../../stores/UserStore'
import { useDispatch } from 'react-redux'
import ApiService from '../../apis/ApiService'
import { ICharacter } from '../../interfaces/character'

const Layout = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
`

const PopupContainer = styled.div`
  display: flex;
  background-color: rgb(32, 37, 64);
  flex-direction: column;
  padding: 32px;
  border-radius: 16px;
  z-index: 8;
  position: relative;
  overflow: visible;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 10px 25px;
`

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const IconCloseContainer = styled.div`
  display: flex;
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  z-index: 9;

  & > span {
    display: flex;
    width: 24px;
    color: rgb(255, 255, 255);
    flex-shrink: 0;

    & > svg {
      width: 100%;
      height: auto;
    }
  }
`

const UpperContentContainer = styled.div`
  border-radius: 16px 16px 0px 0px;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgb(51, 58, 100);
  display: flex;
  height: 30vh;
  position: relative;
  min-height: 200px;
  max-height: 240px;
  margin: -32px -32px 0px;

  & > img {
    width: 85px;
    height: 130px;
    object-fit: cover;
    object-position: 0px 0px;
    position: absolute;
    bottom: 40px;
    z-index: 1;
    image-rendering: pixelated;
  }
`

const UsernameTopDisplay = styled.div`
  display: flex;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  width: fit-content;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;

  & > span {
    color: white;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
  }
`
const LowerContentContainer = styled.div`
  display: flex;
  padding-top: 40px;
  width: 372px;
  flex-direction: column;
  gap: 40px;

  & > div {
    display: flex;
    flex-direction: column;
  }
`

const UserShadow = styled.div`
  position: absolute;
  width: 79px;
  height: 63px;
  background: rgba(17, 17, 17, 0.2);
  bottom: 17px;
  border-radius: 50%;
`

const ButtonBack = styled.div`
  display: flex;
  & > button {
    display: flex;
    position: relative;
    box-sizing: border-box;
    outline: none;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
    cursor: pointer;
    opacity: 1;
    overflow: hidden;
    background-color: rgb(84, 92, 143);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: auto;
    min-width: min(104px, 100%);
    max-width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
    color: rgb(255, 255, 255) !important;
  }
`

const ButtonFinish = styled.div`
  display: flex;
  width: 170px;
  & > button {
    display: flex;
    position: relative;
    box-sizing: border-box;
    outline: none;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    font-family: inherit;
    font-weight: 700;
    transition: background-color 200ms ease 0s, border-color 200ms ease 0s;
    cursor: pointer;
    opacity: 1;
    overflow: hidden;
    background-color: rgb(6, 214, 160);
    border: 2px solid transparent;
    padding: 0px 16px;
    width: 100%;
    min-width: min(104px, 100%);
    max-width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
    color: rgb(40, 45, 78) !important;
  }
`

const StyledSlider = styled(Slider)`
  .slick-prev {
    left: 0;
    z-index: 1;
  }
  .slick-next {
    right: 0;
    z-index: 1;
  }
  .slick-prev:before,
  .slick-next:before {
    font-size: 40px;
  }
`

const SelectSkinContainer = styled.div``

const EditUserCharacterPopup: React.FC<PopupProps> = ({ onClosePopup }) => {
  const user = useAppSelector((state) => state.user)
  const [characters, setCharacters] = useState<ICharacter[]>([])
  const [character, setCharacter] = useState<ICharacter>()
  const dispatch = useDispatch()

  const settings = {
    dots: false,
    infinite: true,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    // fade: true,
    initialSlide: 0,
    afterChange: (currentIdx: number) => {
      if (characters.length === 0) return
      setCharacter(characters[currentIdx])
    },
  }
  const fetchCharacter = async () => {
    try {
      const res = await ApiService.getInstance().get('/characters')
      if (res.message === `Success`) {
        setCharacters(res.result)
        setCharacter(res.result[0])
      }
    } catch (error) {}
  }
  const handleFinish = async () => {
    try {
      await ApiService.getInstance().patch(`/users/profile`, { character: character?._id })
      setCharacter(character)
      dispatch(setUserCharacter(character))
      onClosePopup()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchCharacter()
  }, [])
  return (
    <Layout>
      <PopupContainer>
        <IconCloseContainer onClick={onClosePopup}>
          <span>
            <CloseRoundedIcon />
          </span>
        </IconCloseContainer>
        <PopupContent>
          <UpperContentContainer>
            <img src={character?.avatar} />
            <UserShadow />
          </UpperContentContainer>
          <UsernameTopDisplay>
            <span>{user.username}</span>
          </UsernameTopDisplay>
          <LowerContentContainer>
            <SelectSkinContainer>
              <StyledSlider {...settings} style={{ maxWidth: '100%' }}>
                {characters.map((character, index) => (
                  <div key={index}>
                    <img
                      src={character.avatar}
                      alt={`Skin ${index}`}
                      style={{
                        margin: '0 auto',
                        imageRendering: 'pixelated',
                        width: '96px',
                        height: '144px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </StyledSlider>
            </SelectSkinContainer>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexDirection: 'row',
              }}
            >
              <ButtonBack>
                <button onClick={onClosePopup}>Back</button>
              </ButtonBack>
              <ButtonFinish>
                <button onClick={handleFinish}>Finish</button>
              </ButtonFinish>
            </div>
          </LowerContentContainer>
        </PopupContent>
      </PopupContainer>
    </Layout>
  )
}

export default EditUserCharacterPopup
