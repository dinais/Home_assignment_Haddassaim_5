import React from "react";

const OrderDetailsModal = ({ items, onClose }) => {
  return (
    <div>
      <button
        onClick={onClose}
        className="absolute top-2 left-2 text-red-500 text-xl font-bold"
      >
        ✕
      </button>
      <h3 className="text-lg font-bold mb-4 text-center">פרטי הזמנה</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {items.map((item, i) => (
          <li key={i} className="border-b pb-2">
            <p><strong>מוצר:</strong> {item.product_name}</p>
            <p><strong>כמות:</strong> {item.quantity}</p>
            <p><strong>מחיר ליחידה:</strong> ₪{item.price_per_unit}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailsModal;
