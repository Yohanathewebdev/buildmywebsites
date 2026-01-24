import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{service.title}</h5>
        <p className="card-text">{service.short_description}</p>

        {/* 🔐 PROTECTED PART */}
        {user ? (
          <>
            <p className="fw-bold text-success">
              Price: ${service.price}
            </p>

            <Link
              to={`/services/${service.id}`}
              className="btn btn-primary"
            >
              View Details
            </Link>
          </>
        ) : (
          <p className="text-muted fst-italic">
            Login to view price & details
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
