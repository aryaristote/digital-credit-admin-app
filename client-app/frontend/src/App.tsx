import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Savings from "./pages/Savings";
import Credit from "./pages/Credit";
import CreditRequest from "./pages/CreditRequest";
import Notifications from "./pages/Notifications";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="savings" element={<Savings />} />
        <Route path="credit" element={<Credit />} />
        <Route path="credit/request" element={<CreditRequest />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
