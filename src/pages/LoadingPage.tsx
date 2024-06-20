import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { spinAnimation } from '../anims/CssAnims'
import { useDispatch } from 'react-redux'
import { GetUserProfile } from '../apis/UserApis'
import { getLocalStorage, setLocalStorage } from '../apis/util'
import { setLoggedIn, setSubcription, setUserInfo } from '../stores/UserStore'
import { useAppSelector } from '../hook'
import { USER_LS_KEY, addStopAllTrackBeforeUnloadEvent } from '../utils/util'
import { setIsLoading } from '../stores/LoadingStore'
import { GetAllSubscriptions, GetHighestMonthlyPriceSubcription } from '../apis/SubcriptionApis'

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: rgb(51, 58, 100);
  & > div {
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
    & > div {
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
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  line-height: 20px;
`

export default function LoadingPage() {
  const loadingStore = useAppSelector((store) => store.loading)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useAppSelector((state) => state.user)

  const getUserProfile = async () => {
    try {
      const response = await GetUserProfile()
      if (response.message === `Success` && response.result) {
        setLocalStorage('userData', response.result)
        dispatch(setUserInfo(response.result))
        dispatch(setLoggedIn(true))

        const subres = await GetHighestMonthlyPriceSubcription()
        console.log(`LoadingPage::GetUserProfile load user's subscriptions`, subres.result)
        if (subres.message === `Success` && subres.result) {
          dispatch(setSubcription(subres.result))
        }
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
      getUserProfile()
      return
    }
    const userData = getLocalStorage(USER_LS_KEY)
    if (userData) {
      dispatch(setUserInfo(userData))
      dispatch(setLoggedIn(true))
    } else {
      dispatch(setLoggedIn(false))
      navigate('/signin')
    }
  }, []) // Run only once when the application starts

  let timeout: NodeJS.Timeout | undefined
  useEffect(() => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      dispatch(setIsLoading(false))
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [])
  return (
    <>
      {loadingStore.isLoading && (
        <Container>
          <div>
            <div>
              <Spinner src="/logo_transparent.svg" />
              <LoadingText>Loading ...</LoadingText>
            </div>
          </div>
        </Container>
      )}
    </>
  )
}
