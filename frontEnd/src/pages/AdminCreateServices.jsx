import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const AdminCreateService = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    price: "",
    currency: "USD",
    duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔒 Protect admin route
  if (!user?.is_admin) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "https://buildmywebsites-production.up.railway.app/api/services",

        form,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      navigate("/admin/services");
    } catch (err) {
      console.error(err);
      setError("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Add New Service</h3>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Title"
          name="title"
          onChange={handleChange}
          required
        />

        <select
          name="type"
          className="form-control mb-3"
          onChange={handleChange}
          required
        >
          <option value="">Select Service Type</option>
          <option value="bronze">Bronze</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>

        <textarea
          className="form-control mb-3"
          placeholder="Description"
          name="description"
          onChange={handleChange}
          rows="3"
        />

        <input
          className="form-control mb-3"
          placeholder="Price"
          name="price"
          type="number"
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Duration"
          name="duration"
          onChange={handleChange}
        />

        <select
          className="form-control mb-4"
          name="currency"
          onChange={handleChange}
        >
          <option value="USD">USD</option>
          <option value="TZS">TZS</option>
        </select>

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Saving..." : "Create Service"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateService;
