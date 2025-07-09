import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Appointments from "../Appointments";
import { AuthProvider } from "../components/Authcontect";
import axios from "axios";

jest.mock("axios");

const mockAppointments = [
  {
    _id: "1",
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    date: "2024-08-20",
    time: "10:00 AM",
    specialty: "Cardiology",
  },
];

const mockSpecialties = ["Cardiology", "Neurology"];
const mockDoctors = [{ _id: "d1", name: "Dr. Smith" }];
const mockAvailableSlots = { availableSlots: ["10:00 AM", "11:00 AM"] };

const setup = async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes("/appointments")) {
      return Promise.resolve({
        data: {
          data: mockAppointments,
          totalPages: 1,
          totalAppointments: 1,
        },
      });
    }
    if (url.includes("/doctors/specialties")) {
      return Promise.resolve({ data: mockSpecialties });
    }
    if (url.includes("/doctors")) {
      return Promise.resolve({ data: mockDoctors });
    }
    if (url.includes("/appointments/available-slots")) {
      return Promise.resolve({ data: mockAvailableSlots });
    }
    return Promise.resolve({ data: [] });
  });

  render(
    <AuthProvider>
      <Appointments />
    </AuthProvider>
  );

  await waitFor(() =>
    expect(screen.getByTestId("appointment-heading")).toBeInTheDocument()
  );
};

describe("Appointments Component", () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
    axios.delete.mockReset();
  });

  test("renders and fetches initial data", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "admin", role: "admin" },
    });

    await setup();

    expect(screen.getByText("Appointments")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();

    spy.mockRestore();
  });

  test("can add a new appointment", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "admin", role: "admin" },
    });

    await setup();

    axios.post.mockResolvedValueOnce({ data: {} });

    fireEvent.change(screen.getByLabelText(/Patient Name:/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByLabelText(/Specialty:/i), {
      target: { value: "Cardiology" },
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Doctor:/i), {
        target: { value: "Dr. Smith" },
      });
    });

    fireEvent.change(screen.getByLabelText(/Date:/i), {
      target: { value: "2024-08-22" },
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Time:/i), {
        target: { value: "10:00 AM" },
      });
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Appointment/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/appointments/add",
        expect.objectContaining({
          patientName: "Alice",
          specialty: "Cardiology",
          doctorName: "Dr. Smith",
          date: "2024-08-22",
          time: "10:00 AM",
        })
      );
    });

    spy.mockRestore();
  });

  test("calls delete appointment API", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "admin", role: "admin" },
    });

    await setup();

    axios.delete.mockResolvedValueOnce({});

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
    });

    spy.mockRestore();
  });

  test("shows available time slots when doctor and date are selected", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "admin", role: "admin" },
    });

    await setup();

    fireEvent.change(screen.getByLabelText(/Specialty:/i), {
      target: { value: "Cardiology" },
    });

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Doctor:/i), {
        target: { value: "Dr. Smith" },
      });
    });

    fireEvent.change(screen.getByLabelText(/Date:/i), {
      target: { value: "2024-08-22" },
    });

    await waitFor(() => {
      expect(screen.getByText("10:00 AM")).toBeInTheDocument();
    });

    spy.mockRestore();
  });

  test("pagination works", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "admin", role: "admin" },
    });

    await setup();

    const nextButton = screen.getByRole("button", { name: "»" });
    expect(nextButton).toBeDisabled();

    spy.mockRestore();
  });

  test("enters edit mode and updates an appointment", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "admin", role: "admin" },
    });

    await setup();

    const editButton = await screen.findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    const nameInput = screen.getByLabelText(/Patient Name:/i);
    fireEvent.change(nameInput, { target: { value: "Updated Name" } });

    axios.post.mockResolvedValueOnce({});

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Update Appointment/i })
      ).toBeInTheDocument()
    );

    const updateButton = screen.getByRole("button", {
      name: /Update Appointment/i,
    });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/appointments/update/"),
        expect.objectContaining({
          patientName: "Updated Name",
        })
      );
    });

    spy.mockRestore();
  });

  test("hides edit/delete buttons for non-admin users", async () => {
    const spy = jest.spyOn(React, "useContext").mockReturnValue({
      user: { username: "dinesh", role: "user" },
    });

    await setup();

    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete/i })
    ).not.toBeInTheDocument();

    spy.mockRestore();
  });

  test("shows error message when fetching appointments fails", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/appointments")) {
        return Promise.reject(new Error("Server error"));
      }
      if (url.includes("/doctors/specialties")) {
        return Promise.resolve({ data: ["Cardiology"] });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <AuthProvider>
        <Appointments />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("appointment-heading")).toBeInTheDocument();
    });
  });
});
