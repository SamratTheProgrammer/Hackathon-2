import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AddMoney from "./pages/AddMoney";
import SendMoney from "./pages/SendMoney";
import Transactions from "./pages/Transactions";
import Rewards from "./pages/Rewards";
import Security from "./pages/Security";
import Profile from "./pages/Profile";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import { TransactionProvider } from "./context/TransactionContext";
import { ThemeProvider } from "./context/ThemeContext";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" />
      <ThemeProvider>
        <TransactionProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-money" element={<AddMoney />} />
              <Route path="/send-money" element={<SendMoney />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/security" element={<Security />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TransactionProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
