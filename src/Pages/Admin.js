import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./login.js"; // Ensure the filename is exactly 'login.js' or 'Login.js'

// API base configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API = `${BACKEND_URL}/api`;

function Admin() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("food");
  const [image, setImage] = useState(null);

  // Check if token exists in localStorage to set login state
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  // load menu (publicly available)
  function loadMenu() {
    axios
      .get(`${API}/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Error loading menu:", err));
  }

  useEffect(() => {
    loadMenu();
  }, []);

  // add item (protected route)
  function addItem(e) {
    e.preventDefault();

    if (!logged) {
      alert("Please login first");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    const token = localStorage.getItem("token");

    axios
      .post(`${API}/menu`, formData, {
        headers: {
          // Backend middleware expects "Bearer <token>"
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        setName("");
        setDescription("");
        setPrice("");
        setCategory("food");
        setImage(null);
        document.getElementById("fileInput").value = "";
        loadMenu();
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding item. Ensure you are logged in correctly.");
      });
  }

  // delete item (protected route)
  function deleteItem(id) {
    if (!logged) {
      alert("Please login first");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .delete(`${API}/menu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => loadMenu())
      .catch((err) => {
        console.error(err);
        alert("Delete failed");
      });
  }

  function logout() {
    localStorage.removeItem("token");
    setLogged(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      {/* LOGIN LOGIC: Show Login form if not logged, otherwise show Logout and Admin Form */}
      {!logged ? (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", maxWidth: "300px" }}>
          <h3>Admin Login</h3>
          <Login setLogged={setLogged} />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <span style={{ marginRight: 10, color: "green" }}>● Logged in as Admin</span>
            <button onClick={logout}>Logout</button>
          </div>

          <form
            onSubmit={addItem}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px" }}
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="food">Food</option>
              <option value="drinks">Drinks</option>
            </select>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit" style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "10px 20px", cursor: "pointer" }}>
              Add Item
            </button>
          </form>
        </>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>Current Menu</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20
        }}
      >
        {menu.map((item) => (
          <div
            key={item.id}
            style={{ border: "1px solid #ddd", padding: 10, borderRadius: "8px" }}
          >
            <img
              src={`${BACKEND_URL}${item.image_url}`}
              alt={item.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: "4px"
              }}
            />
            <h3>{item.name}</h3>
            <p style={{ fontWeight: "bold" }}>${item.price}</p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>{item.category}</p>

            {logged && (
              <button
                onClick={() => deleteItem(item.id)}
                style={{ color: "white", backgroundColor: "red", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;