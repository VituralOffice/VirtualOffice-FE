import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAppSelector } from './hook'; // Assuming this hook retrieves user data

import Header from './components/Header';
import SpacePage from './pages/SpacePage';
import LoginPage from './pages/LoginPage';
import SpaceDashboardPage from './pages/SpaceDashboardPage';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`;

function App() {
  // const loggedIn = useAppSelector((state) => state.user.loggedIn); // Assuming state structure

  return (
    <Backdrop>
      <Router>
        {/* Wrap Header and Routes in a Fragment since they're both siblings */}
        <React.Fragment>
          <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/app" element={<SpacePage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/dashboard" element={<SpaceDashboardPage />} />
          </Routes>
        </React.Fragment>
      </Router>
    </Backdrop>
  );
}

export default App;