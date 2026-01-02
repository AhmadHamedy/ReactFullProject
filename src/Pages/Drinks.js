import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../Context/MenuContext";

const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Drinks() {
  // Pull sortedMenu and loading from context
  const { sortedMenu, loading } = useMenu();

  // Filter for drinks items
  const drinksItems = sortedMenu.filter(
    (item) => item.category?.trim().toLowerCase() === "drinks"
  );

  // 1. Show loading state while fetching from the database
  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading Drinks Menu...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">Prime Bite Drinks</h2>

      {/* 2. Show message if no drinks are found */}
      {drinksItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray", marginTop: "20px" }}>
          No drinks available at the moment.
        </p>
      ) : (
        <div className="menu-grid">
          {drinksItems.map((item) => (
            <Link to={`/menu/${item.id}`} key={item.id} className="menu-card">
              <img
                src={`${BASE_URL}${item.image_url}`}
                alt={item.name}
                className="menu-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Drink+Image";
                }}
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
      )}
    </div>
  );
}