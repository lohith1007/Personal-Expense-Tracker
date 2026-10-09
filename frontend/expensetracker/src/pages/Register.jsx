import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import api, { getErrorMessage } from "../services/api";
import { hasErrors, validateEmail, validatePassword, validateUsername } from "../utils/validators";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const validate = () => ({
    username: validateUsername(form.username),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: form.confirmPassword !== form.password ? "Passwords do not match" : "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const found = validate();
    setErrors(found);
    if (hasErrors(found)) {
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { state: { message: "Registration successful. Please log in." } });
    } catch (error) {
      setServerError(getErrorMessage(error, "Registration failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page">
      <div className="card form-card">
        <h1>Create Account</h1>
        <Alert type="error" onClose={() => setServerError("")}>{serverError}</Alert>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" autoComplete="username"
                   value={form.username} onChange={handleChange} />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email"
                   value={form.email} onChange={handleChange} />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password"
                   value={form.password} onChange={handleChange} />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
                   value={form.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
