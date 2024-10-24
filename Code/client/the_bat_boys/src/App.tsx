import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import './App.css';
import TeamForm from './components/TeamForm';
import Ratings from './components/Ratings';
import TBD from './components/TBD';

function App() {

  return (
      <>
      <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<TeamForm />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/other" element={<TBD/ >} />
      </Routes>
      </div>
      </>
  )
}

export default App;