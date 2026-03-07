import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/doctor");
      setAppointments(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load appointments");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const createSlot = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/appointments/slots", { appointmentTime });
      setAppointmentTime("");
      loadAppointments();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create slot");
    }
  };

  return (
    <section>
      <h3>Doctor Dashboard</h3>
      <form onSubmit={createSlot} style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <input
          type="datetime-local"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          required
        />
        <button type="submit">Create Slot</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {new Date(appt.appointmentTime).toLocaleString()} - {appt.status}
            {appt.patientName ? ` (Booked by ${appt.patientName})` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
