import React, { useRef, useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const userRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [isStudentLogin, setIsStudentLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

    const toggleLoginType = () => {
        setIsStudentLogin(!isStudentLogin);
    };

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

            if (response.ok && result.message === 'Success') {
                setSuccess('true');
            } else {
                console.log('Invalid username, password, or role');
                alert('Invalid username, password, or role');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    };

    return (
        <> 
        {success === 'true' ? (
            <section className="redirect-section">
                <h1 className="redirect-message">Redirecting...</h1>
            </section>
        ) : (        
            <div className="login-container">
                <div className="login-section">
                    <button className="login-toggle-button" onClick={toggleLoginType}>
                        {isStudentLogin ? 'Switch to Instructor' : 'Switch to Student'}
                    </button>

                    <div className="login-form-container">
                        <h2 className="login-title">{isStudentLogin ? 'Student Login' : 'Instructor Login'}</h2>  
                        <form className="login-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="login-input login-username"
                                id="userId"
                                placeholder={isStudentLogin ? "Student ID" : "Instructor ID"}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                ref={userRef}
                            />
                            <input
                                type="password"
                                className="login-input login-password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="login-submit-button" type="submit">
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
