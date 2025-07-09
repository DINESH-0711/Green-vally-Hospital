// src/components/PatientCard.js

import React from "react";
import "./PatientsCard.css";

const PatientCard = ({ patient, onEdit, onDelete }) => {
  return (
    <div className="patient-card">
      <div className="patient-card-right">
        <div className="patient-name">
          {" "}
          <strong>Name:</strong>
          {patient.name}
        </div>
        <div className="patient-age">
          {" "}
          <strong>Age:</strong> {patient.age}
        </div>
        <div className="patient-gender">
          {" "}
          <strong>Gender:</strong> {patient.gender}
        </div>

        <div className="patient-card-actions">
          <button className="edit-btn" onClick={() => onEdit(patient)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(patient._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
