import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OrderDetailsModal from '../OrderDetailsModel';
import '../../App.css'
const SupplierOrders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const repName = localStorage.getItem('loggedUser') || '';
    const hour = new Date().getHours();
    let greet = 'שלום';
    if (hour >= 5 && hour < 12) greet = 'בוקר טוב';
    else if (hour >= 12 && hour < 18) greet = 'צהריים טובים';
    else if (hour >= 18 && hour < 22) greet = 'ערב טוב';
    else greet = 'לילה טוב';
    setGreeting(`${greet}, ${repName}`);
  }, []);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/suppliers/orders?supplierId=${id}`);
        setOrders(response.data);
      } catch (err) {
        console.error('שגיאה בהבאת ההזמנות:', err);
      }
    };
    fetchOrders();
  }, [id]);

  const handleApprove = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: 'בתהליך',
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'בתהליך' } : order
        )
      );
    } catch (err) {
      console.error('שגיאה באישור ההזמנה:', err);
    }
  };

  const handleViewItems = async (orderId) => {
    setLoadingItems(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/orders/${orderId}/items`);
      setSelectedOrderItems(response.data.items);
      setSelectedOrderId(orderId);
      setIsModalOpen(true);
    } catch (err) {
      console.error('שגיאה בקבלת פריטי ההזמנה:', err);
      alert('שגיאה בטעינת הפריטים');
    } finally {
      setLoadingItems(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    window.location.href = '/';
  };
  return (
    <div className="orders-container">
      <div className="top-bar">
        <h3>{greeting}</h3>
        <button className="logout-button" onClick={handleLogout}>🚪 התנתק</button>
      </div>

      <h2 className="orders-title">הזמנות שבוצעו מולך</h2>
      {orders.length === 0 ? (
        <p>אין הזמנות להצגה.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p><strong>מספר הזמנה:</strong> {order.id}</p>
              <p><strong>בתאריך:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>סטטוס:</strong> {order.status}</p>
              <div className="btn-group">
                <button
                  onClick={() => handleViewItems(order.id)}
                  className="order-button view"
                >
                  צפייה בפריטים
                </button>
                {order.status === "ממתינה" && (
                  <button
                    onClick={() => handleApprove(order.id)}
                    className="order-button approve"
                  >אשר הזמנה
                  </button>
                )}
              </div>
              {selectedOrderId === order.id && isModalOpen && (
                <OrderDetailsModal
                  items={selectedOrderItems}
                  orderId={order.id}
                  loading={loadingItems}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default SupplierOrders;
