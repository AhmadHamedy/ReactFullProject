import React from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../Context/MenuContext";

const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Food() {
  // Pull loading from context to show a spinner/message while fetching
  const { sortedMenu, loading } = useMenu();

  // Filter for food items (using trim and lowercase for safety)
  const foodItems = sortedMenu.filter(
    (item) => item.category?.trim().toLowerCase() === "food"
  );

  // 1. Show loading state
  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading Menu...</h2>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">Prime Bite Food Menu</h2>

      {/* 2. Show message if no items are found */}
      {foodItems.length === 0 ? (
        <p style={{ textAlign: "center", color: "gray" }}>
          No food items available at the moment.
        </p>
      ) : (
        <div className="menu-grid">
          {foodItems.map((item) => (
            <Link to={`/menu/${item.id}`} key={item.id} className="menu-card">
              <img
                src={`${BASE_URL}${item.image_url}`}
                alt={item.name}
                className="menu-image"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=No+Image";
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