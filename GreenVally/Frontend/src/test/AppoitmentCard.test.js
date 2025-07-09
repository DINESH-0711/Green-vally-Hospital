import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AppointmentCard from "../components/AppointmentCard";

const sampleAppointment = {
  _id: "123",
  patientName: "John Doe",
  doctorName: "Dr. Smith",
  specialty: "Cardiology",
  date: "2024-08-22",
  time: "10:00 AM",
};

describe("AppointmentCard", () => {
  test("renders appointment details correctly", () => {
    render(
      <AppointmentCard
        appointment={sampleAppointment}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isAdmin={false}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Smith/)).toBeInTheDocument();
    expect(screen.getByText(/Cardiology/)).toBeInTheDocument();
    expect(screen.getByText("2024-08-22")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
  });

  test("does not show edit/delete buttons if isAdmin is false", () => {
    render(
      <AppointmentCard
        appointment={sampleAppointment}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isAdmin={false}
      />
    );

    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
  });

  test("shows edit/delete buttons if isAdmin is true", () => {
    render(
      <AppointmentCard
        appointment={sampleAppointment}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        isAdmin={true}
      />
    );

    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  test("calls onEdit when Edit button is clicked", () => {
    const handleEdit = jest.fn();

    render(
      <AppointmentCard
        appointment={sampleAppointment}
        onEdit={handleEdit}
        onDelete={jest.fn()}
        isAdmin={true}
      />
    );

    fireEvent.click(screen.getByText(/edit/i));
    expect(handleEdit).toHaveBeenCalledWith(sampleAppointment);
  });

  test("calls onDelete when Delete button is clicked", () => {
    const handleDelete = jest.fn();

    render(
      <AppointmentCard
        appointment={sampleAppointment}
        onEdit={jest.fn()}
        onDelete={handleDelete}
        isAdmin={true}
      />
    );

    fireEvent.click(screen.getByText(/delete/i));
    expect(handleDelete).toHaveBeenCalledWith("123");
  });
});
