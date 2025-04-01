import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Logo / Brand */}
        <Link to="/" className="logo">
          <span className="logo-text">MyBrand</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="menu-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className={`menu-icon ${isOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Navbar Links */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`nav-item ${location.pathname === "/features" ? "active" : ""}`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`nav-item ${location.pathname === "/pricing" ? "active" : ""}`}
          >
            Pricing
          </Link>
          <span className="nav-disabled">Coming Soon</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
