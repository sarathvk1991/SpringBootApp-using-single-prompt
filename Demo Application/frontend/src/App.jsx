import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name")
  });

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, name: null });
  };

  const getHomeRoute = () => {
    if (auth.role === "ADMIN") {
      return "/admin";
    }
    if (auth.role === "DOCTOR") {
      return "/doctor";
    }
    if (auth.role === "PATIENT") {
      return "/patient";
    }
    return "/login";
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: "1.5rem" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h2>Smart Appointment Booking</h2>
        <nav style={{ display: "flex", gap: "1rem" }}>
          {!auth.token && <Link to="/login">Login</Link>}
          {!auth.token && <Link to="/register">Register</Link>}
          {auth.role === "ADMIN" && <Link to="/admin">Admin</Link>}
          {auth.role === "DOCTOR" && <Link to="/doctor">Doctor</Link>}
          {auth.role === "PATIENT" && <Link to="/patient">Patient</Link>}
          {auth.token && <button onClick={logout}>Logout</button>}
        </nav>
        {auth.name && <p>Signed in as {auth.name}</p>}
      </header>

      <Routes>
        <Route path="/" element={<Navigate to={getHomeRoute()} />} />
        <Route
          path="/login"
          element={auth.token ? <Navigate to={getHomeRoute()} /> : <Login setAuth={setAuth} />}
        />
        <Route
          path="/register"
          element={auth.token ? <Navigate to={getHomeRoute()} /> : <Register setAuth={setAuth} />}
        />
        <Route
          path="/admin"
          element={
            auth.token && auth.role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/doctor"
          element={
            auth.token && auth.role === "DOCTOR" ? <DoctorDashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/patient"
          element={
            auth.token && auth.role === "PATIENT" ? <PatientDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}
