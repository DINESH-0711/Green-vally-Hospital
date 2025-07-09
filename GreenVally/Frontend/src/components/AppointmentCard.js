import React from "react";
const AppointmentCard = ({ appointment, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="appointment-card">
      <p>
        {" "}
        <strong>Name:</strong>
        {appointment.patientName}
      </p>
      <p>
        <strong>Doctor:</strong> {appointment.doctorName}
      </p>
      <p>
        <strong>Specialty:</strong> {appointment.specialty}
      </p>
      <p>
        <strong>Date:</strong> {appointment.date}
      </p>
      <p>
        <strong>Time:</strong> {appointment.time}
      </p>

      {/* Only show buttons if admin */}
      {isAdmin && (
        <div className="button-group">
          <button
            onClick={() => onEdit(appointment)}
            className="btn btn-sm btn-primary"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(appointment._id)}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
