const express = require("express");
const router = express.Router();
const Billing = require("../models/Billing");

// Create a new bill
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      consultationFee,
      treatmentCharges,
      medicineCharges,
      paymentStatus,
    } = req.body;

    const totalAmount = consultationFee + treatmentCharges + medicineCharges;

    const bill = new Billing({
      patientId,
      consultationFee,
      treatmentCharges,
      medicineCharges,
      totalAmount,
      paymentStatus,
    });
    await bill.save();

    res.status(201).json(bill);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create bill", message: error.message });
  }
});

// Get bills for a specific patient
router.get("/patient/:patientId", async (req, res) => {
  try {
    const bills = await Billing.find({ patientId: req.params.patientId }).sort({
      date: -1,
    });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

module.exports = router;
