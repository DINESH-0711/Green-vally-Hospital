import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* About Us */}
        <div className="footer-column">
          <h3>About Us.</h3>
          <p>
            The healthcare arena there was a felt need of developing new as well
            as upgrading the existing functioning.
          </p>
          <div className="subscribe-box">
            <input type="email" placeholder="Enter Your Email" />
            <button>➤</button>
          </div>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className="footer-column">
          <h3>Useful Links</h3>
          <ul>
            <li>» Home</li>
            <li>» Doctors</li>
            <li>» Appoinment</li>
            <li>» About us</li>
          </ul>
        </div>

        {/* Working Time */}
        <div className="footer-column">
          <h3>Working Time</h3>
          <ul>
            <li>» Mon - Fri: 9.00am - 5.00pm</li>
            <li>» Saturday: 10.00am - 6.00pm</li>
            <li>» Sunday Closed</li>
          </ul>
        </div>

        {/* Our Address */}
        <div className="footer-column">
          <h3>Our Address</h3>
          <ul className="footer-contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i> Old Westbury 256, New
              York 11201, United States
            </li>
            <li>
              <i className="fas fa-phone"></i> + (123) 4567 8900
            </li>
            <li>
              <i className="fas fa-envelope"></i> help@domain.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Copyright | Designed by Mindsaw | All Rights Reserved</p>
        <p>
          <a href="#">Terms and Conditions</a> | <a href="#">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
