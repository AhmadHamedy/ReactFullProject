import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

function Login({ setLogged }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(e) {
    e.preventDefault();
    axios.post(`${API}/login`, { email, password })
      .then(res => {
        localStorage.setItem("token", res.data.token);
        setLogged(true);
      })
      .catch(() => alert("Wrong credentials"));
  }

  return (
    <form onSubmit={login}>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}

export default Login;
