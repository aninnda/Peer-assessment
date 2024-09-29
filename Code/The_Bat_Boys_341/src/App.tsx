// import ListGroup from "./components/ListGroup";
// import Navbar from "./components/Navbar";
// import TeamForm from "./components/InstructorTeamForm"
import { useRef, useState, useEffect, useContext } from 'react';
import './App.css';
//import { AuthContext } from './context/AuthProvider';
import Login from './components/Login';


//TO REFACTOR and put into new file Login.tsx.

function App() {
  return (
      <div>
        < Login />
      </div>
  )
}

export default App;