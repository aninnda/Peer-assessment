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
    const [userId, setUserId] = useState('');
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

      const response = await fetch('http://localhost:3000/users/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, password, role }),
      });

      const result = await response.text();
      alert(result);

      if (result === 'Success') {
        setSuccess('true');
      } else {
        console.log('Invalid username, password or role');
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
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
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