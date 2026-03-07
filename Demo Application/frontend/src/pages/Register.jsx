import React, { useState } from "react";
import api from "../api.js";

export default function Register({ setAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      setAuth({ token: data.token, role: data.role, name: data.name });
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <section>
      <h3>Register</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>
        <button type="submit">Create account</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </section>
  );
}
