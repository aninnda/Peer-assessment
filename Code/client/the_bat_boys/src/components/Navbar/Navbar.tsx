import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
            <NavLink
              to="/teams"
              className={({ isActive }) => (isActive? 'nav-link active' : 'nav-link')}>
              Teams
            </NavLink>
            <NavLink
              to="/ratings"
              className={({ isActive }) => (isActive? 'nav-link active' : 'nav-link')}>
              Ratings
            </NavLink>
            <NavLink
              to="/other"
              className={({ isActive }) => (isActive? 'nav-link active' : 'nav-link')}>
              Forum
            </NavLink>
            <NavLink
              to="/graph"
              className={({ isActive }) => (isActive? 'nav-link active' : 'nav-link')}>
              Graph
            </NavLink>
            <NavLink
              to="/login">
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
