import { Link } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

function Home() {
  const loggedIn = isLoggedIn();
  return (
    <div className="public-page">
      <div className="hero card">
        <h1>Personal Expense Tracker</h1>
        <p className="hero-text">
          Record your income and expenses, see your balance at a glance, and keep your spending under control.
          Every account sees only its own data.
        </p>
        <div className="button-row center">
          {loggedIn ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
