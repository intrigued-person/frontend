import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!firstName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/user", {
                firstName,
                email,
                password,
            });

            // Assuming a successful response contains user information
            if (response.data) {
                // Navigate to login page after successful registration
                navigate('/login');
            } else {
                setError('Failed to create an account');
            }
        } catch (error) {
            console.error("Error creating account:", error);
            setError('An error occurred while creating the account. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="signup-container">
                <h2>Create an Account</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter your first name"
                        />
                    </div>

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

                    <button type="submit" className="btn btn-primary signup-btn">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;