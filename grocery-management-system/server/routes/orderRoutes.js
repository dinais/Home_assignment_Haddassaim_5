const express = require('express');
const router = express.Router();
const {updateOrderStatus,createOrder,getOrderItems} = require('../controllers/orderController'); // או supplierController אם את משאירה את זה שם

router.put('/:id/status', updateOrderStatus);
router.post('/', createOrder);
router.get('/:id/items', getOrderItems);

module.exports = router;
