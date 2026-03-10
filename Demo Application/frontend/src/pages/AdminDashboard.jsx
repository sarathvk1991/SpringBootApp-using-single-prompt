import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load users");
    }
  };

  const loadAppointments = async () => {
    try {
      const { data } = await api.get("/admin/appointments");
      setAppointments(data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load appointments");
    }
  };

  useEffect(() => {
    loadUsers();
    loadAppointments();
  }, []);

  return (
    <section>
      <h3>Admin Dashboard</h3>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <h4>Users</h4>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>

      <h4>All Appointments</h4>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {new Date(appt.appointmentTime).toLocaleString()} - {appt.status} (Dr. {appt.doctorName}
            {appt.patientName ? `, ${appt.patientName}` : ""})
          </li>
        ))}
      </ul>
    </section>
  );
}
