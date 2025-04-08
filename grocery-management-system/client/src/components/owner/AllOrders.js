import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OrderDetailsModal from "../OrderDetailsModel";
import '../../App.css'
const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/owner/orders?owner_id=${id}`);
        setOrders(res.data);
      } catch (error) {
        console.error("שגיאה בשליפת הזמנות:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [id]);

  const handleConfirm = async (orderId) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: "הושלמה",
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "הושלמה" } : order
        )
      );
    } catch (error) {
      console.error("שגיאה בעדכון סטטוס:", error);
    }
  };

  const handleViewItems = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/orders/${orderId}/items`);
      setSelectedOrderItems(res.data.items);
      setSelectedOrderId(orderId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("שגיאה בשליפת פרטי ההזמנה:", error);
    }
  };

  if (loading) return <p>טוען הזמנות...</p>;
  console.log(orders);

  return (
    <div className="orders-container">
      <h2 className="orders-title">כל ההזמנות שלך</h2>
      {orders.length === 0 ? (
        <p className="text-center">אין הזמנות להצגה</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p><strong>מספר הזמנה:</strong> {order.id}</p>
              <p><strong>בתאריך:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>שם ספק:</strong> {order.supplier.representative_name}</p>
              <p><strong>סטטוס:</strong> {order.status}</p>
              <div className="btn-group">
              <button className="order-button view" onClick={() => handleViewItems(order.id)}>צפייה בפריטים</button>
                {order.status === "בתהליך" && (
                  <button className="order-button approve" onClick={() => handleConfirm(order.id)}>אישור קבלת הזמנה</button>
                )}
              </div>
              {isModalOpen && selectedOrderId === order.id && (
                <OrderDetailsModal
                  items={selectedOrderItems}
                  orderId={selectedOrderId}
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

export default AllOrders;



