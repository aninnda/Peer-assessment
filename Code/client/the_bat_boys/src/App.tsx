import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import axios from 'axios';


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
      <div>
        < Login />
      </div>
  )
}

export default App;