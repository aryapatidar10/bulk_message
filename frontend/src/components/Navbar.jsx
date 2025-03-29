import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo / Brand */}
        <Link to="/" className="logo">
          MyBrand
        </Link>

        {/* Mobile Menu Button */}
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* Navbar Links */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Link to="/features" className="nav-item">
            Features
          </Link>
          <Link to="/pricing" className="nav-item">
            Pricing
          </Link>
          <span className="nav-disabled">Disabled</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
