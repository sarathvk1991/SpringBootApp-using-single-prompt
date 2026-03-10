import React from "react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App.jsx";

vi.mock("./api.js", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] }))
  }
}));

const renderWithRoute = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows login when unauthenticated", () => {
    renderWithRoute("/login");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated users from admin to login", () => {
    renderWithRoute("/admin");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated users from doctor to login", () => {
    renderWithRoute("/doctor");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("redirects unauthenticated users from patient to login", () => {
    renderWithRoute("/patient");
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("redirects authenticated admin from login to admin dashboard", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "ADMIN");
    localStorage.setItem("name", "Admin User");

    renderWithRoute("/login");
    expect(screen.getByRole("heading", { name: /admin dashboard/i })).toBeInTheDocument();
  });

  it("redirects authenticated doctor from login to doctor dashboard", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "DOCTOR");
    localStorage.setItem("name", "Dr. Alice");

    renderWithRoute("/login");
    expect(screen.getByRole("heading", { name: /doctor dashboard/i })).toBeInTheDocument();
  });

  it("redirects authenticated patient from login to patient dashboard", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "PATIENT");
    localStorage.setItem("name", "John Patient");

    renderWithRoute("/login");
    expect(screen.getByRole("heading", { name: /patient dashboard/i })).toBeInTheDocument();
  });

  it("hides login and register links when authenticated", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "ADMIN");
    localStorage.setItem("name", "Admin User");

    renderWithRoute("/admin");
    expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /register/i })).not.toBeInTheDocument();
  });

  it("shows signed-in name when authenticated", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "ADMIN");
    localStorage.setItem("name", "Admin User");

    renderWithRoute("/admin");
    expect(screen.getByText(/signed in as admin user/i)).toBeInTheDocument();
  });

  it("redirects to the role home from root", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "DOCTOR");
    localStorage.setItem("name", "Dr. Alice");

    renderWithRoute("/");
    expect(screen.getByRole("heading", { name: /doctor dashboard/i })).toBeInTheDocument();
  });

  it("logs out and returns to login", () => {
    localStorage.setItem("token", "test-token");
    localStorage.setItem("role", "ADMIN");
    localStorage.setItem("name", "Admin User");

    renderWithRoute("/admin");
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
