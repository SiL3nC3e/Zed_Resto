import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import DishDetail from './pages/customer/DishDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Reservations from './pages/customer/Reservations';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Profile from './pages/customer/Profile';
import OrderHistory from './pages/customer/OrderHistory';
import About from './pages/customer/About';

import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import Orders from './pages/admin/Orders';
import ReservationsAdmin from './pages/admin/ReservationsAdmin';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';

import KitchenKDS from './pages/kitchen/KitchenKDS';

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const validateCart = useCartStore((s) => s.validateCart);

  useEffect(() => {
    fetchMe();
    validateCart();
  }, [fetchMe, validateCart]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:id" element={<DishDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reservations" element={<ReservationsAdmin />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="/kitchen" element={<KitchenKDS />} />
      </Routes>
    </BrowserRouter>
  );
}
