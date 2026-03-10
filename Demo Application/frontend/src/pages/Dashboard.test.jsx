import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard.jsx";
import DoctorDashboard from "./DoctorDashboard.jsx";
import PatientDashboard from "./PatientDashboard.jsx";
import api from "../api.js";

vi.mock("../api.js", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe("Dashboard UI", () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
  });

  it("renders admin data from API", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/admin/users") {
        return Promise.resolve({ data: [{ id: 1, name: "Admin User", email: "admin@clinic.com", role: "ADMIN" }] });
      }
      if (url === "/admin/appointments") {
        return Promise.resolve({
          data: [
            {
              id: 10,
              appointmentTime: new Date().toISOString(),
              status: "AVAILABLE",
              doctorName: "Dr. Alice",
              patientName: null
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(<AdminDashboard />);

    expect(await screen.findByText(/admin user/i)).toBeInTheDocument();
    expect(await screen.findByText(/dr\. alice/i)).toBeInTheDocument();
  });

  it("submits a doctor slot creation", async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({ data: {} });

    const { container } = render(<DoctorDashboard />);

    const input = container.querySelector('input[type="datetime-local"]');
    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { value: "2026-03-11T10:30" } });
    fireEvent.submit(screen.getByRole("button", { name: /create slot/i }).closest("form"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/appointments/slots", { appointmentTime: "2026-03-11T10:30" });
    });
  });

  it("shows patient actions and calls cancel", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/appointments/available") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              appointmentTime: new Date().toISOString(),
              doctorName: "Dr. Alice",
              status: "AVAILABLE"
            }
          ]
        });
      }
      if (url === "/appointments/mine") {
        return Promise.resolve({
          data: [
            {
              id: 2,
              appointmentTime: new Date().toISOString(),
              doctorName: "Dr. Alice",
              status: "BOOKED"
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ data: {} });

    render(<PatientDashboard />);

    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/appointments/2/cancel");
    });
  });

  it("reschedules a booked appointment", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/appointments/available") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              appointmentTime: new Date().toISOString(),
              doctorName: "Dr. Alice",
              status: "AVAILABLE"
            }
          ]
        });
      }
      if (url === "/appointments/mine") {
        return Promise.resolve({
          data: [
            {
              id: 2,
              appointmentTime: new Date().toISOString(),
              doctorName: "Dr. Alice",
              status: "BOOKED"
            }
          ]
        });
      }
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ data: {} });

    render(<PatientDashboard />);

    const select = await screen.findByRole("combobox");
    fireEvent.change(select, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: /reschedule/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/appointments/2/reschedule", { newSlotId: 1 });
    });
  });

  it("shows booking notification notice", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/appointments/available") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              appointmentTime: new Date().toISOString(),
              doctorName: "Dr. Alice",
              status: "AVAILABLE"
            }
          ]
        });
      }
      if (url === "/appointments/mine") {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });
    api.post.mockResolvedValue({ data: {} });

    render(<PatientDashboard />);

    const bookButton = await screen.findByRole("button", { name: /book/i });
    fireEvent.click(bookButton);

    expect(
      await screen.findByText(/booking confirmed\. notifications sent to doctor and patient\./i)
    ).toBeInTheDocument();
  });
});
