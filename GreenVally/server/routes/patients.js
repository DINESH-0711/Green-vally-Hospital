// routes/patients.js

const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// Get all patients
// GET /patients?page=1&limit=5
router.route("/").get(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  try {
    const totalPatients = await Patient.countDocuments();
    const patients = await Patient.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: patients,
      totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
    });
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Add new patient
router.route("/add").post((req, res) => {
  const { name, age, gender } = req.body;

  const newPatient = new Patient({ name, age, gender });

  newPatient
    .save()
    .then((savedPatient) => res.json(savedPatient))
    .catch((err) => res.status(400).json("Error: " + err));
});
// Update patient data
router.route("/update/:id").put((req, res) => {
  console.log("hihhhhiuhiihihiuhiuh");
  Patient.findById(req.params.id)
    .then((patient) => {
      if (!patient) {
        return res.status(404).json("Patient not found");
      }
      patient.name = req.body.name;
      patient.age = req.body.age;
      patient.gender = req.body.gender;
      patient
        .save()
        .then(() => res.json("Patient updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
// Delete patient by ID
router.route("/delete/:id").delete((req, res) => {
  Patient.findByIdAndDelete(req.params.id)
    .then((patient) => {
      if (!patient) {
        return res.status(404).json("Patient not found");
      }
      res.json("Patient deleted!");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
module.exports = router;
