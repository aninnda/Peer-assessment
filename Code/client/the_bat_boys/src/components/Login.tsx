// import ListGroup from "./components/ListGroup";
// import Navbar from "./components/Navbar";
// import TeamForm from "./components/InstructorTeamForm"
import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import './Login.css';
import ToggleButton from './ToggleButton';


const Login = () => {

    const { setAuth } = useContext(AuthContext) as { setAuth: (auth: any) => void };
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);

    //Toggle between student and instructor login
    const [isStudentLogin, setIsStudentLogin] = useState(true);
        
    // State variables for student login
    const [studentId, setStudentId] = useState('');
    const [studentPassword, setStudentPassword] = useState('');


    // State variables for instructor login
    const [instructorId, setInstructorId] = useState('');
    const [instructorPassword, setInstructorPassword] = useState('');

    // State variables for error messages
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('false');

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }
    , [studentId, studentPassword, instructorId, instructorPassword]);

    // Toggle between student and instructor login
    const toggleLoginType = () => {
        setIsStudentLogin(!isStudentLogin);
    };

    // Handle student login submission
    const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Student Login', { studentId, studentPassword });

        // try {
        //     const res = await axios.post(LOGIN_URL, 
        //         JSON.stringify({ studentId, studentPassword }), 
        //         { 
        //             headers: { 'Content-Type': 'application/json'},
        //             withCredentials: true 
        //         }
        //     );
        //     console.log(JSON.stringify(res?.data));
        //     //console.log(JSON.stringify(res));  //optional
        //     const accessToken = res?.data?.accessToken;
        //     //const roles = res?.data?.roles;  //optional
        //     setAuth({ studentId, studentPassword, accessToken }); //add roles if needed
        //     setStudentPassword('');
        //     setStudentPassword('');
        //     setSuccess('true');
        // } catch (err) {
        //     errRef.current?.focus();
        //     console.error(err);
        //     setErrMsg('Invalid credentials');
        //     return;
        // }


        setStudentPassword('');
        setStudentPassword('');
        setSuccess('true');

        setAuth({ studentId, studentPassword });
    };


    // Handle instructor login submission
    const handleInstructorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Instructor Login:", { instructorId, instructorPassword });
        setInstructorId('');
        setInstructorPassword('');
        setSuccess('true');
        setAuth({ instructorId, instructorPassword });
    };

    return (
        <> 
        {success === 'true' ? (
            <section>

                <h1>To redirect to next page when back end is done</h1>
                <br />
                <p>Fruit list is from backend</p>
            </section>
        ) : (        
        
                <div className='container'>
                  <div className="login-section">

                    <button className="toggle-button" onClick={toggleLoginType}>
                      {isStudentLogin ? 'Switch to Instructor' : 'Switch to Student'}
                    </button>
                    
                    {isStudentLogin ? (
                      <div>
                        <h2>Student Login</h2>
                        <form onSubmit={handleStudentSubmit}>
                          <input
                            type="text"
                            id="studentUsername"
                            placeholder="Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                          />
                          <input
                            type="password"
                            id="studentPassword"
                            placeholder="Password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            required
                          />
                          <button type="submit">Login as Student</button>
                        </form>
                      </div>
                    ) : (
                      <div>
                        <h2>Instructor Login</h2>
                        <form onSubmit={handleInstructorSubmit}>
                          <input
                            type="text"
                            id="instructorUsername"
                            placeholder="Instructor ID"
                            value={instructorId}
                            onChange={(e) => setInstructorId(e.target.value)}
                            required
                          />
                          <input
                            type="password"
                            id="instructorPassword"
                            placeholder="Password"
                            value={instructorPassword}
                            onChange={(e) => setInstructorPassword(e.target.value)}
                            required
                          />
                          <button type="submit">Login as Instructor</button>
                        </form>
                      </div>
                    )}
                </div>
            </div>
        
        )}
        </>
    ); 
};


export default Login;