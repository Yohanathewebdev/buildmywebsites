import { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/admin/users/");
      // Handle both array and object responses safely
      const data = Array.isArray(response.data) ? response.data : response.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle the active status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // We use PATCH because we are only updating one field (is_active)
      await axios.patch(`https://buildmywebsites-production.up.railway.app/users/${userId}/`, {
        is_active: !currentStatus,
      });

      // Update local state immediately so the UI feels fast
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_active: !currentStatus } : u
      ));
    } catch (err) {
      alert("Failed to update user status. Check if your backend supports PATCH for this endpoint.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Manage Accounts</h5>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name or email..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Role</th>
              <th>Toggle Access</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center">Loading...</td></tr>
            ) : filteredUsers.map((u) => (
              <tr key={u.id} style={{ opacity: u.is_active ? 1 : 0.6 }}>
                <td>
                  <div className="fw-bold">{u.full_name}</div>
                  <div className="small text-muted">{u.email}</div>
                </td>
                <td>
                  {u.is_active ? (
                    <span className="badge bg-success-subtle text-success px-3">Active</span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary px-3">Suspended</span>
                  )}
                </td>
                <td>{u.is_admin ? "⭐ Admin" : "User"}</td>
                <td>
                  {/* Bootstrap Form Switch */}
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={u.is_active}
                      onChange={() => toggleUserStatus(u.id, u.is_active)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-light border me-2">View Orders</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;