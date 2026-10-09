import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import api, { getErrorMessage } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";

function IncomeList() {
  const location = useLocation();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get("/incomes")
      .then((response) => {
        if (!cancelled) setIncomes(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load income."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (income) => {
    if (!window.confirm(`Delete income "${income.source}" of ${formatCurrency(income.amount)}?`)) {
      return;
    }
    setError("");
    setMessage("");
    setDeletingId(income.id);
    try {
      await api.delete(`/income/${income.id}`);
      setIncomes((current) => current.filter((item) => item.id !== income.id));
      setMessage("Income deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the income."));
    } finally {
      setDeletingId(null);
    }
  };

  const total = incomes.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Layout title="Income" actions={<Link to="/income" className="btn btn-primary">+ Add Income</Link>}>
      <Alert type="success" onClose={() => setMessage("")}>{message}</Alert>
      <Alert type="error" onClose={() => setError("")}>{error}</Alert>
      <div className="card">
        {loading ? (
          <p className="muted">Loading income...</p>
        ) : incomes.length === 0 ? (
          <p className="muted">No income recorded yet. Click "Add Income" to create your first entry.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th className="num">Amount</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id}>
                    <td>{formatDate(income.date)}</td>
                    <td>{income.source}</td>
                    <td className="num amount-income">{formatCurrency(income.amount)}</td>
                    <td className="actions-col">
                      <Link to={`/income/${income.id}/edit`} className="btn btn-small btn-secondary">Edit</Link>
                      <button type="button" className="btn btn-small btn-danger"
                              disabled={deletingId === income.id}
                              onClick={() => handleDelete(income)}>
                        {deletingId === income.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Total</strong></td>
                  <td className="num"><strong>{formatCurrency(total)}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default IncomeList;
