const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
const supplierRoutes = require('./routes/supplierRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const productsRoutes = require('./routes/productRoutes');
const posRoutes = require('./routes/posRoutes');

app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/pos', posRoutes);

app.get('/', (req, res) => {
  res.send('Grocery API is running');
});

app.listen(PORT, () => {
  console.log(` the server is running on http://localhost:${PORT}`);
});
