import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../Context/MenuContext";

const BACKEND_URL = "http://localhost:5000";

export default function Drinks() {
  const { sortedMenu } = useMenu();

  const drinks = sortedMenu.filter(
    (item) => item.category === "drinks"
  );

  return (
    <div className="page">
      <h2 className="page-title">Prime Bite Drinks</h2>

      <div className="menu-grid">
        {drinks.map((item) => (
          <Link to={`/menu/${item.id}`} key={item.id} className="menu-card">
            <img
              src={`${BACKEND_URL}${item.image_url}`}
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
