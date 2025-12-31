import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Prime Bite</h1>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/food">Food</Link>
        <Link to="/drinks">Drinks</Link>
        <Link to="/manage">Admin</Link>
      </div>
    </nav>
  );
}
