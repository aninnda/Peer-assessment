// import ListGroup from "./components/ListGroup";
// import Navbar from "./components/Navbar";
// import TeamForm from "./components/InstructorTeamForm"
import { useRef, useState, useEffect, useContext } from 'react';
import './Login.css';
import AuthContext from '../context/AuthProvider';


//TO REFACTOR and put into new file Login.tsx.

const Login: React.FC = () => {

    const { setAuth } = useContext(AuthContext) as { setAuth: (auth: any) => void };
    const userRef = useRef<HTMLInputElement>(null);
    const errRef = useRef();
        
    // State variables for student login
    const [studentId, setStudentId] = useState<string>('');
    const [studentPassword, setStudentPassword] = useState<string>('');


    // State variables for instructor login
    const [instructorId, setInstructorId] = useState<string>('');
    const [instructorPassword, setInstructorPassword] = useState<string>('');

    // State variables for error messages
    const [errMsg, setErrMsg] = useState<string>('');
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

    // Handle student login submission
    const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Student Login', { studentId, studentPassword });
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
        <div className="container">
            <h1>Login</h1>
            <div className="login-section">
                <h2>Student Login</h2>
                <form onSubmit={handleStudentSubmit}>
                <input 
                    type="text"
                    id='username' 
                    placeholder="Student ID"
                    ref={userRef}
                    autoComplete='off' 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    id='password'
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
                        type="text"
                        id='username' 
                        placeholder="Instructor ID"
                        ref={userRef}
                        autoComplete='off' 
                        value={instructorId}
                        onChange={(e) => setInstructorId(e.target.value)}
                        required
                    />
                    <input 
                    type="password" 
                    id='password'
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


export default Login;