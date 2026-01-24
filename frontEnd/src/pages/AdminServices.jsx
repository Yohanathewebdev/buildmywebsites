import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const AdminServices = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Protect admin route (SAFE)
  useEffect(() => {
    if (!user) return;

    if (!user.token || !user.is_admin) {
      navigate("/login");
      return;
    }

    fetchServices();
  }, [user]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/services/",
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];

      setServices(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/services/${id}/`,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading services...</p>;
  }

  if (error) {
    return <p className="text-danger text-center mt-5">{error}</p>;
  }

  return (
    <div className="container mt-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Services</h2>

        <div className="d-flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/services/create")}
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* TABLE */}
      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Price</th>
                <th>Duration</th>
                <th width="160">Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.title}</td>
                  <td>{service.type}</td>
                  <td>
                    {service.price} {service.currency}
                  </td>
                  <td>{service.duration}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate(`/admin/services/edit/${service.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </button>
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

export default AdminServices;
