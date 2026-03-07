import React, { useState } from "react";
import api from "../api.js";

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      setAuth({ token: data.token, role: data.role, name: data.name });
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <section>
      <h3>Login</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
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
        <button type="submit">Sign in</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </section>
  );
}
