import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceOrder = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const service = location.state?.service;

  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Guards
  if (!user) {
    return <p className="text-center mt-5 text-danger">You must be logged in.</p>;
  }

  if (!service) {
    return <p className="text-center mt-5 text-danger">No service selected.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!contactPhone) {
      setError("Phone number is required.");
      return;
    }

    const formData = new FormData();
    formData.append("service", service.id);           // ✅ ID ONLY
    formData.append("contact_phone", contactPhone);  // ✅ correct field
    formData.append("description", description);
    if (document) formData.append("document", document);

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/orders/create/",
        formData
      );

      navigate("/orders"); // go to My Orders
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="fw-bold mb-4">Confirm Order</h3>

      {/* SERVICE SUMMARY */}
      <div className="card p-4 shadow-sm mb-4">
        <h5 className="fw-bold">{service.title}</h5>
        <p className="text-muted">{service.description}</p>
        <h6 className="fw-bold">
          {service.currency} {service.price}
        </h6>
      </div>

      <form onSubmit={handleSubmit}>
        {/* PHONE */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className="form-control"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label fw-bold">Extra Notes (optional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any additional details"
          />
        </div>

        {/* DOCUMENT */}
        <div className="mb-3">
          <label className="form-label fw-bold">Upload Document (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setDocument(e.target.files[0])}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-success w-100 fw-bold" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
