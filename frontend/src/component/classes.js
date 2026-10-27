import React, { useState } from "react";
import '../css/classes.css'

function Classes() {
  const [activeDay, setActiveDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const schedule = {
    Monday: [
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
    ],
    Tuesday: [
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
    ],
    Wednesday: [
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
    ],
    Thursday: [
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
    ],
    Friday: [
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
    ],
    Saturday: [
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
    ],
    Sunday: [
      { icon: "🥊", title: "Boxing", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🥋", title: "Karate", trainer: "Keaf Shen", time: "06AM-08AM" },
      { icon: "🏋️", title: "Body Building", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🤸", title: "Aerobics & Skipping", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🏃", title: "Cardio", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "⚖️", title: "Weight Loose", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "🧘", title: "Yoga", trainer: "Rachel Adam", time: "06AM-08AM" },
      { icon: "💪", title: "Crossfit", trainer: "Lefew D. Loee", time: "06AM-08AM" },
    ],
  };

  const currentClasses = schedule[activeDay];

  return (
    <div className="classes-page">

      <div className="days-tabs">
        {days.map((day) => (
          <button
            key={day}
            className={`day-btn ${activeDay === day ? "active" : ""}`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="classes-grid">
        {currentClasses.map((item, index) => (
          <div className="class-card" key={index}>
            <div className="class-icon">
              <span>{item.icon}</span>
            </div>
            <h3>{item.title}</h3>
            <p className="trainer">{item.trainer}</p>
            <span className="time-badge">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Classes;