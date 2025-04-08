import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Supplier from './components/supplier/Supplier'
import RegisterSupplier from './components/supplier/RegisterSupplier';
import LoginSupplier from './components/supplier/LoginSupplier';
import SupplierOrders from './components/supplier/SupplierOrders'
import Owner from './components/owner/Owner';
import RegisterOwner from './components/owner/RegisterOwner';
import LoginOwner from './components/owner/LoginOwner ';
import OwnerDashboard from './components/owner/OwnerDashboard'
import OrderGoods from './components/owner/OrderGoods';
import CurrentOrders from './components/owner/CurrentOrders';
import AllOrders from './components/owner/AllOrders';
import ManagePos from './components/owner/ManagePos';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/supplier" element={<Supplier/>}>
        <Route path="login" element={<LoginSupplier/>}/>
        <Route path="register" element={<RegisterSupplier />} />
        <Route path=":id" element={<SupplierOrders />} />
      </Route>      
      <Route path="/owner" element ={<Owner/>}>
        <Route path="login" element={<LoginOwner/>}/>
        <Route path="register" element={<RegisterOwner/>}/>
        <Route path=":id" element={<OwnerDashboard />} >
        <Route path="order-goods" element={<OrderGoods />} />
        <Route path="current-orders" element={<CurrentOrders />} />
        <Route path="all-orders" element={<AllOrders />} />
        <Route path="manage-pos" element={<ManagePos />} />


        </Route>      

  </Route>
    </Routes>
  );
};

export default AppRoutes;