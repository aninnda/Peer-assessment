import React, { useRef, useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const userRef = useRef<HTMLInputElement>(null);

    // Navigate to the dashboard
    const navigate = useNavigate();

    //Toggle between student and instructor login
    const [isStudentLogin, setIsStudentLogin] = useState(true);
        
    // State variables login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State variables for success
    const [success, setSuccess] = useState('false');

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
      if (success === 'true') {
        navigate('/dashboard');
      }
    });

    // Toggle between student and instructor login
    const toggleLoginType = () => {
        setIsStudentLogin(!isStudentLogin);
    };

    // Handle login submission for both student and instructor
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const role = isStudentLogin ? 'student' : 'instructor';

      try {
          const response = await fetch('http://localhost:3000/users/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ name: username, password, role }),
          });

          const result = await response.json();
          console.log(result);

          if (response.ok && result.message === 'Success') { // Check if the response is OK
              setSuccess('true');
              // Optionally redirect or perform additional actions here
          } else {
              console.log('Invalid username, password, or role');
              alert('Invalid username, password, or role');
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('An error occurred during login. Please try again.'); // Handle unexpected errors
      }
    };


    return (
        <> 
        {success === 'true' ? (
            <section>
                <h1>Redirecting...</h1>

            </section>
        ) : (        
          <div className='container'>
            <div className="login-section">

              <button className="toggle-button" onClick={toggleLoginType}>
                {isStudentLogin ? 'Switch to Instructor' : 'Switch to Student'}
              </button>

              <div>
                <h2>{isStudentLogin ? 'Student Login' : 'Instructor Login'}</h2>  
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    id="userId"
                    placeholder={isStudentLogin ? "Student ID" : "Instructor ID"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit">
                    Login as {isStudentLogin ? "Student" : "Instructor"}
                  </button>
                </form>
              </div>      
            </div>
          </div>
        )}
      </>
    ); 
};


export default Login;