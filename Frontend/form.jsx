
import React, { useState } from "react";
import "./form.css";

function Form() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[A-Za-z ]+$/.test(name.trim())) {
      alert("Name mein sirf alphabets enter karo!");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number exactly 10 digits ka hona chahiye!");
      return;
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email.trim())) {
      alert("Valid @gmail.com email enter karo!");
      return;
    }

    if (!message.trim()) {
      alert("Please enter your message!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          email: email.trim(),
          message: message.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Message sent successfully!");
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      } else {
        alert(data.message || "Failed to save contact");
      }
    } 
    catch (error) {
  console.error("Connection Error:", error);
  alert("Connection failed: " + error.message);
}
  };

  return (
    <main className="contact-page">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-row">
          <input
            type="text"
            placeholder="YOUR NAME"
            aria-label="Your Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value.replace(/[^A-Za-z ]/g, ""))
            }
            required
          />

          <input
            type="email"
            placeholder="YOUR EMAIL"
            aria-label="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <input
          className="full-field"
          type="tel"
          placeholder="PHONE NUMBER"
          aria-label="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          maxLength={10}
          inputMode="numeric"
          required
        />

        <textarea
          className="message-field"
          placeholder="MESSAGE"
          aria-label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <div className="button-row">
          <button className="send-button" type="submit">
            <span className="mail-icon">✉</span>
            <span>SEND MESSAGE</span>
          </button>
        </div>
      </form>
    </main>
  );
}

export default Form;
