import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const RegisterOwner = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        const registerData = {
            username,
            password
        };
        try {
            const response = await axios.post('http://localhost:3000/api/owner/register', registerData);
            if (response.status === 200 || response.status === 201) {
                const ownerId = response.data.storeOwnerId;
                localStorage.setItem('loggedUser', username);
                navigate(`/owner/${ownerId}`);
            }
        } catch (err) {
            setError('שם המשתמש כבר קיים או הייתה שגיאה אחרת');
        }
    };

    return (
        <div>
            <h2>רישום בעל מכולת</h2>
            <Link to="/owner/login">לחץ כאן להתחברות</Link>
            <form onSubmit={handleRegister}>
                <div>
                    <label>שם משתמש:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>סיסמה:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">רשום</button>
            </form>
        </div>
    );
};

export default RegisterOwner;
