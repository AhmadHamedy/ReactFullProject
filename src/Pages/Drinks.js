import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../Context/MenuContext";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "http://localhost:5000/api";

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
             src={`${process.env.REACT_APP_BACKEND_URL}${item.image_url}`}
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
