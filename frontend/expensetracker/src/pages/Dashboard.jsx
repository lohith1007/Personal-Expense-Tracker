import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import Layout from "../components/Layout";
import api, { getErrorMessage } from "../services/api";
import { getUsername } from "../services/auth";
import { formatCurrency, formatDate } from "../utils/format";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Every number below comes from GET /summary, which the backend calculates from MySQL
  // for the logged-in user only. Nothing on this page is hardcoded.
  useEffect(() => {
    let cancelled = false;
    api.get("/summary")
      .then((response) => {
        if (!cancelled) setSummary(response.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load the dashboard."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = summary ? Object.entries(summary.expenseByCategory) : [];
  const totalExpense = summary ? Number(summary.totalExpense) : 0;
  const balance = summary ? Number(summary.balance) : 0;

  return (
    <Layout
      title={`Welcome, ${getUsername() || ""}`}
      actions={
        <>
          <Link to="/income" className="btn btn-primary">+ Add Income</Link>
          <Link to="/expense" className="btn btn-secondary">+ Add Expense</Link>
        </>
      }
    >
      <Alert type="error" onClose={() => setError("")}>{error}</Alert>
      {loading && <p className="muted">Loading dashboard...</p>}

      {summary && (
        <>
          <div className="card-grid">
            <div className="card stat-card stat-income">
              <h3>Total Income</h3>
              <p className="stat-value">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className="card stat-card stat-expense">
              <h3>Total Expenses</h3>
              <p className="stat-value">{formatCurrency(summary.totalExpense)}</p>
            </div>
            <div className={balance < 0 ? "card stat-card stat-balance negative" : "card stat-card stat-balance"}>
              <h3>Current Balance</h3>
              <p className="stat-value">{formatCurrency(summary.balance)}</p>
              <p className="stat-note">Total Income - Total Expenses</p>
            </div>
          </div>

          <div className="two-column">
            <div className="card">
              <h2>Recent Transactions</h2>
              {summary.recentTransactions.length === 0 ? (
                <p className="muted">No transactions yet. Add your first income or expense to get started.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Details</th>
                        <th className="num">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recentTransactions.map((t) => (
                        <tr key={`${t.type}-${t.id}`}>
                          <td>{formatDate(t.date)}</td>
                          <td>
                            <span className={t.type === "INCOME" ? "badge badge-income" : "badge badge-expense"}>
                              {t.type === "INCOME" ? "Income" : "Expense"}
                            </span>
                          </td>
                          <td>{t.title}{t.description ? ` - ${t.description}` : ""}</td>
                          <td className={t.type === "INCOME" ? "num amount-income" : "num amount-expense"}>
                            {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="card-links">
                <Link to="/incomes">View all income</Link> | <Link to="/expenses">View all expenses</Link>
              </p>
            </div>

            <div className="card">
              <h2>Spending by Category</h2>
              {categories.length === 0 ? (
                <p className="muted">No expenses recorded yet.</p>
              ) : (
                <ul className="category-list">
                  {categories.map(([name, amount]) => {
                    const percent = totalExpense > 0 ? (Number(amount) / totalExpense) * 100 : 0;
                    return (
                      <li key={name}>
                        <div className="category-row">
                          <span>{name}</span>
                          <span>{formatCurrency(amount)} ({percent.toFixed(1)}%)</span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Dashboard;
