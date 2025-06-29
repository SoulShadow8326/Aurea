import "./Navbar.css";
export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="logo">Aurea</span>
      <div className="links">
        <a href="/" className="active">Home</a>
        <a href="/try">Try</a>
        <a href="/about">About</a>
      </div>
    </nav>
  );
}