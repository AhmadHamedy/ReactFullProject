import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMenu } from "../Context/MenuContext";

const API = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/api` : "http://localhost:5000/api";

export default function ManageMenu() {
  const { menu, setMenu } = useMenu();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("food");
  useEffect(() => {
    axios.get(`${API}/menu`).then((res) => setMenu(res.data));
  }, [setMenu]);
  function addItem(e) {
    e.preventDefault();

    if (!image) {
      alert("Please select an image file from your device.");
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
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setName("");
        setDescription("");
        setImage(null);
        setPrice("");
        setCategory("food");
        document.getElementById("fileInput").value = "";

        return axios.get(`${API}/menu`);
      })
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Error adding item:", err));
  }
  function deleteItem(id) {
    axios
      .delete(`${API}/menu/${id}`)
      .then(() => axios.get(`${API}/menu`))
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));
  }

  return (
    <div className="page">
      <h2>Manage Menu</h2>

      <form onSubmit={addItem} className="admin-form">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

       
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', flex: 1 }}
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="drinks">Drink</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Item</button>
      </form>

      <hr />

      <div className="admin-list">
        {menu.map((item) => (
          <div key={item.id} className="admin-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <img 
               src={`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}${item.image_url}`} 
                alt={item.name} 
                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
/>
            <div>
              <strong>{item.name}</strong> — ${item.price} ({item.category})
            </div>
            <button onClick={() => deleteItem(item.id)} style={{ marginLeft: 'auto', color: 'red' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}