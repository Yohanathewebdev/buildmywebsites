const Footer = () => {
  return (
    <footer className="footer bg-dark text-light">
      <div className="container py-4">
        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">BuildMyWebsite</h5>
            <p>
              We create modern, secure and scalable digital solutions
              for businesses and individuals.
            </p>
          </div>

          {/* Links */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#services" className="footer-link">Services</a></li>
              <li><a href="#testimonials" className="footer-link">Testimonials</a></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Contact</h6>
            <p>Email: info@buildmywebsite.com</p>
            <p>Phone: +255627540312</p>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center">
          <small>
            © {new Date().getFullYear()} BuildMyWebsite. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
