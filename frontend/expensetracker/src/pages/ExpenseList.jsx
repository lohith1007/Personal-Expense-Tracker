import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import api, { getErrorMessage } from "../services/api";
import { formatCurrency, formatDate } from "../utils/format";

function ExpenseList() {
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.message || "");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get("/expenses")
      .then((response) => {
        if (!cancelled) setExpenses(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load expenses."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (expense) => {
    if (!window.confirm(`Delete expense "${expense.category}" of ${formatCurrency(expense.amount)}?`)) {
      return;
    }
    setError("");
    setMessage("");
    setDeletingId(expense.id);
    try {
      await api.delete(`/expense/${expense.id}`);
      setExpenses((current) => current.filter((item) => item.id !== expense.id));
      setMessage("Expense deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete the expense."));
    } finally {
      setDeletingId(null);
    }
  };

  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Layout title="Expenses" actions={<Link to="/expense" className="btn btn-primary">+ Add Expense</Link>}>
      <Alert type="success" onClose={() => setMessage("")}>{message}</Alert>
      <Alert type="error" onClose={() => setError("")}>{error}</Alert>
      <div className="card">
        {loading ? (
          <p className="muted">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="muted">No expenses recorded yet. Click "Add Expense" to create your first entry.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="num">Amount</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description || "-"}</td>
                    <td className="num amount-expense">{formatCurrency(expense.amount)}</td>
                    <td className="actions-col">
                      <Link to={`/expense/${expense.id}/edit`} className="btn btn-small btn-secondary">Edit</Link>
                      <button type="button" className="btn btn-small btn-danger"
                              disabled={deletingId === expense.id}
                              onClick={() => handleDelete(expense)}>
                        {deletingId === expense.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
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

export default ExpenseList;
