import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManagePos = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const{id} = useParams();
const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => {  
        const productsWithQuantity = res.data.products.map(product => ({
          ...product,
          quantity: 0,
        }));
        setProducts(productsWithQuantity);
      })
      .catch(err => {
        console.error('שגיאה בשליפת סחורות', err);
        setMessage('לא הצלחנו לטעון את רשימת הסחורות');
      });
  }, []);
  const handleQuantityChange = (index, value) => {
    const updated = [...products];
    updated[index].quantity = parseInt(value) || 0;
    setProducts(updated);
  };
  const handleSubmit = async () => {
    const purchaseData = products
      .filter(p => p.quantity > 0)
      .map(p => ({ name: p.product_name, quantity: p.quantity }));
    try {
      const res = await axios.post(`http://localhost:3000/api/pos/purchase/${id}`, {
        items: purchaseData,
      });
      alert(res.data.message || 'הקופה עודכנה בהצלחה');
      navigate(`/owner/${id}`);

    } catch (err) {
      console.error('שגיאה בשליחת הקניה', err);
      setMessage('שגיאה בעדכון הקופה');
    }
  };

  return (
    <div>
      <h2>ניהול קופה</h2>
      {products.map((product, index) => (
        <div key={product.id}>
          <label>{product.product_name}:</label>
          <input
            type="number"
            min="0"
            value={product.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>שלח רכישה</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ManagePos;
