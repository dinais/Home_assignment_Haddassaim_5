const { Inventory } = require('../models'); 

//get all the products of the store
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Inventory.findAll({
      attributes: ['id', 'product_name'],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'לא נמצאו מוצרים במערכת' });
    }

    res.status(200).json({ products });
  } catch (err) {
    console.error('שגיאה בשליפת מוצרים:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
