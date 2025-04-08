import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/">בית</Link></li>
        <li><Link to="/owner">כניסת בעל מכולת</Link></li>
        <li><Link to="/supplier">כניסת ספקים</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
