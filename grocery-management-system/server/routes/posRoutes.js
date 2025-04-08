const express = require('express');
const router = express.Router();
const {handlePurchase} = require('../controllers/posController');

router.post('/purchase/:id', handlePurchase);

module.exports = router;
