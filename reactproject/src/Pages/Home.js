import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      <h1 className="home-title">Welcome to Prime Bite</h1>

      <p className="home-about">
        At Prime Bite, we serve bold flavors crafted with passion.
        From sizzling grills and authentic shawarma to classic pizzas
        and refreshing drinks, every bite is made to satisfy.
      </p>

      <div className="home-buttons">
        <Link to="/food" className="home-btn">
          🍽 View Food
        </Link>

        <Link to="/drinks" className="home-btn outline">
          🥤 View Drinks
        </Link>
      </div>
    </div>
  );
}
