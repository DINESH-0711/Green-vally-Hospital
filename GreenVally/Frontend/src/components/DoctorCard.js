import React from "react";
import "./Doctorcard.css";
import { FaClock, FaGlobe } from "react-icons/fa";
import docimg from "../assests/docbc.png";

const DoctorCard = ({ doctor, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-card-left">
        <img src={docimg} alt={doctor.name} className="doctor-image" />
      </div>

      <div className="doctor-card-right">
        <h3 className="doctor-name">Dr {doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        <p className="doctor-experience">
          <strong>{doctor.experience}</strong> years experience
        </p>
        <p className="doctor-education">
          Mch (Magister Chirurgiae) 2011-2013, Fellowship in Cardiothoracic
          Surgery, Auckland, NZ
        </p>

        <div className="doctor-languages">
          <FaGlobe /> &nbsp; English • Hindi • Gujarati
        </div>

        <div className="doctor-timings">
          <FaClock /> &nbsp; 09:00 - 13:00 • Mon - Sat
        </div>

        {isAdmin && (
          <div className="doctor-card-actions">
            <button onClick={() => onEdit(doctor)} className="edit-btn">
              Edit
            </button>
            <button onClick={() => onDelete(doctor._id)} className="delete-btn">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
