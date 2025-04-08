import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css'
const OrderGoods = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("שגיאה בקבלת הספקים", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleCheckboxChange = (supplierId, productName, minQuantity) => {
    const key = `${supplierId}-${productName}`;
    if (
      selectedSupplierId &&
      selectedSupplierId !== supplierId &&
      !selectedItems[key]
    ) {
      alert("ניתן להזמין רק מספק אחד בכל פעם.");
      return;
    }
    setSelectedItems((prev) => {
      const newSelected = { ...prev };

      if (newSelected[key]) {
        delete newSelected[key];
      } else {
        if (!selectedSupplierId) {
          setSelectedSupplierId(supplierId);
        }
        newSelected[key] = { quantity: minQuantity };
      }
      if (Object.keys(newSelected).length === 0) {
        setSelectedSupplierId(null);
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (supplierId, productName, quantity) => {
    const key = `${supplierId}-${productName}`;
    if (!selectedItems[key]) return;

    const newQuantity = Math.max(quantity, selectedItems[key].quantity);
    setSelectedItems(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        quantity: newQuantity,
      },
    }));
  };

  const getPriceFromSupplierProduct = (supplierId, productName) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    const product = supplier?.goods?.find(p => p.name === productName);
    return product?.price || 0;
  };

  const handleOrder = async () => {
    const itemsToOrder = Object.entries(selectedItems)
      .filter(([_, val]) => val && val.quantity)
      .map(([key, val]) => {
        const [supplierId, productName] = key.split("-");
        return {
          supplierId: parseInt(supplierId),
          productName,
          quantity: parseInt(val.quantity),
          pricePerUnit: getPriceFromSupplierProduct(parseInt(supplierId), productName),
        };
      });

    if (itemsToOrder.length === 0) {
      alert("לא נבחרו מוצרים להזמנה.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/orders", {
        store_owner_id: id, 
        items: itemsToOrder,
      });
      alert("ההזמנה נשלחה בהצלחה!");
      navigate(`/owner/${id}`);
    } catch (error) {
      console.error("שגיאה בשליחת ההזמנה", error);
    }
  };

  return (
    <div className="order-page">
      <div className="page-header">
        <h2>דף הזמנת סחורה</h2>
        <button className="submit-button" onClick={handleOrder}>
          שלח הזמנה
        </button>
      </div>
      <div className="suppliers-grid">
        {suppliers.map((supplier) => {
          const isSupplierSelected = Object.keys(selectedItems).some(
            (key) => key.startsWith(`${supplier.id}-`)
          );
          return (
            <div
              key={supplier.id}
              className={`supplier-card ${isSupplierSelected ? "selected" : ""}`}>
              <h3>ספק: {supplier.company_name}</h3>
              {(supplier.goods || []).map((item, idx) => {
                const key = `${supplier.id}-${item.name}`;
                const isChecked = selectedItems[key] !== undefined;
                const quantity = selectedItems[key]?.quantity || item.min_quantity;

                return (
                  <div key={idx} className="product-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          handleCheckboxChange(supplier.id, item.name, item.min_quantity)
                        }
                      />
                      להזמין מוצר: <strong>{item.name}</strong> <br></br>מחיר: {item.price} ₪
                    </label>
                    <label>
                      כמות להזמנה:
                      <input
                        type="number"
                        min={item.minQuantity}
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            supplier.id,
                            item.name,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderGoods;
