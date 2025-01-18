// AdminRoute.js
import { Routes, Route } from "react-router-dom";
import DashBoard from "../Components/Admin/dashBoard";
import AddProduct from "../Components/Admin/AddProduct";
import EditProduct from "../Components/Admin/EditProduct";
import ProtectedRoute from "./ProtectedRoute"; // Use the updated ProtectedRoute
import ShowProduct from "../Components/Admin/ShowProduct";
import Navbar from "../Common/Navbar";
import SaleProduct from "../Components/Admin/SaleProduct";

function AdminRoute() {
  return (
    <div>
      <Navbar />
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ShowProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path= "/edit-product/:productId"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path= "/sale/:productId"
        element={
          <ProtectedRoute>
            <SaleProduct />
          </ProtectedRoute>
        }
      />
    </Routes>
    </div>
  );
}

export default AdminRoute;
