import { useEffect, useState } from "react";
import { fetchServices } from "../api/services";
import { Link } from "react-router-dom";

const ServicesPreview = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(data => {
        setServices(data.slice(0, 3)); // show only 3
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading services...</p>;

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Our Services</h2>
      <div className="row">
        {services.map(service => (
          <div className="col-md-4 mb-4" key={service.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={service.images?.[0]?.image}
                className="card-img-top"
                alt={service.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5>{service.title}</h5>
                <p>{service.description.slice(0, 80)}...</p>
                <p className="fw-bold">
                  {service.price} {service.currency}
                </p>
                <Link to="/services" className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPreview;
