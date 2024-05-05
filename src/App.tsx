import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from './hook' // Assuming this hook retrieves user data

import SpacePage from './pages/SpacePage'
import LoginPage from './pages/LoginPage'
import SpaceDashboardPage from './pages/SpaceDashboardPage'
import { setLoggedIn, setUserInfo } from './stores/UserStore'
import { useDispatch } from 'react-redux'
import LoadingPage from './pages/LoadingPage'
import TestSpace from './pages/TestSpace'
import { getLocalStorage, setLocalStorage } from './apis/util'
import { OfficeSpace } from './pages/OfficeSpace'
import { JoinOfficePage } from './pages/JoinOfficePage'
import { GetUserProfile } from './apis/UserApis'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`

function App() {
  const user = useAppSelector((state) => state.user);
  

  return (
    <BrowserRouter>
      <Backdrop>
        <LoadingPage />
        {/* Wrap Header and Routes in a Fragment since they're both siblings */}
        <Routes>
          {/* public */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<SpacePage />} />
          <Route
            path="/signin"
            element={user.loggedIn ? <Navigate to="/app" replace /> : <LoginPage />}
          />

          {/* private */}
          {
            user.loggedIn && (
              <>
                <Route path="/dashboard" element={<SpaceDashboardPage />} />
                <Route path="/test-space" element={<TestSpace />} />
                <Route path="/room/:roomId" element={<OfficeSpace />} />
              </>
            )
          }
        </Routes>
      </Backdrop>
    </BrowserRouter>
  )
}

export default App
