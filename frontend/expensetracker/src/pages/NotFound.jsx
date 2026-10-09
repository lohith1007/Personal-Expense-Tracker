import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="public-page">
      <div className="card form-card center-text">
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}

export default NotFound;
