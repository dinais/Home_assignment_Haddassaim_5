const { Supplier, Orders } = require('../models'); 

//register a supplier
exports.registerSupplier = async (req, res) => {
  const { company_name, phone, representative_name, goods } = req.body;

  if (!company_name || !phone || !representative_name || !goods) {
    return res.status(400).json({ message: 'נא למלא את כל השדות' });
  }

  try {
    const newSupplier = await Supplier.create({
      company_name,
      phone,
      representative_name,
      goods: JSON.stringify(goods), 
    });

    res.status(201).json({ message: 'הספק נרשם בהצלחה', supplierId: newSupplier.id });
  } catch (err) {
    console.error('שגיאה בהוספת ספק:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};

// login a supplier
exports.loginSupplier = async (req, res) => {
  const { phone, representative_name } = req.body;

  if (!phone || !representative_name) {
    return res.status(400).json({ message: 'נא למלא את כל השדות' });
  }

  try {
    const supplier = await Supplier.findOne({
      where: { phone, representative_name },
    });

    if (!supplier) {
      return res.status(401).json({ message: 'פרטי התחברות שגויים' });
    }

    res.status(200).json({ message: 'התחברות הצליחה', supplierId: supplier.id });
  } catch (err) {
    console.error('שגיאה במהלך התחברות:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};

// get orders of a specific supplier
exports.getOrdersBySupplierId = async (req, res) => {
  const { supplierId } = req.query;

  if (!supplierId) {
    return res.status(400).json({ message: 'נא לספק supplierId' });
  }

  try {
    const orders = await Orders.findAll({
      where: { supplier_id: supplierId },
      include: [
        {
          model: Supplier,
          attributes: ['representative_name'], 
        },
      ],
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error('שגיאה בשליפת ההזמנות:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};

// get goods of all suppliers
exports.getAllGoods = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    const formatted = suppliers.map((supplier) => ({
      ...supplier.dataValues,
      goods: typeof supplier.goods === 'string' ? JSON.parse(supplier.goods) : supplier.goods,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('שגיאה בשליפת ספקים:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
