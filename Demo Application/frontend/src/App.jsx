import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";

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

  return (
    <div style={{ fontFamily: "system-ui", padding: "1.5rem" }}>
      <header style={{ marginBottom: "1rem" }}>
        <h2>Smart Appointment Booking</h2>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          {auth.role === "DOCTOR" && <Link to="/doctor">Doctor</Link>}
          {auth.role === "PATIENT" && <Link to="/patient">Patient</Link>}
          {auth.token && <button onClick={logout}>Logout</button>}
        </nav>
        {auth.name && <p>Signed in as {auth.name}</p>}
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register setAuth={setAuth} />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
      </Routes>
    </div>
  );
}
