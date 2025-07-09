import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/Appointment.css";
import AppointmentCard from "./components/AppointmentCard";
import { useAuth } from "./components/Authcontect"; // adjust the path if needed

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useAuth();

  const [totalAppointments, setTotalAppointments] = useState(0);

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    specialty: "",
    doctorName: "",
    date: "",
    time: "",
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all appointments + specialties
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const appointmentsPerPage = 2;

  const capitalizeFirst = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    fetchAppointments();
    fetchSpecialties();
  }, [currentPage]);
  useEffect(() => {
    if (newAppointment.doctorName && newAppointment.date) {
      axios
        .get("http://localhost:5000/appointments/available-slots", {
          params: {
            doctorName: newAppointment.doctorName,
            date: newAppointment.date,
          },
        })
        .then((res) => setAvailableSlots(res.data.availableSlots))
        .catch((err) => console.error("Error fetching slots", err));
    } else {
      setAvailableSlots([]); //  Clear slots when doctor/date are cleared
    }
  }, [newAppointment.doctorName, newAppointment.date]);

  const fetchAppointments = () => {
    axios
      .get("http://localhost:5000/appointments", {
        params: {
          page: currentPage,
          limit: appointmentsPerPage,
        },
      })
      .then((res) => {
        const { data, totalPages, totalAppointments } = res.data;
        setAppointments(Array.isArray(data) ? data : []);
        setTotalPages(totalPages || 1);
        setTotalAppointments(totalAppointments || 0); // ✅ update count
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  };

  const fetchSpecialties = () => {
    axios
      .get("http://localhost:5000/doctors/specialties")
      .then((res) => setSpecialties(res.data))
      .catch((err) => console.error("Error fetching specialties:", err));
  };

  useEffect(() => {
    const specialty = isEditMode
      ? selectedAppointment?.specialty
      : newAppointment.specialty;

    if (specialty) {
      axios
        .get("http://localhost:5000/doctors", {
          params: { specialty },
        })
        .then((res) => setFilteredDoctors(res.data.data || res.data))
        .catch((err) =>
          console.error("Error fetching doctors by specialty:", err)
        );
    } else {
      setFilteredDoctors([]);
    }
  }, [isEditMode, newAppointment.specialty, selectedAppointment?.specialty]);
  useEffect(() => {
    if (
      isEditMode &&
      selectedAppointment?.doctorName &&
      selectedAppointment?.date
    ) {
      axios
        .get("http://localhost:5000/appointments/available-slots", {
          params: {
            doctorName: selectedAppointment.doctorName,
            date: selectedAppointment.date,
          },
        })
        .then((res) => setAvailableSlots(res.data.availableSlots))
        .catch((err) => console.error("Error fetching slots", err));
    }
  }, [isEditMode, selectedAppointment?.doctorName, selectedAppointment?.date]);

  const handleUpdateAppointment = (id, e) => {
    e.preventDefault();

    const formattedAppointment = {
      ...selectedAppointment,
      patientName: capitalizeFirst(selectedAppointment.patientName),
      doctorName: capitalizeFirst(selectedAppointment.doctorName),
      specialty: capitalizeFirst(selectedAppointment.specialty),
      time: selectedAppointment.time,
    };

    axios
      .post(
        `http://localhost:5000/appointments/update/${id}`,
        formattedAppointment
      )
      .then(() => {
        fetchAppointments();
        setSelectedAppointment(null);
        setIsEditMode(false);
        setAvailableSlots([]); // ✅ Reset available slots
      })
      .catch((error) => console.error("Error updating appointment:", error));
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const { patientName, doctorName, specialty, date, time } = newAppointment;

    axios
      .post("http://localhost:5000/appointments/add", {
        patientName: capitalizeFirst(patientName),
        doctorName: capitalizeFirst(doctorName),
        specialty: capitalizeFirst(specialty),
        date,
        time,
      })
      .then((res) => {
        fetchAppointments();
        setNewAppointment({
          patientName: "",
          specialty: "",
          doctorName: "",
          date: "",
          time: "", // ✅ Clear time
        });
        setAvailableSlots([]); // ✅ Reset time slot list
        setFilteredDoctors([]); // ✅ Optional
        setCurrentPage(1);
      })
      .catch((err) => console.error("Error adding appointment:", err));
  };

  const handleDeleteAppointment = (id) => {
    axios
      .delete(`http://localhost:5000/appointments/delete/${id}`)
      .then(() => {
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment(null);
          setIsEditMode(false);
        }
        fetchAppointments(); // keep pagination consistent
      })
      .catch((err) => console.error("Error deleting appointment:", err));
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
  };

  return (
    <div className="appointments-container">
      <div className="appointment-form-section">
        <h4>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</h4>
        <form
          className="appointment-form"
          onSubmit={
            isEditMode
              ? (e) => handleUpdateAppointment(selectedAppointment._id, e)
              : handleAddAppointment
          }
        >
          <label>Patient Name:</label>
          <input
            type="text"
            data-testid="Patient-Name"
            value={
              isEditMode
                ? selectedAppointment?.patientName
                : newAppointment.patientName
            }
            onChange={(e) =>
              isEditMode
                ? setSelectedAppointment({
                    ...selectedAppointment,
                    patientName: e.target.value,
                  })
                : setNewAppointment({
                    ...newAppointment,
                    patientName: e.target.value,
                  })
            }
          />
          <label>Specialty:</label>
          <select
            value={
              isEditMode
                ? selectedAppointment?.specialty || ""
                : newAppointment.specialty
            }
            onChange={(e) => {
              const selectedSpecialty = e.target.value;
              if (isEditMode) {
                setSelectedAppointment((prev) => ({
                  ...prev,
                  specialty: selectedSpecialty,
                  doctorName: "", // reset doctor
                }));
              } else {
                setNewAppointment((prev) => ({
                  ...prev,
                  specialty: selectedSpecialty,
                  doctorName: "", // reset doctor
                }));
              }
            }}
          >
            <option value="">Select Specialty</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label>Doctor:</label>
          <select
            value={
              isEditMode
                ? selectedAppointment?.doctorName
                : newAppointment.doctorName
            }
            onChange={(e) =>
              isEditMode
                ? setSelectedAppointment({
                    ...selectedAppointment,
                    doctorName: e.target.value,
                  })
                : setNewAppointment({
                    ...newAppointment,
                    doctorName: e.target.value,
                  })
            }
          >
            <option value="">Select Doctor</option>
            {filteredDoctors.map((doc) => (
              <option key={doc._id} value={doc.name}>
                {doc.name}
              </option>
            ))}
          </select>
          <label>Date:</label>
          <input
            type="date"
            value={
              isEditMode
                ? selectedAppointment?.date?.slice(0, 10) || ""
                : newAppointment.date
            }
            onChange={(e) =>
              isEditMode
                ? setSelectedAppointment({
                    ...selectedAppointment,
                    date: e.target.value,
                  })
                : setNewAppointment({
                    ...newAppointment,
                    date: e.target.value,
                  })
            }
          />{" "}
          <label>Time:</label>
          <select
            value={isEditMode ? selectedAppointment?.time : newAppointment.time}
            onChange={(e) =>
              isEditMode
                ? setSelectedAppointment((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                : setNewAppointment((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
            }
          >
            <option value="">Select Time Slot</option>
            {availableSlots
              .concat(
                isEditMode && selectedAppointment?.time
                  ? [selectedAppointment.time]
                  : []
              )
              .filter((slot, index, self) => self.indexOf(slot) === index) // ensure uniqueness
              .sort() // sort time options in order
              .map((slot) => (
                <option
                  key={slot}
                  value={slot}
                  disabled={
                    isEditMode &&
                    slot !== selectedAppointment?.time &&
                    !availableSlots.includes(slot)
                  }
                >
                  {slot}
                </option>
              ))}
          </select>
          <button type="submit">
            {isEditMode ? "Update Appointment" : "Add Appointment"}
          </button>
        </form>
      </div>

      <div className="appointment-list-section">
        <div className="appointments-header">
          <h3 data-testid="appointment-heading">Appointments</h3>
          <h3 className="badge bg-info">
            Total Appointments:{" "}
            <span className="badge bg-dark">{totalAppointments}</span>
          </h3>
        </div>
        <div className="appointment-list">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onEdit={handleEditAppointment}
              onDelete={handleDeleteAppointment}
              isAdmin={user?.role === "admin"}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="appointments-pagination">
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

export default Appointments;
