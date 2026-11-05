import React from "react";
import logo3 from "../images/model.png";
import "../css/home.css";

function Home() {
  return (
    <div className="home">
      <div className="back">
        <div className="divleft">
          <h1>
            Perfect Workout <br />
            Coach For <span className="blue-text">Body Shape</span>
          </h1>
          <p>
            Quisque leo augue, lobortis ac tellus nec, posuere ultricies nulla.
            Praesent massa odio, pellentesque in consectetur quis, volutpat sit amet erat.
          </p>
          <button className="learn-btn">Learn More</button>
        </div>

        <div className="divright">
          <div className="blue-shape"></div>
          <img src={logo3} alt="Fitness Coach" className="coach-img" />
        </div>
      </div>
      <div className="booking-bar">
        <div className="booking-item">
          <span className="icon">📍</span>
          <span>Choose Your Location</span>
        </div>
        <div className="booking-item">
          <span className="icon">📅</span>
          <span>Choose Visiting Date</span>
        </div>
        <div className="booking-item">
          <span className="icon">🏋️</span>
          <span>Choose Your Gym</span>
        </div>
        <div className="booking-item">
          <span className="icon">👤</span>
          <span>Choose Your Gym Coach</span>
        </div>
        <button className="book-btn">Book Your Appointment</button>
      </div>
    </div>
  );
}

export default Home;