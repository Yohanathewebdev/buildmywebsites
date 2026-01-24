import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const Dashboard = () => {
  const { user, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch services from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services/")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/darshboard"); // redirect to homepage
  };

  if (loading)
    return <p className="text-center mt-5">Loading services... Please wait.</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted">
            Welcome back 👋 <strong>{user?.full_name}</strong>
          </p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Quick Navigation Cards */}
      <div className="row justify-content-center g-4 mb-5">
        <div className="col-md-3">
          <div
            className="card shadow-sm p-4 text-center h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/orders")}
          >
            <h5 className="fw-bold">📦 My Orders</h5>
            <p className="text-muted">View your orders and track status</p>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card shadow-sm p-4 text-center h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <h5 className="fw-bold">🛒 Place New Order</h5>
            <p className="text-muted">Browse services and order now</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <h4 className="fw-bold mb-3">Available Services</h4>
      <div className="row g-4">
        {services.map((service) => (
          <div className="col-md-4" key={service.id}>
            <div className="card shadow h-100">
              {service.images && service.images.length > 0 && (
                <img
                  src={service.images[0].image}
                  alt={service.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}

              <div className="card-body p-3">
                <h5 className="fw-bold">{service.title}</h5>
                <p className="text-muted">{service.description}</p>

                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <h6 className="fw-bold mb-1">Duration</h6>
                    <p className="mb-0">{service.duration}</p>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Price</h6>
                    <p className="mb-0">
                      {service.currency} {service.price}
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-success w-100 fw-bold"
                  onClick={() => navigate("/placeorder", { state: { service } })}
                >
                  Order now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
