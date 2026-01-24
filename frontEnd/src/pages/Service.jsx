import { useEffect, useState } from "react";
import { fetchServices } from "../api/services";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices()
      .then((data) => {
        console.log("SERVICES FROM API:", data); // 🔍 DEBUG
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Our Services</h2>

      <div className="row">
        {services.map((service) => (
          <div className="col-md-4 mb-4" key={service.id}>
            <div className="card h-100 shadow-sm">

              {/* IMAGE */}
              {service.images?.length > 0 ? (
                <img
                  src={service.images[0].image}
                  alt={service.images[0].caption}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-secondary text-white"
                  style={{ height: "200px" }}
                >
                  No Image
                </div>
              )}

              <div className="card-body">
                <h5>{service.title}</h5>
                <p>{service.description}</p>

                <p className="fw-bold">
                  {service.price} {service.currency}
                </p>

                {/* DURATIONS */}
                {service.durations?.map((d) => (
                  <span key={d.id} className="badge bg-info me-1">
                    {d.duration}
                  </span>
                ))}

                {/* TYPE */}
                <div className="mt-2">
                  <span className="badge bg-success">
                    {service.type.toUpperCase()}
                  </span>
                </div>

                {/* CAPTION */}
                {service.images?.[0]?.caption && (
                  <p className="mt-2 text-muted">
                    {service.images[0].caption}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
