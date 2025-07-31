import React, { useState, useEffect, useMemo, useRef } from "react";
import "./BillingForm.css";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const BillingModal = ({ patient = {}, onClose }) => {
  const [form, setForm] = useState({
    consultationFee: "",
    treatmentCharges: "",
    medicineCharges: "",
    paymentStatus: "Unpaid",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [bills, setBills] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Printing controls
  const [printContext, setPrintContext] = useState("none"); // "none" | "invoice" | "history" | "specific"
  const [billToPrint, setBillToPrint] = useState(null);

  useEffect(() => {
    if (!patient?._id) return;
    fetch(`http://localhost:5000/billings/patient/${patient._id}`)
      .then((res) => res.json())
      .then((data) => setBills(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch billing history:", err));
  }, [patient]);

  useEffect(() => {
    // Reset print context after printing
    const after = () => {
      setPrintContext("none");
      setBillToPrint(null);
    };
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "consultationFee",
      "treatmentCharges",
      "medicineCharges",
    ];
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name)
        ? value === ""
          ? ""
          : Number(value)
        : value,
    }));
  };

  const validate = () => {
    const e = {};
    ["consultationFee", "treatmentCharges", "medicineCharges"].forEach((f) => {
      const v = form[f];
      if (v === "" || v === null || v === undefined) e[f] = "Required";
      else if (Number.isNaN(Number(v))) e[f] = "Must be a number";
      else if (Number(v) < 0) e[f] = "Cannot be negative";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const totals = useMemo(() => {
    const c = Number(form.consultationFee || 0);
    const t = Number(form.treatmentCharges || 0);
    const m = Number(form.medicineCharges || 0);
    return { c, t, m, subtotal: c + t + m };
  }, [form]);

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!patient?._id) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        totalAmount: totals.subtotal,
        patientId: patient._id,
      };

      const response = await fetch("http://localhost:5000/billings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add billing");

      const data = await response.json();
      setBills((prev) => [data, ...prev]);
      setForm({
        consultationFee: "",
        treatmentCharges: "",
        medicineCharges: "",
        paymentStatus: "Unpaid",
        notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Billing error:", error.message);
      alert("Failed to add billing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Print buttons
  const handlePrintInvoicePreview = () => {
    setPrintContext("invoice");
    // allow DOM to apply data attribute before print
    setTimeout(() => window.print(), 50);
  };

  const handlePrintAllHistory = () => {
    setPrintContext("history");
    setTimeout(() => window.print(), 50);
  };

  const handlePrintBill = (bill) => {
    setBillToPrint(bill);
    setPrintContext("specific");
    setTimeout(() => window.print(), 50);
  };

  return (
    <div className="modal-backdrop">
      {/* data-print lets CSS decide what to show in print */}
      <div className="modal-box" data-print={printContext}>
        {/* Header */}
        <div className="modal-header header-colored">
          <div className="hospital-header-text">
            <h2>Green Vally Hospital</h2>
            <div className="hospital-meta">
              12, Health Park Road, Chennai 600001 · +91 98765 43210
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Patient banner */}
        <div className="patient-banner">
          <div>
            <div className="muted">Billing for</div>
            <div className="patient-name">{patient?.name || "Unknown"}</div>
            <div className="muted">Patient ID: {patient?._id || "-"}</div>
          </div>
          <div className="banner-right">
            <div className="muted">Date</div>
            <div>{new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid-2">
          {/* Billing form */}
          <div className="card">
            <h3>Create New Bill</h3>

            <label className="field">
              Consultation Fee (₹)
              <input
                type="number"
                name="consultationFee"
                value={form.consultationFee}
                onChange={handleChange}
              />
              {errors.consultationFee && (
                <div className="error">{errors.consultationFee}</div>
              )}
            </label>

            <label className="field">
              Treatment Charges (₹)
              <input
                type="number"
                name="treatmentCharges"
                value={form.treatmentCharges}
                onChange={handleChange}
              />
              {errors.treatmentCharges && (
                <div className="error">{errors.treatmentCharges}</div>
              )}
            </label>

            <label className="field">
              Medicine Charges (₹)
              <input
                type="number"
                name="medicineCharges"
                value={form.medicineCharges}
                onChange={handleChange}
              />
              {errors.medicineCharges && (
                <div className="error">{errors.medicineCharges}</div>
              )}
            </label>

            <label className="field">
              Payment Status
              <select
                name="paymentStatus"
                value={form.paymentStatus}
                onChange={handleChange}
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </label>

            <div className="totals">
              <div>
                {" "}
                Total: <strong>{inr.format(totals.subtotal)}</strong>{" "}
              </div>
              <button
                className="primary-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Add Bill"}
              </button>
            </div>
          </div>

          {/* Receipt Preview (prints only when printContext="invoice") */}
          <div className="card">
            <h3>Receipt Preview</h3>
            <div className="print-preview">
              <div className="invoice-header">
                <h2 className="invoice-hospital">Green Vally Hospital</h2>
                <p className="invoice-meta">
                  12, Health Park Road, Chennai 600001
                </p>
                <p className="invoice-meta">
                  Phone: +91 98765 43210 · Email: info@gvhospital.in
                </p>
                <hr />
              </div>
              <div className="invoice-patient">
                <p>
                  <strong>Patient Name:</strong> {patient?.name || "-"}
                </p>
                <p>
                  <strong>Patient ID:</strong> {patient?._id || "-"}
                </p>
                <p>
                  <strong>Bill Date:</strong> {new Date().toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {form.paymentStatus}
                </p>
              </div>
              <hr />
              <div className="invoice-items">
                <p>Consultation Fee: {inr.format(totals.c)}</p>
                <p>Treatment Charges: {inr.format(totals.t)}</p>
                <p>Medicine Charges: {inr.format(totals.m)}</p>
                <hr />
                <h3>Total: {inr.format(totals.subtotal)}</h3>
              </div>
              {form.notes && (
                <div className="invoice-notes">
                  <strong>Notes:</strong>
                  <p>{form.notes}</p>
                </div>
              )}
              <div className="invoice-footer">
                <p>
                  Thank you for visiting Green Vally Hospital. Get well soon!
                </p>
              </div>
            </div>
            <button
              className="secondary-btn no-print"
              onClick={handlePrintInvoicePreview}
            >
              Print Invoice
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="card">
          <div className="history-header">
            <h3>Billing History</h3>
            {bills.length > 0 && (
              <button
                className="secondary-btn no-print"
                onClick={handlePrintAllHistory}
              >
                Print All History
              </button>
            )}
          </div>

          {bills.length === 0 ? (
            <p className="muted">No bills yet.</p>
          ) : (
            <div className="print-history-area">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id}>
                      <td>
                        {bill.date
                          ? new Date(bill.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{inr.format(Number(bill.totalAmount || 0))}</td>
                      <td>
                        <span
                          className={`badge ${bill.paymentStatus?.toLowerCase()}`}
                        >
                          {bill.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className="secondary-btn no-print"
                          onClick={() => handlePrintBill(bill)}
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="footer-actions">
          <button className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Specific bill print template (hidden on screen, printed only when printContext="specific") */}
        {billToPrint && (
          <div className="print-specific">
            <div className="invoice-header">
              <h2 className="invoice-hospital">Green Vally Hospital</h2>
              <p className="invoice-meta">
                12, Health Park Road, Chennai 600001
              </p>
              <p className="invoice-meta">
                Phone: +91 98765 43210 · Email: info@gvhospital.in
              </p>
              <hr />
            </div>
            <div className="invoice-patient">
              <p>
                <strong>Patient Name:</strong> {patient?.name || "-"}
              </p>
              <p>
                <strong>Patient ID:</strong> {patient?._id || "-"}
              </p>
              <p>
                <strong>Bill Date:</strong>{" "}
                {billToPrint.date
                  ? new Date(billToPrint.date).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Status:</strong> {billToPrint.paymentStatus}
              </p>
            </div>
            <hr />
            <div className="invoice-items">
              <p>
                Consultation Fee:{" "}
                {inr.format(Number(billToPrint.consultationFee || 0))}
              </p>
              <p>
                Treatment Charges:{" "}
                {inr.format(Number(billToPrint.treatmentCharges || 0))}
              </p>
              <p>
                Medicine Charges:{" "}
                {inr.format(Number(billToPrint.medicineCharges || 0))}
              </p>
              <hr />
              <h3>Total: {inr.format(Number(billToPrint.totalAmount || 0))}</h3>
            </div>
            {billToPrint.notes && (
              <div className="invoice-notes">
                <strong>Notes:</strong>
                <p>{billToPrint.notes}</p>
              </div>
            )}
            <div className="invoice-footer">
              <p>Thank you for visiting Green Vally Hospital. Get well soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingModal;
