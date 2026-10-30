const { useState } = React;

/* ---------- Contact information (3 columns) ---------- */
function ContactInfo() {
  return (
    <section className="contact-info">
      <div className="container">
        <h1 className="page-title">Page Contact Us</h1>

        <div className="info-grid">
          <div className="info-column">
            <p className="info-label">Call Customer Services:</p>
            <p className="info-value info-value-bold">84-0123-456-789</p>
          </div>

          <div className="info-column">
            <p className="info-label">Address:</p>
            <p className="info-value">PO Box 1622 Vissasong Street West</p>
          </div>

          <div className="info-column">
            <p className="info-label">Email:</p>
            <p className="info-value">
              <a href="mailto:Support@domain.com">Support@domain.com</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Google Map ---------- */
function MapSection() {
  return (
    <section className="map-section" aria-label="Our location on the map">
      <iframe
        title="Map showing First Canadian Place, Toronto, Canada"
        src="https://www.google.com/maps?q=First+Canadian+Place,+Toronto,+Canada&output=embed"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
  );
}

/* ---------- Social media icons ---------- */
const socialLinks = [
  { id: 1, name: "Facebook", url: "https://www.facebook.com", icon: "fa-facebook-f" },
  { id: 2, name: "Twitter", url: "https://www.twitter.com", icon: "fa-twitter" },
  { id: 3, name: "Pinterest", url: "https://www.pinterest.com", icon: "fa-pinterest-p" },
  { id: 4, name: "Vimeo", url: "https://www.vimeo.com", icon: "fa-vimeo-v" },
  { id: 5, name: "Instagram", url: "https://www.instagram.com", icon: "fa-instagram" },
];

function SocialMedia() {
  return (
    <div className="social-media">
      <ul className="social-list">
        {socialLinks.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              className="social-link"
              aria-label={item.name}
              target="_blank"
              rel="noreferrer"
            >
              <i className={"fa-brands " + item.icon} aria-hidden="true"></i>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Contact form ---------- */
const emptyForm = { name: "", email: "", phone: "", message: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setSubmitted(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // stops the page from refreshing

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setFormData(emptyForm);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name" className="sr-only">Your name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="YOUR NAME"
          value={formData.name}
          onChange={handleChange}
          required
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="sr-only">Your email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="YOUR EMAIL"
          value={formData.email}
          onChange={handleChange}
          required
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="sr-only">Phone number</label>
        <input
          id="phone"
          name="phone"
          type="number"
          placeholder="PHONE NUMBER"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="sr-only">Message</label>
        <textarea
          id="message"
          name="message"
          rows="8"
          placeholder="MESSAGE"
          value={formData.message}
          onChange={handleChange}
          required
          aria-invalid={errors.message ? "true" : "false"}
        ></textarea>
        {errors.message && <p className="error-text">{errors.message}</p>}
      </div>

      <button type="submit" className="send-button">
        <i className="fa-solid fa-envelope" aria-hidden="true"></i>
        <span>SEND MESSAGE</span>
      </button>

      {submitted && (
        <p className="success-text" role="status">
          Thank you! Your message has been sent successfully.
        </p>
      )}
    </form>
  );
}

/* ---------- Main App ---------- */
function App() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <ContactInfo />
      <MapSection />

      <section className="bottom-section">
        <div className="container bottom-grid">
          <SocialMedia />
          <ContactForm />
        </div>
      </section>

      <button
        type="button"
        className="scroll-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <i className="fa-solid fa-angle-up" aria-hidden="true"></i>
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
