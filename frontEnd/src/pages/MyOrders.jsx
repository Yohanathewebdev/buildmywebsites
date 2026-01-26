import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import OrderFeedbackForm from "./OrderFeedbackForm";
import "./MyOrders.css";

const MyOrders = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://buildmywebsites-production.up.railway.app/orders/my/",
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
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
        <h2 className="fw-bold">My Orders</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/darshboard")}
        >
          + Place New Order
        </button>


      </div>

      {/* FEEDBACK FORM */}
      {selectedOrder && (
        <OrderFeedbackForm
          order={selectedOrder}
          onClose={() => {
            setSelectedOrder(null);
            fetchOrders(); // refresh after feedback
          }}
        />
      )}

      {/* ORDERS TABLE */}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Feedback</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.service?.title || "—"}</td>

                  <td>
                    <span className={`badge bg-${statusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>

                  <td>{order.contact_phone || "—"}</td>

                  <td>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                 
                  {/* FEEDBACK COLUMN */}
                  <td>
                    {order.feedback ? (
                      <span className="badge bg-success">
                        Rated {order.feedback.rating}/5
                      </span>
                    ) : order.status === "completed" ? (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Give Feedback
                      </button>
                    ) : (
                      "—"
                    )}
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

// 🔹 Status badge helper
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

export default MyOrders;
