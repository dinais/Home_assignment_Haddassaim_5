import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterSupplier = () => {
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [goods, setGoods] = useState([{ name: '', price: '', min_quantity: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); 
  const handleInputChange = (index, e) => {
    const values = [...goods];
    values[index][e.target.name] = e.target.value;
    setGoods(values);
  };
  const addGood = () => {
    setGoods([...goods, { name: '', price: '', min_quantity: '' }]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const supplierData = {
      company_name: companyName,
      phone: phone,
      representative_name: representativeName,
      goods: goods,
    };
    try {
        const response = await axios.post('http://localhost:3000/api/suppliers/register', supplierData);
        if (response.status === 200 || response.status === 201) {
          localStorage.setItem('loggedUser', representativeName);
          navigate(`/supplier/${response.data.supplierId}`); 
        }
      } catch (err) {
        setError('שגיאה במהלך הרישום');
        console.log(error);
        
      }
    };

  return (
    <div>
      <Link to="/supplier/login">לחץ כאן להתחברות</Link>
      <h2>רישום ספק חדש</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם חברה:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
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

        <h3>סחורות</h3>
        {goods.map((good, index) => (
          <div key={index}>
            <div>
              <label>שם המוצר:</label>
              <input
                type="text"
                name="name"
                value={good.name}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div>
              <label>מחיר:</label>
              <input
                type="number"
                name="price"
                value={good.price}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
            <div>
              <label>כמות מינימלית:</label>
              <input
                type="number"
                name="min_quantity"
                value={good.min_quantity}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
            </div>
          </div>
        ))}

        <button type="button" onClick={addGood}>
          הוסף סחורה
        </button>
        <br />
        <button type="submit">רשום ספק</button>
      </form>
    </div>
  );
};

export default RegisterSupplier;
