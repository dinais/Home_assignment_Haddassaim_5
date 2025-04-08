const sequelize = require('../index'); 
const Supplier = require('./supplier');
const StoreOwner = require('./store_owner');
const Orders = require('./orders');
const OrderItems = require('./order_items');
const Inventory = require('./inventory');

Orders.belongsTo(StoreOwner, { foreignKey: 'store_owner_id' });
Orders.belongsTo(Supplier, { foreignKey: 'supplier_id' });
OrderItems.belongsTo(Orders, { foreignKey: 'order_id' });

module.exports = {
  sequelize,
  Supplier,
  StoreOwner,
  Orders,
  OrderItems,
  Inventory
};
