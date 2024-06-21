import styled from 'styled-components'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAppSelector } from './hook' // Assuming this hook retrieves user data

import SpacePage from './pages/SpacePage'
import LoginPage from './pages/LoginPage'
import SpaceDashboardPage from './pages/SpaceDashboardPage'
import OfficeSpace from './pages/OfficeSpace'
import JoinRoomByLink from './pages/JoinRoomByLink'
import UserSettingPage from './pages/UserSettingPage'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { GetHighestMonthlyPriceSubcription } from './apis/SubcriptionApis'
import { GetUserProfile } from './apis/UserApis'
import { setLocalStorage, getLocalStorage } from './apis/util'
import { setUserInfo, setLoggedIn, setSubcription } from './stores/UserStore'
import { USER_LS_KEY } from './utils/util'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`

function App() {
  const user = useAppSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getUserProfile = async () => {
    try {
      const response = await GetUserProfile()
      if (response.message === `Success` && response.result) {
        setLocalStorage('userData', response.result)
        dispatch(setUserInfo(response.result))
        dispatch(setLoggedIn(true))

        const subres = await GetHighestMonthlyPriceSubcription()
        console.log(`App::GetUserProfile load user's subscriptions`, subres.result)
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

  return (
    <Backdrop>
      {/* <LoadingPage /> */}
      <Routes>
        {/* public */}
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<SpacePage />} />
        <Route
          path="/signin"
          element={user.loggedIn ? <Navigate to="/app" replace /> : <LoginPage />}
        />

        {/* private */}
        {user.loggedIn && (
          <>
            <Route path="/user/settings" element={<UserSettingPage />} />
            <Route path="/dashboard/room/:roomId" element={<SpaceDashboardPage />} />
            <Route path="/room/:roomId" element={<OfficeSpace />} />
            <Route path="/rooms/:roomId/join-by-token" element={<JoinRoomByLink />} />
          </>
        )}
      </Routes>
    </Backdrop>
  )
}

function MainApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export default MainApp
