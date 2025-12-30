import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

export default function MenuDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/menu/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!item) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  return (
    <div className="details-page">
      <Link to="/" className="back-link">← Back to Menu</Link>

      <div className="details-card">
        <h2 className="details-restaurant">Prime Bite</h2>

        <img
          src={`${BACKEND_URL}${item.image_url}`}
          alt={item.name}
          className="details-image"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1000x700.png?text=Image+Not+Found";
          }}
        />

        <div className="details-info">
          <h2>{item.name}</h2>

          <p className="details-description">
            {item.description}
          </p>

          <div className="details-price">
            ${Number(item.price).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
