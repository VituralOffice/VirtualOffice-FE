import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from './hook' // Assuming this hook retrieves user data

import SpacePage from './pages/SpacePage'
import LoginPage from './pages/LoginPage'
import SpaceDashboardPage from './pages/SpaceDashboardPage'
import { setLoggedIn, setUserInfo } from './stores/UserStore'
import { useDispatch } from 'react-redux'
import LoadingPage from './pages/LoadingPage'
import TestSpace from './pages/TestSpace'
import Cookies from 'js-cookie';
import { getLocalStorage } from './apis/util'

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`

function App() {
  const user = useAppSelector((state) => state.user)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const dispatch = useDispatch()

  useEffect(() => {
    const userData = getLocalStorage('userData')
    // const userData = Cookies.get('userData'); // Get user data from cookie
    if (userData) {
      dispatch(setUserInfo(userData));
      dispatch(setLoggedIn(true));
    }
  }, []); // Run only once when the application starts

  return (
    <Router>
      <Backdrop>
        <LoadingPage />
        {/* Wrap Header and Routes in a Fragment since they're both siblings */}
        <React.Fragment>
          <Routes>
            {/* public */}
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/app" element={<SpacePage />} />
            <Route
              path="/signin"
              element={user.loggedIn ? <Navigate to="/app" replace /> : <LoginPage />}
            />

            {/* private */}
            <Route path="/dashboard" element={<SpaceDashboardPage />} />
            {/* <Route path="/dashboard" element={user.loggedIn ? <Navigate to="/app" replace /> : <SpaceDashboardPage />} /> */}
            <Route path="/test-space" element={<TestSpace />} />
          </Routes>
        </React.Fragment>
      </Backdrop>
    </Router>
  )
}

export default App
