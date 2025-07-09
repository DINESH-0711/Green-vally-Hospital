
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DoctorCard from './DoctorCard';
import './Specialty.css';

const Specialty = () => {
  const { name } = useParams();
  const [doctors, setDoctors] = useState([]);
  

  useEffect(() => {
    setDoctors([]);
    axios
      .get(`http://localhost:5000/doctors/specialty/${name}`)
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error('Error fetching specialty doctors:', err));
  }, [name]);

  return (
    <div className="specialty-container">
      <h2>Doctors specialized in {name}</h2>
      <div className="specialty-list">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))
        ) : (
          <p>No doctors found for this specialty.</p>
        )}
      </div>
    </div>
  );
};

export default Specialty;
