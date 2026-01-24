import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch all orders (admin only)
  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/orders/", {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });

        // ✅ Normalize response
        let data = res.data;
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data?.results && Array.isArray(data.results)) {
          setOrders(data.results);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // 🔹 Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/orders/${orderId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      // Update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-danger text-center mt-5">{error}</p>;
  }

  return (
    <div className="container mt-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Admin Orders</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
                <th>Document</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.user?.full_name || "—"}</td>
                  <td>{order.service?.title || "—"}</td>
                  <td>{order.contact_phone || "—"}</td>

                  <td>
                    <span className={`badge bg-${statusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>

                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    {order.document ? (
                      <a
                        href={order.document}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>{order.user?.email || "—"}</td>

                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 🔹 Badge color helper
const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "info";
    case "completed":
      return "success";
    default:
      return "secondary";
  }
};

export default AdminOrders;
