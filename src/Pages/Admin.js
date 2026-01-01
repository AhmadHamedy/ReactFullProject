import { useEffect, useState } from "react";
import axios from "axios";

// API base
const API = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/api`
  : "http://localhost:5000/api";

function Admin() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("food");
  const [image, setImage] = useState(null);

  // check login
  const [logged, setLogged] = useState(
    !!localStorage.getItem("token")
  );

  // load menu (public)
  function loadMenu() {
    axios
      .get(`${API}/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadMenu();
  }, []);

  // add item (protected)
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

    axios
      .post(`${API}/menu`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
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
      .catch(() => alert("Error adding item"));
  }

  // delete item (protected)
  function deleteItem(id) {
    if (!logged) {
      alert("Please login first");
      return;
    }

    axios
      .delete(`${API}/menu/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
      .then(() => loadMenu())
      .catch(() => alert("Delete failed"));
  }

  function logout() {
    localStorage.removeItem("token");
    setLogged(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      {/* LOGIN INFO */}
      {logged ? (
        <button onClick={logout} style={{ marginBottom: 20 }}>
          Logout
        </button>
      ) : (
        <p style={{ color: "gray" }}>
          Login required to edit menu
        </p>
      )}

      {/* ADD FORM (only visible when logged) */}
      {logged && (
        <form
          onSubmit={addItem}
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
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

          <button type="submit">Add Item</button>
        </form>
      )}

      <hr />

      {/* MENU LIST (public) */}
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
            style={{ border: "1px solid #ddd", padding: 10 }}
          >
            <img
              src={`${
                process.env.REACT_APP_BACKEND_URL ||
                "http://localhost:5000"
              }${item.image_url}`}
              alt={item.name}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover"
              }}
            />

            <h3>{item.name}</h3>
            <p>${item.price}</p>

            {/* DELETE (only when logged) */}
            {logged && (
              <button
                onClick={() => deleteItem(item.id)}
                style={{ color: "red" }}
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
