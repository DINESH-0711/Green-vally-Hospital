import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Welcome to Green Valley Hospital</h1>
        <p>Your Health, Our Priority</p>
      </div>

      <div className="about-section">
        <h2>Who We Are</h2>
        <p>
          At <strong>Green Valley Hospital</strong>, we combine compassionate
          care with cutting-edge technology to provide a seamless and secure
          experience for patients and healthcare professionals alike.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>🩺 Specialized Care</h3>
          <p>
            From Cardiology to Pediatrics, our doctors are highly qualified and
            passionate about healing.
          </p>
        </div>
        <div className="about-card">
          <h3>💻 Smart Scheduling</h3>
          <p>
            Book appointments online 24/7 with real-time availability — no phone
            calls needed.
          </p>
        </div>
        <div className="about-card">
          <h3>🔐 Admin Tools</h3>
          <p>
            Hospital staff can easily manage doctors, patients, and appointments
            through secure access.
          </p>
        </div>
        <div className="about-card">
          <h3>📱 Mobile Friendly</h3>
          <p>
            Access everything from your desktop, tablet, or mobile device —
            anytime, anywhere.
          </p>
        </div>
      </div>

      <div className="about-cta">
        <h2>We’re Here for You</h2>
        <p>
          Whether you're a patient or a healthcare provider, Green Valley
          Hospital is your trusted healthcare partner.
        </p>
      </div>
    </div>
  );
};

export default About;
