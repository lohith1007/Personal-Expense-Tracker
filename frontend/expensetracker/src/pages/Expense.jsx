import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import api, { getErrorMessage } from "../services/api";
import { todayISO } from "../utils/format";
import { hasErrors, validateAmount, validateDate, validateRequired } from "../utils/validators";

const CATEGORY_SUGGESTIONS = [
  "Food", "Transport", "Rent", "Utilities", "Entertainment", "Health", "Education", "Shopping", "Other",
];

// One page for both "Add expense" (/expense) and "Edit expense" (/expense/:id/edit).
function Expense() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const today = todayISO();

  const [form, setForm] = useState({ category: "", description: "", amount: "", date: today });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Edit mode: load the existing record (the backend only returns it if it belongs to the logged-in user).
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    let cancelled = false;
    api.get(`/expense/${id}`)
      .then((response) => {
        if (!cancelled) {
          setForm({
            category: response.data.category,
            description: response.data.description || "",
            amount: String(response.data.amount),
            date: response.data.date,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setServerError(getErrorMessage(error, "Could not load this expense."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const found = {
      category: validateRequired(form.category, "Category", 100),
      description: form.description.trim().length > 255 ? "Description must be at most 255 characters" : "",
      amount: validateAmount(form.amount),
      date: validateDate(form.date, today),
    };
    setErrors(found);
    if (hasErrors(found)) {
      return;
    }

    const payload = {
      category: form.category.trim(),
      description: form.description.trim(),
      amount: form.amount.trim(),
      date: form.date,
    };
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/expense/${id}`, payload);
      } else {
        await api.post("/expense", payload);
      }
      navigate("/expenses", {
        state: { message: isEdit ? "Expense updated successfully." : "Expense added successfully." },
      });
    } catch (error) {
      setServerError(getErrorMessage(error, "Could not save the expense. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title={isEdit ? "Edit Expense" : "Add Expense"}>
      <div className="card form-card wide">
        <Alert type="error" onClose={() => setServerError("")}>{serverError}</Alert>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" type="text" list="expense-categories"
                     placeholder="e.g. Food" value={form.category} onChange={handleChange} />
              <datalist id="expense-categories">
                {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
              </datalist>
              {errors.category && <p className="field-error">{errors.category}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <input id="description" name="description" type="text"
                     value={form.description} onChange={handleChange} />
              {errors.description && <p className="field-error">{errors.description}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input id="amount" name="amount" type="text" inputMode="decimal"
                     placeholder="0.00" value={form.amount} onChange={handleChange} />
              {errors.amount && <p className="field-error">{errors.amount}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input id="date" name="date" type="date" max={today} value={form.date} onChange={handleChange} />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>
            <div className="button-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update Expense" : "Add Expense"}
              </button>
              <Link to="/expenses" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default Expense;
