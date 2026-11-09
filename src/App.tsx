import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { RequireAuth } from "./components/RequireAuth";

import { Home } from "./pages/public/Home";
import { ProductList } from "./pages/public/ProductList";
import { ProductDetail } from "./pages/public/ProductDetail";
import { Cart } from "./pages/public/Cart";
import { Checkout } from "./pages/public/Checkout";
import { OrderTrack } from "./pages/public/OrderTrack";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { MyOrders } from "./pages/auth/MyOrders";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminUsers } from "./pages/admin/AdminUsers";

import { useAuthStore } from "./store/authStore";

export default function App() {
  const loadMe = useAuthStore((s) => s.loadMe);
  useEffect(() => { loadMe(); }, [loadMe]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/phones" element={<ProductList />} />
          <Route path="/phones/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<OrderTrack />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/account/orders"
            element={<RequireAuth><MyOrders /></RequireAuth>}
          />
        </Route>

        <Route
          path="/admin"
          element={<RequireAuth adminOnly><AdminLayout /></RequireAuth>}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}