import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import ExpenseList from "./pages/ExpenseList";
import Home from "./pages/Home";
import Income from "./pages/Income";
import IncomeList from "./pages/IncomeList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* pages that need a valid JWT */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/incomes" element={<ProtectedRoute><IncomeList /></ProtectedRoute>} />
        <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
        <Route path="/income/:id/edit" element={<ProtectedRoute><Income /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><ExpenseList /></ProtectedRoute>} />
        <Route path="/expense" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
        <Route path="/expense/:id/edit" element={<ProtectedRoute><Expense /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
