import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const API_URL = "https://buildmywebsites-production.up.railway.app";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        '${API_URL} /users/login/',
        { email, password }
      );

      // ✅ SINGLE SOURCE OF TRUTH (user + token together)
      const userData = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
        token: data.token,
      };

      // ✅ Save user globally
      setUser(userData);

      // ✅ Persist across refresh
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Redirect by role
      navigate(userData.is_admin ? "/admin/dashboard" : "/darshboard");

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "350px",
          borderRadius: "12px",
          backgroundColor: "#6A5ACD",
        }}
      >
        <h4 className="text-center mb-4 fw-bold text-white">
          Login to your account
        </h4>

        {error && (
          <div className="alert alert-danger text-center fw-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderColor: "#FFD700",
                backgroundColor: "#222",
                color: "#fff",
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderColor: "#FFD700",
                backgroundColor: "#222",
                color: "#fff",
              }}
            />
            <div className="text-end mt-1">
              <span
                className="text-warning"
                style={{ cursor: "pointer", fontSize: "0.9rem" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-success w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center text-white">
          Don&apos;t have an account?{" "}
          <span
            className="text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
