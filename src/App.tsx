import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hook'; // Assuming this hook retrieves user data

import LoginDialog from './components/LoginDialog';
import RoomSelectionDialog from './components/RoomSelectionDialog';
import Header from './components/Header';
import SpacePage from './spaces/SpacePage';

const Backdrop = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
`;

function App() {
  // const loggedIn = useAppSelector((state) => state.user.loggedIn); // Assuming state structure

  return (
    <Router>
      <Backdrop>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/app" element={<SpacePage />} />
          
          
        </Routes>
      </Backdrop>
    </Router>
  );
}
// <Route path="/login" element={<LoginDialog />} /> {/* Conditional rendering is not needed */}
// <Route path="/room-selection" element={<RoomSelectionDialog />} /> {/* Conditional rendering is not needed */}
export default App;