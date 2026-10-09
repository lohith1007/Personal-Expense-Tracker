import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import api, { getErrorMessage } from "../services/api";
import { clearSession } from "../services/auth";
import { hasErrors, validatePassword } from "../utils/validators";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changing, setChanging] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteFieldError, setDeleteFieldError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.get("/profile")
      .then((response) => {
        if (!cancelled) setProfile(response.data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getErrorMessage(err, "Could not load your profile."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePasswordChange = (event) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    const found = {
      currentPassword: passwordForm.currentPassword === "" ? "Current password is required" : "",
      newPassword: validatePassword(passwordForm.newPassword, "New password"),
      confirmPassword: passwordForm.confirmPassword !== passwordForm.newPassword ? "Passwords do not match" : "",
    };
    setPasswordErrors(found);
    if (hasErrors(found)) {
      return;
    }

    setChanging(true);
    try {
      await api.put("/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordError(getErrorMessage(error, "Could not update the password."));
    } finally {
      setChanging(false);
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setDeleteError("");
    if (deletePassword === "") {
      setDeleteFieldError("Enter your password to confirm");
      return;
    }
    setDeleteFieldError("");
    if (!window.confirm("This permanently deletes your account and ALL your income and expenses. Continue?")) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete("/profile", { data: { password: deletePassword } });
      clearSession();
      navigate("/login", { replace: true, state: { message: "Your account has been deleted." } });
    } catch (error) {
      setDeleteError(getErrorMessage(error, "Could not delete the account."));
      setDeleting(false);
    }
  };

  return (
    <Layout title="My Profile">
      <Alert type="error">{loadError}</Alert>

      <div className="card">
        <h2>Account Details</h2>
        {loading ? (
          <p className="muted">Loading profile...</p>
        ) : profile ? (
          <dl className="details">
            <dt>Username</dt>
            <dd>{profile.username}</dd>
            <dt>Email</dt>
            <dd>{profile.email}</dd>
          </dl>
        ) : null}
      </div>

      <div className="card">
        <h2>Change Password</h2>
        <Alert type="success" onClose={() => setPasswordMessage("")}>{passwordMessage}</Alert>
        <Alert type="error" onClose={() => setPasswordError("")}>{passwordError}</Alert>
        <form onSubmit={handleChangePassword} noValidate className="narrow-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password"
                   value={passwordForm.currentPassword} onChange={handlePasswordChange} />
            {passwordErrors.currentPassword && <p className="field-error">{passwordErrors.currentPassword}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input id="newPassword" name="newPassword" type="password" autoComplete="new-password"
                   value={passwordForm.newPassword} onChange={handlePasswordChange} />
            {passwordErrors.newPassword && <p className="field-error">{passwordErrors.newPassword}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
                   value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
            {passwordErrors.confirmPassword && <p className="field-error">{passwordErrors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={changing}>
            {changing ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="card danger-zone">
        <h2>Delete Account</h2>
        <p>
          Deleting your account permanently removes your profile and all of your income and expense records.
          This cannot be undone.
        </p>
        <Alert type="error" onClose={() => setDeleteError("")}>{deleteError}</Alert>
        <form onSubmit={handleDeleteAccount} noValidate className="narrow-form">
          <div className="form-group">
            <label htmlFor="deletePassword">Confirm with your password</label>
            <input id="deletePassword" type="password" autoComplete="current-password"
                   value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            {deleteFieldError && <p className="field-error">{deleteFieldError}</p>}
          </div>
          <button type="submit" className="btn btn-danger" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Profile;
