const { Orders, OrderItems, Inventory } = require('../models');

//update a status of an order
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'נא לספק סטטוס חדש' });
  }

  try {
    const order = await Orders.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'ההזמנה לא נמצאה' });
    }

    order.status = status;
    await order.save();
//if an order is completed- add the items to the Inventory table
    if (status === 'הושלמה') {
      const items = await OrderItems.findAll({ where: { order_id: id } });

      if (items.length === 0) {
        return res.status(400).json({ message: 'לא נמצאו פריטים להזמנה' });
      }

      let updateCount = 0;

      for (const item of items) {
        const inventoryItem = await Inventory.findOne({ where: { product_name: item.product_name } });
        // if the item exsites- encrement the quentity
        if (inventoryItem) {
          inventoryItem.quantity += item.quantity;
          await inventoryItem.save();
          //if it does not exsit- create it!
        } else {
          await Inventory.create({
            product_name: item.product_name,
            quantity: item.quantity,
            min_quantity: item.quantity - 2,
          });
        }

        updateCount++;
        if (updateCount === items.length) {
          return res.status(200).json({ message: 'הסטטוס עודכן והמלאי עודכן (חלקית או מלאה)' });
        }
      }
    } else {
      return res.status(200).json({ message: 'הסטטוס עודכן בהצלחה' });
    }
  } catch (err) {
    console.error('שגיאה בעדכון סטטוס ההזמנה:', err);
    return res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
//create a new order
exports.createOrder = async (req, res) => {
  const { store_owner_id, items } = req.body;

  if (!store_owner_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'נא לספק פרטי הזמנה תקינים' });
  }

  try {
    const supplier_id = items[0].supplierId;

    const order = await Orders.create({
      store_owner_id,
      supplier_id,
      status: 'ממתינה',
    });

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_name: item.productName,
      quantity: item.quantity,
      price_per_unit: item.pricePerUnit,
    }));

    await OrderItems.bulkCreate(orderItems);

    return res.status(201).json({ message: 'ההזמנה נוצרה בהצלחה', orderId: order.id });
  } catch (err) {
    console.error('שגיאה ביצירת הזמנה:', err);
    return res.status(500).json({ message: 'שגיאה ביצירת הזמנה' });
  }
};
//get items for a specific order
exports.getOrderItems = async (req, res) => {
  const { id } = req.params;

  try {
    const items = await OrderItems.findAll({ where: { order_id: id } });

    if (items.length === 0) {
      return res.status(404).json({ message: 'ההזמנה לא נמצאה או שאין לה פריטים' });
    }

    return res.status(200).json({ orderId: id, items });
  } catch (err) {
    console.error('שגיאה בשליפת פריטי הזמנה:', err);
    return res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
