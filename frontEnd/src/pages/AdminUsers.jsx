import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const AdminUsers = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    if (!user?.is_admin) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  // 📥 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://buildmywebsites-production.up.railway.app/users/", {
        headers: { Authorization: `Token ${user.token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];

      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Enable / Disable user
  const toggleUser = async (id, isSuperuser) => {
    if (isSuperuser) {
      alert("Admin accounts cannot be modified.");
      return;
    }

    try {
      const res = await axios.patch(
        `http://127.0.0.1:8000/admin/users/${id}/toggle/`,
        {},
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: res.data.is_active } : u
        )
      );
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  // ❌ Delete user
  const deleteUser = async (id, isSuperuser) => {
    if (isSuperuser) {
      alert("You cannot delete an admin account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/users/${id}/`, {
        headers: { Authorization: `Token ${user.token}` },
      });

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading users...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">System Users</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* TABLE */}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: "220px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name || "—"}</td>
                  <td>{u.email}</td>

                  {/* ROLE */}
                  <td>
                    {u.is_superuser ? (
                      <span className="badge bg-danger">Admin</span>
                    ) : (
                      <span className="badge bg-secondary">Customer</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    {u.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-warning">Disabled</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="d-flex gap-2">
                    <button
                      className={`btn btn-sm ${
                        u.is_active ? "btn-warning" : "btn-success"
                      }`}
                      disabled={u.is_superuser}
                      onClick={() => toggleUser(u.id, u.is_superuser)}
                    >
                      {u.is_active ? "Disable" : "Enable"}
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      disabled={u.is_superuser}
                      onClick={() => deleteUser(u.id, u.is_superuser)}
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

export default AdminUsers;
