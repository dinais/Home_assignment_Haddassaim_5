const express = require('express');
const router = express.Router();
const { registerSupplier,loginSupplier,getOrdersBySupplierId,getAllGoods } = require('../controllers/supplierController');

router.post('/register', registerSupplier);
router.post('/login', loginSupplier);
router.get('/orders', getOrdersBySupplierId);
router.get('/', getAllGoods);

module.exports = router;
