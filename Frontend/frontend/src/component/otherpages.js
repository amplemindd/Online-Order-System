import React from 'react';
import '../css/otherpages.css'

function Otherpages() {
  const plans = [
    {
      name: "BROWNS",
      icon: "🏋️",
      price: "25.99",
      features: [
        "Personal Trainer",
        "Service Locker Room",
        "Fitness Assessment",
        "Morning Slot",
        "Yoga Classes",
        "Health Checkup",
      ],
    },
    {
      name: "SLIVER",
      icon: "💪",
      price: "99.99",
      features: [
        "Personal Trainer",
        "Service Locker Room",
        "Fitness Assessment",
        "Morning Slot",
        "Yoga Classes",
        "Health Checkup",
      ],
    },
    {
      name: "GOLD",
      icon: "🏆",
      price: "149.99",
      features: [
        "Personal Trainer",
        "Service Locker Room",
        "Fitness Assessment",
        "Morning Slot",
        "Yoga Classes",
        "Health Checkup",
      ],
    },
  ];

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {plans.map((plan, index) => (
          <div className="pricing-card" key={index}>
          
            <div className="card-top">
              <h2>{plan.name}</h2>
              <div className="plan-icon">{plan.icon}</div>
              <div className="wave"></div>
            </div>

            <ul className="features-list">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>


            <div className="price">
              <span className="amount">${plan.price}</span>
              <span className="period"> / Month</span>
            </div>

    
            <button className="choose-btn">Choose Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Otherpages;