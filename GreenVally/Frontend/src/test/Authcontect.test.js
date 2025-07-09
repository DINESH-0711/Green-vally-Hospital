// src/__tests__/AppWithAuth.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// ✅ Mock the useAuth hook to simulate login
jest.mock("../components/Authcontect", () => {
  const actual = jest.requireActual("../components/Authcontect");
  return {
    ...actual,
    useAuth: () => ({
      user: { username: "testadmin", role: "admin" },
      logout: jest.fn(),
    }),
    AuthProvider: ({ children }) => <>{children}</>,
  };
});

describe("App with logged-in user", () => {
  test("shows logout button with username", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/logout \(testadmin\)/i)).toBeInTheDocument();
  });

  test("shows Patients link for admin", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/patients/i)).toBeInTheDocument();
  });
});
