import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const LoginOwner = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            username,
            password,
        };
        try {
            const response = await axios.post('http://localhost:3000/api/owner/login', loginData);
            if (response.status === 200 || response.status === 201) {
                const ownerId = response.data.storeOwnerId;
                localStorage.setItem('loggedUser', username);
                navigate(`/owner/${ownerId}`);
            }
        } catch (err) {
            setError('שם משתמש או סיסמה שגויים');
        }
    };
    return (
        <div>
            <h2>התחברות בעל מכולת</h2>
            <Link to="/owner/register">אתה עוד לא מחובר? לחץ כאן להרשמה!</Link>

            <form onSubmit={handleLogin}>
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
                <button type="submit">התחבר</button>
            </form>
        </div>
    );
};

export default LoginOwner;
