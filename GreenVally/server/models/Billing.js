const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: { type: Date, default: Date.now },
  consultationFee: { type: Number, required: true },
  treatmentCharges: { type: Number, required: true },
  medicineCharges: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
});

module.exports = mongoose.model("Billing", billingSchema);
