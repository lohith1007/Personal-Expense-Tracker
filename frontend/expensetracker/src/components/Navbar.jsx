import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearSession, getUsername } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const username = getUsername();

  const handleLogout = async () => {
    try {
      // Tell the server to reject this token from now on.
      await api.post("/logout");
    } catch (e) {
      // Even if the server cannot be reached, the user is still logged out locally.
    }
    clearSession();
    navigate("/login", { replace: true, state: { message: "You have been logged out." } });
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-brand" onClick={close}>
          Expense Tracker
        </NavLink>
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          &#9776;
        </button>
        <nav className={open ? "navbar-links open" : "navbar-links"}>
          <NavLink to="/dashboard" className={linkClass} onClick={close}>Dashboard</NavLink>
          <NavLink to="/incomes" className={linkClass} onClick={close}>Income</NavLink>
          <NavLink to="/expenses" className={linkClass} onClick={close}>Expenses</NavLink>
          <NavLink to="/profile" className={linkClass} onClick={close}>Profile</NavLink>
          <span className="navbar-user">{username}</span>
          <button type="button" className="btn btn-light btn-small" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
