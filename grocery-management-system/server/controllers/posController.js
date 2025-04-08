const { sequelize, Inventory, Supplier, Orders, OrderItems } = require('../models'); 


//make the purchase
exports.handlePurchase = async (req, res) => {
  const purchases = req.body.items; 
  console.log(purchases);

  for (const item of purchases) {
    const { name, quantity } = item;

    try {
      //update the quantity in the Inventory
      await Inventory.update(
        { quantity: sequelize.literal(`quantity - ${quantity}`) },
        { where: { product_name: name } }
      );
      //check if the quantity is under the minimun
      const product = await Inventory.findOne({ where: { product_name: name } });

      if (product && product.quantity < product.min_quantity) {
        console.log(req.params.id);
        await orderFromBestSupplier(req.params.id, name, product.min_quantity - product.quantity);
      }
    } catch (err) {
      console.error('שגיאה בעדכון מלאי או בהזמנה:', err);
      return res.status(500).json({ message: 'שגיאה בשרת' });
    }
  }

  res.status(200).json({ message: 'המלאי עודכן, נבדקה כמות מינימלית' });
};

async function orderFromBestSupplier(id, productName, shortOf) {
  try {
    //get all the suppliers who supply this item
    const suppliers = await Supplier.findAll();

    let offers = [];

    for (const supplier of suppliers) {
      let goods = supplier.goods;
      if (typeof goods === 'string') {
        try {
          goods = JSON.parse(goods);
        } catch (e) {
          console.error('שגיאה בפירוש JSON:', e);
          return;
        }
      }

      const match = goods.find(g => g.name === productName);
      if (match) {
        offers.push({
          supplier_id: supplier.id,
          price: match.price,
          min_quantity: match.min_quantity
        });
      }
    }

    if (offers.length === 0) {
      console.warn(`לא נמצא ספק שמספק את המוצר "${productName}"`);
      return;
    }
    //choose the best deal
    const best = offers.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));

    //make the order
    const order = await Orders.create({
      store_owner_id: id,
      supplier_id: best.supplier_id,
      status: 'ממתינה'
    });

    console.log(`הוזמנה אוטומטית סחורה: ${productName} מהספק ${best.supplier_id}`);

    const orderItems = [{
      order_id: order.id,
      product_name: productName,
      quantity: Math.max(best.min_quantity, shortOf),
      price_per_unit: best.price
    }];
    console.log(orderItems);

    await OrderItems.bulkCreate(orderItems);
  } catch (err) {
    console.error('שגיאה בהזמנה אוטומטית או בהוספת פריטים להזמנה:', err);
  }
}
