// routes/appointments.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Get all appointments
// GET /appointments?page=1&limit=3
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  const totalAppointments = await Appointment.countDocuments();
  const totalPages = Math.ceil(totalAppointments / limit);

  const data = await Appointment.find().skip(skip).limit(limit);
  res.json({ data, totalPages, totalAppointments });
});
//Appoinment avalible slot
router.get("/available-slots", async (req, res) => {
  const { doctorName, date } = req.query;
  const start = 9; // 9:00 AM
  const end = 17; // 5:00 PM

  const allSlots = [];
  for (let h = start; h < end; h++) {
    allSlots.push(`${h.toString().padStart(2, "0")}:00`);
    allSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  const appointments = await Appointment.find({ doctorName, date });
  const bookedTimes = appointments.map((a) => a.time);

  const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));
  res.json({ availableSlots });
});

// Add new appointment
router.route("/add").post((req, res) => {
  const { patientName, doctorName, specialty, date, time } = req.body;
  const newAppointment = new Appointment({
    patientName,
    doctorName,
    specialty,
    date,
    time,
  });

  newAppointment
    .save()
    .then((savedAppointment) => res.json(savedAppointment))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Update appointment data
router.route("/update/:id").post((req, res) => {
  Appointment.findById(req.params.id)
    .then((appointment) => {
      appointment.patientName = req.body.patientName;
      appointment.doctorName = req.body.doctorName;
      appointment.specialty = req.body.specialty;
      appointment.date = req.body.date;
      appointment.time = req.body.time;

      appointment
        .save()
        .then(() => res.json("Appointment updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Delete appointment
router.route("/delete/:id").delete((req, res) => {
  Appointment.findByIdAndDelete(req.params.id)
    .then(() => res.json("Appointment deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
