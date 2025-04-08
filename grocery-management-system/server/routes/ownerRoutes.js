const express = require('express');
const router = express.Router();
const { loginStoreOwner,getOrdersByOwner,registerStoreOwner } = require('../controllers/ownerController');

router.post('/login', loginStoreOwner);
router.post('/register', registerStoreOwner);
router.get('/orders', getOrdersByOwner);

module.exports = router;
