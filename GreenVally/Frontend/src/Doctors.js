import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "./components/DoctorCard";
import { useAuth } from "./components/Authcontect";
import "./Doctors.css";
import { useParams } from "react-router-dom";
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    experience: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [totalDoctors, setTotalDoctors] = useState(0); // total in DB
  const [filteredDoctorCount, setFilteredDoctorCount] = useState(0); // based on specialty

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const doctorsPerPage = 3;
  const { user } = useAuth();

  const { specialtyName } = useParams();
  const capitalizeFirst = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  useEffect(() => {
    if (specialtyName) {
      setSelectedSpecialty(specialtyName);
    } else {
      setSelectedSpecialty("");
    }
  }, [specialtyName]);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const params = {
        page: currentPage,
        limit: doctorsPerPage,
      };

      if (selectedSpecialty) {
        params.specialty = selectedSpecialty;
      }

      const res = await axios.get("http://localhost:5000/doctors", { params });
      console.log("Doctor API response:", res.data);
      const { data, totalPages, totalCount } = res.data;

      setDoctors(Array.isArray(data) ? data : []);
      setTotalPages(totalPages || 1);
      setFilteredDoctorCount(totalCount || 0);
      setTotalDoctors(totalCount || 0);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/doctors/specialties");
      setAllSpecialties(res.data || []);
    } catch (err) {
      console.error("Error fetching specialties", err);
    }
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const { name, specialty, experience } = newDoctor;
    axios
      .post("http://localhost:5000/doctors/add", {
        name: capitalizeFirst(name),
        specialty: capitalizeFirst(specialty),
        experience,
      })
      .then((res) => {
        setDoctors((prev) => [...prev, res.data]);
        setNewDoctor({ name: "", specialty: "", experience: "" });
      })
      .catch((err) => console.error("Add error:", err));
  };

  const handleUpdateDoctor = (id, e) => {
    e.preventDefault();
    const formattedDoctor = {
      ...selectedDoctor,
      name: capitalizeFirst(selectedDoctor.name),
      specialty: capitalizeFirst(selectedDoctor.specialty),
      experience: selectedDoctor.experience,
    };

    axios
      .post(`http://localhost:5000/doctors/update/${id}`, formattedDoctor)
      .then(() => {
        setDoctors((prev) =>
          prev.map((doc) => (doc._id === id ? formattedDoctor : doc))
        );
        setSelectedDoctor(null);
        setIsEditMode(false);
      })
      .catch((err) => console.error("Update error:", err));
  };

  const handleDeleteDoctor = (id) => {
    axios
      .delete(`http://localhost:5000/doctors/delete/${id}`)
      .then(() => {
        setDoctors((prev) => prev.filter((doc) => doc._id !== id));
        if (selectedDoctor?._id === id) {
          setSelectedDoctor(null);
          setIsEditMode(false);
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditMode(true);
  };

  const handleChange = (e, isEdit) => {
    const { name, value } = e.target;
    if (isEdit) {
      setSelectedDoctor((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewDoctor((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="doctors-container">
      {user?.role === "admin" && (
        <div className="doctor-form-section">
          <h4>{isEditMode ? "Edit Doctor" : "Add New Doctor"}</h4>
          <form
            className="doctor-form"
            onSubmit={
              isEditMode
                ? (e) => handleUpdateDoctor(selectedDoctor._id, e)
                : handleAddDoctor
            }
          >
            <label>Name:</label>
            <input
              type="text"
              name="name"
              autoComplete="off"
              className="doctor-input"
              value={isEditMode ? selectedDoctor?.name : newDoctor.name}
              onChange={(e) => handleChange(e, isEditMode)}
            />

            <label>Specialty:</label>
            <select
              name="specialty"
              className="doctor-input"
              value={
                isEditMode ? selectedDoctor?.specialty : newDoctor.specialty
              }
              onChange={(e) => handleChange(e, isEditMode)}
            >
              <option value="">Select Specialty</option>
              {allSpecialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <label>Experience:</label>
            <input
              type="text"
              name="experience"
              autoComplete="off"
              className="doctor-input"
              value={
                isEditMode ? selectedDoctor?.experience : newDoctor.experience
              }
              onChange={(e) => handleChange(e, isEditMode)}
            />

            <button type="submit" className="doctor-button">
              {isEditMode ? "Update Doctor" : "Add Doctor"}
            </button>
          </form>
        </div>
      )}

      <div className="doctor-list-section">
        <div className="doctor-list-header">
          <h3>
            {" "}
            <span className="doctor-count-badge">
              Total Doctors:{" "}
              {selectedSpecialty ? filteredDoctorCount : totalDoctors}
            </span>
          </h3>
          {user?.role !== "admin" && (
            <div className="specialty-filter">
              <label>Specialty:</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setCurrentPage(1);
                }}
                className="doctor-input"
              >
                <option value="">-- All Specialties --</option>
                {allSpecialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="doctor-list">
          {doctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onEdit={handleEditDoctor}
              onDelete={handleDeleteDoctor}
              isAdmin={user?.role === "admin"}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
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

export default Doctors;
