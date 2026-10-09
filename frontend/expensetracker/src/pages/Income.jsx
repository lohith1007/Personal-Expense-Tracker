import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import api, { getErrorMessage } from "../services/api";
import { todayISO } from "../utils/format";
import { hasErrors, validateAmount, validateDate, validateRequired } from "../utils/validators";

const SOURCE_SUGGESTIONS = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];

// One page for both "Add income" (/income) and "Edit income" (/income/:id/edit).
function Income() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const today = todayISO();

  const [form, setForm] = useState({ source: "", amount: "", date: today });
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
    api.get(`/income/${id}`)
      .then((response) => {
        if (!cancelled) {
          setForm({
            source: response.data.source,
            amount: String(response.data.amount),
            date: response.data.date,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setServerError(getErrorMessage(error, "Could not load this income entry."));
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
      source: validateRequired(form.source, "Income source", 100),
      amount: validateAmount(form.amount),
      date: validateDate(form.date, today),
    };
    setErrors(found);
    if (hasErrors(found)) {
      return;
    }

    const payload = { source: form.source.trim(), amount: form.amount.trim(), date: form.date };
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/income/${id}`, payload);
      } else {
        await api.post("/income", payload);
      }
      navigate("/incomes", {
        state: { message: isEdit ? "Income updated successfully." : "Income added successfully." },
      });
    } catch (error) {
      setServerError(getErrorMessage(error, "Could not save the income. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title={isEdit ? "Edit Income" : "Add Income"}>
      <div className="card form-card wide">
        <Alert type="error" onClose={() => setServerError("")}>{serverError}</Alert>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="source">Source</label>
              <input id="source" name="source" type="text" list="income-sources"
                     placeholder="e.g. Salary" value={form.source} onChange={handleChange} />
              <datalist id="income-sources">
                {SOURCE_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
              </datalist>
              {errors.source && <p className="field-error">{errors.source}</p>}
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
                {submitting ? "Saving..." : isEdit ? "Update Income" : "Add Income"}
              </button>
              <Link to="/incomes" className="btn btn-secondary">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default Income;
