import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Simple email validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Input validations
    if (fullName.length < 3) {
      setError("Full Name must be at least 3 characters");
      return;
    }

    if (username.length < 3 || username.includes(" ")) {
      setError("Username must be at least 3 characters and contain no spaces");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
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
      const response = await axios.post("http://127.0.0.1:8000/users/register/", {
        full_name: fullName,
        username,
        email,
        password,
      });

      const userData = {
        id: response.data.id,
        email: response.data.email,
        full_name: response.data.full_name,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      alert(`Registration successful! please login to your account`);

      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please check your details.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "12px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#6A5ACD",
        }}
      >
        {/* Register heading */}
        <h4 className="text-center mb-4 fw-bold" style={{ color: "#ffff" }}>
          Register here to place order
        </h4>

        {/* Error message */}
        {error && (
          <p className="text-center fw-bold" style={{ color: "#ff4d4f", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ borderColor: "#FFD700", backgroundColor: "#222", color: "#fff" }}
            />
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ borderColor: "#FFD700", backgroundColor: "#222", color: "#fff" }}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderColor: "#FFD700", backgroundColor: "#222", color: "#fff" }}
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
              style={{ borderColor: "#FFD700", backgroundColor: "#222", color: "#fff" }}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ borderColor: "#FFD700", backgroundColor: "#222", color: "#fff" }}
            />
          </div>

          {/* Register button */}
          <button type="submit" className="btn btn-success w-100 fw-bold mt-2">
            Register
          </button>
        </form>

        {/* Login link */}
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
