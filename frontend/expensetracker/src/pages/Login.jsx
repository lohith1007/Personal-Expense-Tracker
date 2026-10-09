import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Alert from "../components/Alert";
import api, { getErrorMessage } from "../services/api";
import { saveSession } from "../services/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Message passed by Register / Logout / Delete account, or the "session expired" notice from the API layer.
  const flashMessage =
    location.state?.message ||
    (searchParams.get("expired") ? "Your session has expired. Please log in again." : "");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    const found = {
      username: form.username.trim() === "" ? "Username is required" : "",
      password: form.password === "" ? "Password is required" : "",
    };
    setErrors(found);
    if (found.username || found.password) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/login", {
        username: form.username.trim(),
        password: form.password,
      });
      saveSession(response.data.token, response.data.username);
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page">
      <div className="card form-card">
        <h1>Login</h1>
        <Alert type={searchParams.get("expired") ? "error" : "success"}>{flashMessage}</Alert>
        <Alert type="error" onClose={() => setServerError("")}>{serverError}</Alert>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" autoComplete="username"
                   value={form.username} onChange={handleChange} />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password"
                   value={form.password} onChange={handleChange} />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="form-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
