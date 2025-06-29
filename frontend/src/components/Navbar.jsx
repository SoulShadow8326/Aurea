import "./Navbar.css";
import { NavLink } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="logo">Aurea</span>
      <div className="links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : undefined}>Home</NavLink>
        <NavLink to="/try" className={({ isActive }) => isActive ? "active" : undefined}>Try</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : undefined}>About</NavLink>
      </div>
    </nav>
  );
}