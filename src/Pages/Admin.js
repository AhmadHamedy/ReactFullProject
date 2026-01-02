import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./login.js"; 

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API = `${BACKEND_URL}/api`;

function Admin() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("food");
  const [image, setImage] = useState(null);

  // Core login state
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  function loadMenu() {
    axios
      .get(`${API}/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Error loading menu:", err));
  }

  useEffect(() => {
    loadMenu();
  }, []);

  function addItem(e) {
    e.preventDefault();
    if (!logged) return alert("Please login first");
    if (!image) return alert("Please select an image");

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
          // Fixed Header Format
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
        alert("Error adding item. Your session might have expired.");
      });
  }

  function deleteItem(id) {
    if (!logged) return alert("Please login first");
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
      <h1>Manage Menu</h1>

      {/* LOGIN CHECK: Only show Admin Panel if logged is true */}
      {!logged ? (
        <div style={{ 
          margin: "50px auto", 
          padding: "30px", 
          border: "2px solid #007bff", 
          borderRadius: "12px", 
          maxWidth: "400px",
          textAlign: "center"
        }}>
          <h2 style={{ marginBottom: "20px" }}>Admin Access Required</h2>
          {/* This renders your login button and form */}
          <Login setLogged={setLogged} />
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "green", fontWeight: "bold" }}>● Admin Session Active</span>
            <button onClick={logout} style={{ backgroundColor: "#333", color: "white", padding: "8px 15px" }}>
              Logout
            </button>
          </div>

          <form
            onSubmit={addItem}
            style={{ 
                display: "flex", 
                gap: 15, 
                flexWrap: "wrap", 
                backgroundColor: "#f4f4f4", 
                padding: "25px", 
                borderRadius: "10px",
                border: "1px solid #ddd"
            }}
          >
            <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
  <option value="food">Food</option>
  <option value="drinks">Drinks</option>
</select>

            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%" }} />
            <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "12px 25px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Add New Item
            </button>
          </form>

          <hr style={{ margin: "40px 0" }} />

          <h2>Current Live Menu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {menu.map((item) => (
              <div key={item.id} style={{ border: "1px solid #ddd", padding: 15, borderRadius: "10px", position: "relative" }}>
                <img
                  src={`${BACKEND_URL}${item.image_url}`}
                  alt={item.name}
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "6px" }}
                />
                <h3>{item.name}</h3>
                <p style={{ fontWeight: "bold", fontSize: "1.1em" }}>${item.price}</p>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{ width: "100%", backgroundColor: "#dc3545", color: "white", border: "none", padding: "8px", borderRadius: "4px", marginTop: "10px" }}
                >
                  Remove Item
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;