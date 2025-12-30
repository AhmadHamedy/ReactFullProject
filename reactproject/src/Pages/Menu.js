import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios.get(`${API}/menu`)
      .then(res => setMenu(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Menu</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {menu.map(item => (
          <Link
            key={item.id}
            to={`/menu/${item.id}`}
            style={{ textDecoration: "none", color: "black", border: "1px solid #ccc", padding: 10 }}
          >
            <img
              src={item.image_url}
              alt={item.name}
              style={{ width: "100%", height: 150, objectFit: "cover" }}
            />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Menu;
