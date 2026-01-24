import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const AdminDashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Protect admin page
  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/admin/dashboard/"
        );
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* SIDEBAR */}
      <aside className="bg-dark text-white p-3 shadow" style={{ width: "260px" }}>
        <h4 className="text-center fw-bold text-warning py-3">
          ADMIN PANEL
        </h4>
        <hr className="border-light" />

        <ul className="nav nav-pills flex-column gap-2">
          <li>
            <button
              className="nav-link active text-start bg-primary w-100"
              onClick={() => navigate("/admin/dashboard")}
            >
              📊 Dashboard
            </button>
          </li>
          <li>
            <button
              className="nav-link text-white text-start w-100"
              onClick={() => navigate("/admin/orders")}
            >
              📦 Orders
            </button>
          </li>
          <li>
            <button
              className="nav-link text-white text-start w-100"
              onClick={() => navigate("/admin/services")}
            >
              🛠 Services
            </button>
          </li>
          <li>
            <button
              className="nav-link text-white text-start w-100"
              onClick={() => navigate("/admin/users")}
            >
              👥 Users
            </button>
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        {/* TOP BAR */}
        <header className="navbar bg-white shadow-sm px-4 py-3 mb-4">
          <h5 className="fw-bold mb-0 text-secondary">Admin Overview</h5>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              Welcome, <strong>{user?.full_name}</strong>
            </span>
            <div
              className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center fw-bold"
              style={{ width: 36, height: 36 }}
            >
              {user?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="container-fluid px-4">
          {error && <div className="alert alert-danger">{error}</div>}

          {/* STATS */}
          <div className="row g-4 mb-4">
            <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="primary" />
            <StatCard title="Total Services" value={stats.totalServices} icon="🛠" color="info" />
            <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" color="success" />
            <StatCard title="Pending Orders" value={stats.pendingOrders} icon="⏳" color="warning" />
          </div>

          {/* QUICK ACTIONS */}
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-flex gap-3 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/admin/services/create")}
              >
                + Add Service
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/admin/orders")}
              >
                Review Orders
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* STAT CARD */
const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-3">
    <div className="card border-0 shadow-sm p-3 h-100">
      <div className="d-flex align-items-center">
        <div
          className={`rounded-3 p-3 bg-${color} bg-opacity-10 text-${color} me-3 fs-3`}
        >
          {icon}
        </div>
        <div>
          <p className="text-muted mb-0 small fw-bold">{title}</p>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
