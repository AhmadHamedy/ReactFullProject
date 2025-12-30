import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Admin() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("food");
  const [image, setImage] = useState(null);

  function loadMenu() {
    axios.get(`${API}/menu`).then((res) => setMenu(res.data));
  }

  useEffect(() => {
    loadMenu();
  }, []);

  function addItem(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image); // The file object

    axios.post(`${API}/menu`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(() => {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("food");
      setImage(null);
      document.getElementById("fileInput").value = ""; // Clear file input
      loadMenu();
    })
    .catch(err => alert("Error adding item: " + err.message));
  }

  function deleteItem(id) {
    axios.delete(`${API}/menu/${id}`).then(() => loadMenu());
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Manage Menu</h1>
      <form onSubmit={addItem} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="drinks">Drinks</option>
        </select>
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add Item</button>
      </form>
      <hr />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {menu.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", padding: 10 }}>
            <img src={`http://localhost:5000${item.image_url}`} alt={item.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            <button onClick={() => deleteItem(item.id)} style={{ color: "red" }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;