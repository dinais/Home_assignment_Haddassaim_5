import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginSupplier = () => {
    const [phone, setPhone] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const loginData = {
            phone,
            representative_name: representativeName,
        };
        try {
            const response = await axios.post('http://localhost:3000/api/suppliers/login', loginData);
            if (response.status === 200 || response.status === 201) {
                const supplierId = response.data.supplierId;
                localStorage.setItem('loggedUser', representativeName);
                navigate(`/supplier/${supplierId}`);
            }
        } catch (err) {
            setError('פרטי התחברות שגויים');
        }
    };
    return (
        <div>
            <Link to="/supplier/register">אתה עוד לא מחובר? לחץ כאן להרשמה!</Link>
            <h2>התחברות ספק</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>טלפון:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>שם נציג:</label>
                    <input
                        type="text"
                        value={representativeName}
                        onChange={(e) => setRepresentativeName(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">התחבר</button>
            </form>
        </div>
    );
};

export default LoginSupplier;
