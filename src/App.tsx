import styled from 'styled-components'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './hook' // Assuming this hook retrieves user data

import SpacePage from './pages/SpacePage'
import LoginPage from './pages/LoginPage'
import SpaceDashboardPage from './pages/SpaceDashboardPage'
import LoadingPage from './pages/LoadingPage'
import { OfficeSpace } from './pages/OfficeSpace'
import { JoinRoomByLink } from './pages/JoinRoomByLink'
import UserSettingPage from './pages/UserSettingPage'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`

function App() {
  const user = useAppSelector((state) => state.user)

  return (
    <BrowserRouter>
      <Backdrop>
        <LoadingPage />
        {/* Wrap Header and Routes in a Fragment since they're both siblings */}
        <Routes>
          {/* public */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          {/* <Route path="/app" element={<MeetingDialog />} /> */}
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
    </BrowserRouter>
  )
}

export default App
