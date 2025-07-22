import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ParkingLot from './pages/ParkingLot';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ParkingLot />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

