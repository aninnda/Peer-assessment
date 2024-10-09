// import ListGroup from "./components/ListGroup";
// import Navbar from "./components/Navbar";
// import TeamForm from "./components/InstructorTeamForm"
import { useRef, useState, useEffect, useContext } from 'react';
import './App.css';
//import { AuthContext } from './context/AuthProvider';
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
        {
          array.map((fruit, index) => {
            return <p key={index}>{fruit}</p>
          })
        }
      </div>
  )
}

export default App;