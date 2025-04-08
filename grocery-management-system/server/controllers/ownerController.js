const { StoreOwner, Orders, Supplier } = require('../models'); 

//register an owner
exports.registerStoreOwner = async (req, res) => {
  const { username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'נא למלא את כל השדות' });
  }

  try {
    const existingOwner = await StoreOwner.findOne({ where: { username } });
    
    if (existingOwner) {
      console.log('hhh');
      
      return res.status(400).json({ message: 'שם משתמש כבר קיים' });
    }

    await StoreOwner.create({ username, password});
    res.status(201).json({ message: 'הרישום הצליח' });
  } catch (err) {
    console.error('שגיאה במהלך הרישום:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
//log the owner in
exports.loginStoreOwner = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'נא למלא את כל השדות' });
  }

  try {
    const owner = await StoreOwner.findOne({ where: { username } });

    if (!owner || owner.password !== password) {
      return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
    }

    res.status(200).json({ message: 'התחברות הצליחה', storeOwnerId: owner.id });
  } catch (err) {
    console.error('שגיאה במהלך התחברות:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
//get all the orders of this owner
exports.getOrdersByOwner = async (req, res) => {
  const { owner_id, status } = req.query;

  if (!owner_id) {
    return res.status(400).json({ message: 'חסר owner_id בבקשה' });
  }

  try {
    let queryOptions = {
      where: { store_owner_id: owner_id },
      include: [
        {
          model: Supplier,
          attributes: ['representative_name']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    if (status) {
      queryOptions.where.status = status;
    }

    const orders = await Orders.findAll(queryOptions);
    res.status(200).json(orders);
  } catch (err) {
    console.error('שגיאה בשליפת ההזמנות:', err);
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
};
