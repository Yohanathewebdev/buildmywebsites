import logo1 from "./assets/logo1.png";
import { useNavigate } from "react-router-dom";
import "./Kavbar.css"; // for hover dropdown styling

const Kavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        {/* Logo + Site Name */}
        <div className="d-flex align-items-center">
          <img
            src={logo1}
            alt="BuildMyWebsite"
            height="180"
            width= ""
            
            className="me-2 shadow-sm"
          />
          <span className="navbar-brand fw-bold fs-4 text-white"></span>
        </div>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item mx-3" onClick={() => navigate("/")}>
              <span className="nav-link fw-bold text-white menu-item">Home</span>
            </li>

            <li className="nav-item mx-3" onClick={() => navigate("/services")}>
              <span className="nav-link fw-bold text-white menu-item">Services</span>
            </li>

            <li className="nav-item mx-3" onClick={() => navigate("/services-completed")}>
              <span className="nav-link fw-bold text-white menu-item">Services Completed</span>
            </li>

            {/* Place Order Dropdown */}
            <li className="nav-item dropdown mx-3">
              <span className="nav-link fw-bold text-white menu-item">Place Order</span>
              <ul className="dropdown-menu-custom">
                <li>
                  <span className="dropdown-item" onClick={() => navigate("/login")}>
                    Login to Place Order
                  </span>
                </li>
                <li>
                  <span className="dropdown-item" onClick={() => navigate("/register")}>
                    Register to Place Order
                  </span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Kavbar;
