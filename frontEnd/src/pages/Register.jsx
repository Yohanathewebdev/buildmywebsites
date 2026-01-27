import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const API_URL = "https://buildmywebsites-production.up.railway.app";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // ======================
    // Client-side validation
    // ======================
    if (fullName.trim().length < 3) {
      return setError("Full Name must be at least 3 characters");
    }

    if (username.trim().length < 3 || username.includes(" ")) {
      return setError("Username must be at least 3 characters and contain no spaces");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/users/register/`,
        {
          full_name: fullName,
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ REQUIRED for Django
        }
      );

      const userData = response.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      alert("Registration successful! Please login to your account.");
      navigate("/login");

    } catch (err) {
      console.error("Registration error:", err);

      if (err.response?.data) {
        // Show backend validation error
        const backendError =
          err.response.data.detail ||
          err.response.data.error ||
          "Registration failed. Please check your details.";
        setError(backendError);
      } else {
        setError("Server unreachable. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "12px",
          backgroundColor: "#6A5ACD",
        }}
      >
        <h4 className="text-center mb-4 fw-bold text-white">
          Register here to place order
        </h4>

        {error && (
          <p className="text-center fw-bold text-danger">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white fw-bold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center text-white">
          Already have an account?{" "}
          <span
            className="text-warning"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
