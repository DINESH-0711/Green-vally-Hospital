import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "../components/Authcontect";
import { AppContent } from "../App"; // 👈 Correct import from App.js

const LocationLogger = () => {
  const location = useLocation();
  console.log("🚀 Current Route:", location.pathname);
  return <span data-testid="location">{location.pathname}</span>;
};
describe("App Component", () => {
  test("renders navbar with brand name", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText("Green Valley Hospital")).toBeInTheDocument();
  });

  test("shows Login link if not logged in", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });

  test("redirects to login when accessing protected route while unauthenticated", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/appointments"]}>
          <AppContent />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
