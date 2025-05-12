import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "../pages/Admin/AdminPage";
import UserManagement from "../pages/Admin/UserManagement";
// import OrderManagement from "../pages/Admin/OrderManagement";
// import RegisteredOrders from "../pages/Admin/RegisteredOrders";
// import DeleteOrders from "../pages/Admin/DeleteOrders";
import FavoriteManagement from "../pages/Admin/FavoriteManagement";
import ProductManagement from "../pages/Admin/ProductManagement";
import CategoryManagement from "../pages/Admin/CategoryManagement";
// import ImageManagement from "../pages/Admin/ImageManagement";
const AdminRoutes = () => {
  return (
    <Routes>
      {/* admin anasayfa */}
      <Route index element={<AdminPage />} />

      <Route path="ProductManagement" element={<ProductManagement />} />
      <Route path="UserManagement" element={<UserManagement />} />
      {/* <Route path="OrderManagement" element={<OrderManagement />} /> */}
      {/* <Route path="RegisteredOrders" element={<RegisteredOrders />} /> */}
      {/* <Route path="DeleteOrders" element={<DeleteOrders />} /> */}
      {/* <Route path="FavoriteManagement" element={<FavoriteManagement />} /> */}
      {/* <Route path="ImageManagement" element={<ImageManagement />} /> */}
      <Route path="CategoryManagement" element={<CategoryManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
