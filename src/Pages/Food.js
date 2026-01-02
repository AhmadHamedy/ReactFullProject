import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../Context/MenuContext";

const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Food() {
  const { sortedMenu } = useMenu();

  const foodItems = sortedMenu.filter(
    (item) => item.category === "food"
  );

  return (
    <div className="page">
      <h2 className="page-title">Prime Bite Food Menu</h2>

      <div className="menu-grid">
        {foodItems.map((item) => (
          <Link to={`/menu/${item.id}`} key={item.id} className="menu-card">
            <img
              src={`${BASE_URL}${item.image_url}`}
              alt={item.name}
              className="menu-image"
            />

            <div className="menu-content">
              <h3>{item.name}</h3>
              <span className="menu-price">
                ${Number(item.price).toFixed(2)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
