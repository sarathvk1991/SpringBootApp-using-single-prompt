import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function PatientDashboard() {
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]);
  const [error, setError] = useState("");

  const loadAvailable = async () => {
    try {
      const { data } = await api.get("/appointments/available");
      setAvailable(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load slots");
    }
  };

  const loadMine = async () => {
    try {
      const { data } = await api.get("/appointments/mine");
      setMine(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load your appointments");
    }
  };

  useEffect(() => {
    loadAvailable();
    loadMine();
  }, []);

  const book = async (id) => {
    setError("");
    try {
      await api.post(`/appointments/${id}/book`);
      loadAvailable();
      loadMine();
    } catch (err) {
      setError(err?.response?.data?.error || "Booking failed");
    }
  };

  const cancel = async (id) => {
    setError("");
    try {
      await api.post(`/appointments/${id}/cancel`);
      loadAvailable();
      loadMine();
    } catch (err) {
      setError(err?.response?.data?.error || "Cancellation failed");
    }
  };

  return (
    <section>
      <h3>Patient Dashboard</h3>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <h4>My Appointments</h4>
      <ul>
        {mine.map((appt) => (
          <li key={appt.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span>
              {new Date(appt.appointmentTime).toLocaleString()} with {appt.doctorName} - {appt.status}
            </span>
            {appt.status === "BOOKED" && <button onClick={() => cancel(appt.id)}>Cancel</button>}
          </li>
        ))}
      </ul>
      <h4>Available Slots</h4>
      <ul>
        {available.map((appt) => (
          <li key={appt.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span>
              {new Date(appt.appointmentTime).toLocaleString()} with {appt.doctorName}
            </span>
            <button onClick={() => book(appt.id)}>Book</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
