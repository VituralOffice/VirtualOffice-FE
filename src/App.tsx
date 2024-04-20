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

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`

function App() {
  const loggedIn = useAppSelector((state) => state.user.loggedIn)
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined)
  const dispatch = useDispatch()

  const checkLogin = (page: any) => {
    if (!loggedIn) {
      return <Navigate to="/signin" replace />
    }
    return page
  }

  useEffect(() => {
    const userDataString = localStorage.getItem('userData')
    // const userDataString = Cookies.get('userData'); // Get user data from cookie
    if (userDataString) {
      const userData = JSON.parse(userDataString);
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
              element={loggedIn ? <Navigate to="/app" replace /> : <LoginPage />}
            />

            {/* private */}
            <Route path="/dashboard" element={checkLogin(<SpaceDashboardPage />)} />
            <Route path="/spaces" element={checkLogin(<SpaceDashboardPage />)} />
            <Route path="/test-space" element={<TestSpace />} />
          </Routes>
        </React.Fragment>
      </Backdrop>
    </Router>
  )
}

export default App
