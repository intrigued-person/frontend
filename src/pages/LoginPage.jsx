// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'

// function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();



//     const handleClick = () => {
//         navigate('/sign');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         // Simple validation
//         if (!email || !password) {
//             setError('Please enter both email and password');
//             return;
//         }

//         try {
//             const response = await axios.get("https://backend-production-2d2c.up.railway.app/user/login", {
//                 params: {
//                     email: email,
//                     password: password
//                 }
//             });

//             // Check credentials
//             if (response.data) {
//                 // Response is just a string
//                 const userData = response.data; // e.g., 'aaishaabdul_aaisha'

//                 // Store login state in localStorage
//                 localStorage.setItem('isLoggedIn', 'true');
//                 localStorage.setItem('userEmail', userData.userName);
//                 localStorage.setItem('userId', userData.userId) // Assuming you want to store the string directly

//                 // Navigate to game page
//                 navigate('/game');
//             } else {
//                 setError('Invalid email or password');
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError('An error occurred while logging in. Please try again.');
//         }
//     };

//     return (
//         <div className="container">
//             <div className="login-container">
//                 <h2>Login to Quiz Challenge</h2>

//                 {error && <div className="error-message">{error}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label htmlFor="email">Email</label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Enter your email"
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Enter your password"
//                         />
//                     </div>

//                     <button type="submit" className="btn btn-primary login-btn">
//                         Login
//                     </button>
//                 </form>

//                 <div className="signup-footer">
//                     <p>
//                         Don't have an account? <button onClick={handleClick}>Create one here</button>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default LoginPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/sign');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        // Check if the credentials are admin
        if (email === 'admin@gmail.com' && password === 'admin') {
            navigate('/add-data');
            return;
        }

        try {
            const response = await axios.get("https://backend-production-2d2c.up.railway.app/user/login", {
                params: {
                    email: email,
                    password: password
                }
            });

            if (response.data) {
                const userData = response.data; // e.g., 'aaishaabdul_aaisha'

                // Store login state in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', userData.userName);
                localStorage.setItem('userId', userData.userId);

                navigate('/game');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2>Login to Quiz Challenge</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-btn">
                        Login
                    </button>
                </form>

                <div className="signup-footer">
                    <p>
                        Don't have an account? <button onClick={handleClick}>Create one here</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
