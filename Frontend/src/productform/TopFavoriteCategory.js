import React from "react";
import "../CSS/TopFavoriteCategory.css";

const categories = [
  { name: "ORANGE", color: "#E2B88A", img: "https://img.icons8.com/fluency/96/orange.png" },
  { name: "GRAPE", color: "#A9AEE0", img: "https://img.icons8.com/fluency/96/grapes.png" },
  { name: "PEACH", color: "#A8D0E0", img: "https://img.icons8.com/fluency/96/peach.png" },
  { name: "PINEAPPLE", color: "#E0D98A", img: "https://img.icons8.com/fluency/96/pineapple.png" },
  { name: "APPLE", color: "#A8C4B2", img: "https://img.icons8.com/fluency/96/apple.png" },
  { name: "TOMATO", color: "#E0A8B5", img: "https://img.icons8.com/fluency/96/tomato.png" },
];

export default function TopFavoriteCategory() {
  return (
    <div className="top-category-container">
      <h2 className="top-category-title">Top Favorite C gategory</h2>
      <p className="top-category-subtitle">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.</p>
      <div className="category-wrapper">
        {categories.map((item) => (
          <div className="category-item" key={item.name}>
            <div className="brush-circle" style={{ backgroundColor: item.color }}>
              <img src={item.img} alt={item.name} className="real-fruit-img" />
            </div>
            <p className="category-name">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}