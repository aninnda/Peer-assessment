import ListGroup from "./components/ListGroup";
import Navbar from "./components/Navbar";
import TeamForm from "./components/InstructorTeamForm"
import React, { useState } from 'react';
import './App.css';


const App: React.FC = () => {
  // State variables for student login
  const [studentId, setStudentId] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [studentPassword, setStudentPassword] = useState<string>('');

  // State variables for instructor login
  const [instructorEmail, setInstructorEmail] = useState<string>('');
  const [instructorPassword, setInstructorPassword] = useState<string>('');

  // Handle student login submission
  const handleStudentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Student Login', { studentId, studentEmail, studentPassword });
};
  // Add your login logic for students here

  // Handle instructor login submission
  const handleInstructorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("Instructor Email:", instructorEmail);
      console.log("Instructor Password:", instructorPassword);
      // Add your login logic for instructors here
  };

  return (
      <div className="container">
          <h1>Login</h1>
          <div className="login-section">
              <h2>Student Login</h2>
              <form onSubmit={handleStudentSubmit}>
              <input 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Student ID" 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
              />


                  <input 
                      type="email" 
                      placeholder="Student Email" 
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                  />
                  <input 
                      type="password" 
                      placeholder="Password" 
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      required
                  />
                  <button type="submit">Login as Student</button>
              </form>
          </div>
          <div className="login-section">
              <h2>Instructor Login</h2>
              <form onSubmit={handleInstructorSubmit}>
                  <input 
                      type="email" 
                      placeholder="Instructor Email" 
                      value={instructorEmail}
                      onChange={(e) => setInstructorEmail(e.target.value)}
                      required
                  />
                  <input 
                      type="password" 
                      placeholder="Password" 
                      value={instructorPassword}
                      onChange={(e) => setInstructorPassword(e.target.value)}
                      required
                  />
                  <button type="submit">Login as Instructor</button>
              </form>
          </div>
      </div>
  );
};


export default App;