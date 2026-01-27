import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://buildmywebsites-production.up.railway.app";

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validations
    if (fullName.length < 3) {
      setError("Full name must be at least 3 characters");
      return;
    }
    if (username.length < 3 || username.includes(" ")) {
      setError("Username must be at least 3 characters and contain no spaces");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/users/register/`,
        {
          full_name: fullName,
          username,
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000, // 10s timeout for cold start
        }
      );

      console.log("REGISTER SUCCESS:", response.data);
      alert("Registration successful! Please login to your account.");
      navigate("/login");

    } catch (err) {
      console.error(err);

      if (!err.response) {
        setError(
          "Server unreachable. The backend may be asleep. Please try again in a few seconds."
        );
        return;
      }

      const data = err.response.data;

      // DRF validation errors handling
      const messages = [];
      for (const key in data) {
        if (Array.isArray(data[key])) {
          messages.push(`${key}: ${data[key].join(" ")}`);
        } else if (typeof data[key] === "string") {
          messages.push(`${key}: ${data[key]}`);
        }
      }

      setError(messages.join(" | ") || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "12px", backgroundColor: "#6A5ACD" }}
      >
        <h4 className="text-center mb-4 fw-bold text-white">Create an Account</h4>

        {error && <p className="text-center fw-bold text-danger">{error}</p>}

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
