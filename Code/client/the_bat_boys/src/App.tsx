import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import axios from 'axios';
import './App.css';

function App() {

  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:3000/api');
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
      <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      </div>
  )
}

export default App;