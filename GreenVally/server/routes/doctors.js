const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET all or filtered doctors
// Supports: ?specialty=Cardiology OR ?specialties=Cardiology,Dermatology
// Example: /doctors?specialties=Cardiology,Neurology&page=1&limit=3
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  const { specialty, specialties } = req.query;

  let filter = {};

  if (specialties) {
    const specialtyList = specialties.split(",").map((s) => s.trim());
    filter.specialty = { $in: specialtyList };
  } else if (specialty) {
    filter.specialty = { $regex: new RegExp("^" + specialty + "$", "i") };
  }

  try {
    const total = await Doctor.countDocuments(filter);
    const doctors = await Doctor.find(filter).skip(skip).limit(limit);

    res.json({
      data: doctors,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET distinct specialties
// Example: GET /doctors/specialties
router.get("/specialties", async (req, res) => {
  try {
    const specialties = await Doctor.distinct("specialty");
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch specialties." });
  }
});

// POST add new doctor
// Body: { name, specialty, experience }
router.post("/add", (req, res) => {
  const { name, specialty, experience } = req.body;

  const newDoctor = new Doctor({ name, specialty, experience });

  newDoctor
    .save()
    .then((savedDoctor) => res.json(savedDoctor))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// POST update doctor by ID
// URL: /doctors/update/:id
router.post("/update/:id", (req, res) => {
  Doctor.findById(req.params.id)
    .then((doctor) => {
      if (!doctor) return res.status(404).json({ error: "Doctor not found" });

      doctor.name = req.body.name;
      doctor.specialty = req.body.specialty;
      doctor.experience = req.body.experience;

      return doctor.save();
    })
    .then(() => res.json({ message: "Doctor updated!" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// DELETE doctor by ID
// URL: /doctors/delete/:id
router.delete("/delete/:id", (req, res) => {
  Doctor.findByIdAndDelete(req.params.id)
    .then((doctor) => {
      if (!doctor) return res.status(404).json({ error: "Doctor not found" });
      res.json({ message: "Doctor deleted!" });
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
