import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

const BillingHistory = ({ patientId }) => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch(`/billings/patient/${patientId}`)
      .then((res) => res.json())
      .then((data) => setBills(data));
  }, [patientId]);

  return (
    <>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Billing History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill._id}>
              <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
              <TableCell>₹{bill.totalAmount}</TableCell>
              <TableCell>{bill.paymentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default BillingHistory;
