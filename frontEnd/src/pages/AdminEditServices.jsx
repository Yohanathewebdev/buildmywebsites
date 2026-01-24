import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const AdminEditService = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    price: "",
    currency: "USD",
    duration: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Protect admin route + fetch service
  useEffect(() => {
    if (!user) return;

    if (!user.token || !user.is_admin) {
      navigate("/login");
      return;
    }

    fetchService();
  }, [user]);

  const fetchService = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/services/${id}/`,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      setFormData({
        title: res.data.title || "",
        type: res.data.type || "",
        description: res.data.description || "",
        price: res.data.price || "",
        currency: res.data.currency || "USD",
        duration: res.data.duration || "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/services/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      navigate("/admin/services");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading service...</p>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="fw-bold mb-4">Edit Service</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Type</label>
          <input
            type="text"
            name="type"
            className="form-control"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Price</label>
            <input
              type="number"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Currency</label>
            <select
              name="currency"
              className="form-select"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="TSH">TSH</option>
              <option value="KSH">KSH</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Duration</label>
            <input
              type="text"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/services")}
          >
            ← Back
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditService;
