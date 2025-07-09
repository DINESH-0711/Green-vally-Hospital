// src/components/Patients.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "../PatientCard";
import "./Patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const patientsPerPage = 2;
  const [totalPatients, setTotalPatients] = useState(0);
  useEffect(() => {
    axios
      .get("http://localhost:5000/patients")
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  const fetchPatients = () => {
    axios
      .get("http://localhost:5000/patients", {
        params: {
          page: currentPage,
          limit: patientsPerPage,
        },
      })
      .then((res) => {
        setPatients(Array.isArray(res.data.data) ? res.data.data : []);
        setTotalPages(res.data.totalPages || 1);
        setTotalPatients(res.data.totalPatients || 0);
      })
      .catch((error) => console.error("Error fetching patients:", error));
  };

  const capitalizeName = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleAddPatient = (e) => {
    e.preventDefault();

    const formattedPatient = {
      ...newPatient,
      name: capitalizeName(newPatient.name),
    };

    axios
      .post("http://localhost:5000/patients/add", formattedPatient)
      .then((response) => {
        setPatients([...patients, response.data]);
        setNewPatient({ name: "", age: "", gender: "" });
      })
      .catch((error) => console.error("Error adding patient:", error));
  };

  const handleUpdatePatient = (id, e) => {
    e.preventDefault();

    const formattedPatient = {
      ...selectedPatient,
      name: capitalizeName(selectedPatient.name),
    };

    axios
      .put(`http://localhost:5000/patients/update/${id}`, formattedPatient)
      .then(() => {
        setPatients(
          patients.map((patient) =>
            patient._id === id ? { ...formattedPatient, _id: id } : patient
          )
        );
        setSelectedPatient(null);
        setIsEditMode(false);
      })
      .catch((error) => console.error("Error updating patient:", error));
  };

  const handleDeletePatient = (id) => {
    axios
      .delete(`http://localhost:5000/patients/delete/${id}`)
      .then(() => {
        if (selectedPatient && selectedPatient._id === id) {
          setSelectedPatient(null);
          setIsEditMode(false);
        }
        setPatients(patients.filter((patient) => patient._id !== id));
      })
      .catch((error) => console.error("Error deleting patient:", error));
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsEditMode(true);
  };

  return (
    <div className="patient-main">
      <div className="form-sections">
        <h4>{isEditMode ? "Edit Patient" : "Add New Patient"}</h4>
        <form
          onSubmit={
            isEditMode
              ? (e) => handleUpdatePatient(selectedPatient._id, e)
              : handleAddPatient
          }
        >
          <label>Name:</label>
          <input
            type="text"
            autoComplete="off"
            value={isEditMode ? selectedPatient.name : newPatient.name}
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    name: e.target.value,
                  })
                : setNewPatient({ ...newPatient, name: e.target.value })
            }
          />
          <label>Age:</label>
          <input
            type="text"
            autoComplete="off"
            value={isEditMode ? selectedPatient.age : newPatient.age}
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    age: e.target.value,
                  })
                : setNewPatient({ ...newPatient, age: e.target.value })
            }
          />
          <label>Gender:</label>
          <input
            type="text"
            autoComplete="off"
            value={isEditMode ? selectedPatient.gender : newPatient.gender}
            onChange={(e) =>
              isEditMode
                ? setSelectedPatient({
                    ...selectedPatient,
                    gender: e.target.value,
                  })
                : setNewPatient({ ...newPatient, gender: e.target.value })
            }
          />
          <button type="submit">
            {isEditMode ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      </div>

      <div className="patients-section">
        <h4 className="badge bg-info">
          Total Patients: <span className="badge bg-dark">{totalPatients}</span>
        </h4>
        <div className="patient-list">
          {Array.isArray(patients) &&
            patients.map((patient) => (
              <PatientCard
                key={patient._id}
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            ))}
        </div>
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={pg === currentPage ? "active-page" : ""}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
