import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeroSummary from "../pages/HelloSammary"; // adjust path if needed

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      

<section
  className="hero-section text-white text-center"
  
>
  
  <h1 className="display-4 fw-bold mb-3" data-aos="fade-down" data-aos-duration="1200">
    Enhance Digital Transformation & Solutions
  </h1>

  {/* Rotating summaries */}
  <HeroSummary />

  <a href="#services" className="btn btn-warning btn-lg px-5" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400">
    View Our Services
  </a>
</section>


      {/* SERVICES */}
      <section id="services" className="py-5 bg-light">
  <div className="container">

    {/* Section Heading */}
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold">Our Services</h2>
      <p className="lead text-muted">
        Powerful digital solutions designed to grow your business
      </p>
    </div>

    {/* Services Cards */}
    <div className="row g-4">

      {/* Web & Application Development */}
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
        <div className="service-card h-100">
          <div className="icon mb-3">🌐</div>
          <h2 className="fw-bold mb-3">Web & Application Development</h2>
          <ul className="list-unstyled text-muted">
            <li><h3>✔ Modern responsive websites</h3></li>
            <li><h3>✔ Web & mobile applications</h3></li>
            <li><h3>✔ Secure & scalable systems</h3></li>
            <li><h3>✔ Modern technologies</h3></li>
          </ul>
        </div>
      </div>

      {/* SEO & Social Network Marketing */}
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay="400">
        <div className="service-card h-100">
          <div className="icon mb-3">📈</div>
          <h2 className="fw-bold mb-3">SEO & Social Marketing</h2>
          <ul className="list-unstyled text-muted">
            <li><h3>✔ Search engine optimization</h3></li>
            <li><h3>✔ Social media campaigns</h3></li>
            <li><h3>✔ Content visibility</h3></li>
            <li><h3>✔ Performance analytics</h3></li>
          </ul>
        </div>
      </div>

      {/* Graphic Designing */}
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay="600">
        <div className="service-card h-100">
          <div className="icon mb-3">🎨</div>
          <h2 className="fw-bold mb-3">Graphic Designing</h2>
          <ul className="list-unstyled text-muted">
            <li><h3>✔ Brand identity & logos</h3></li>
            <li><h3>✔ Marketing materials</h3></li>
            <li><h3>✔ UI/UX visuals</h3></li>
            <li><h3>✔ Social media graphics</h3></li>
          </ul>
        </div>
      </div>

    </div>

    {/* Call to Action */}
    <div className="text-center mt-5">
      <a href="/services" className="btn btn-dark btn-lg px-5">
        Explore All Services
      </a>
    </div>

  </div>
</section>

<section className="py-5 bg-white">
  <div className="container">

    {/* Heading */}
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold">Why Choose BuildMyWebsite</h2>
      <p className="lead text-muted">
        We combine technology, creativity, and strategy to grow your business online
      </p>
    </div>

    <div className="row g-4">

      {/* Security */}
      <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
        <div className="why-card h-100">
          <div className="icon mb-3">🔐</div>
          <h5 className="fw-bold mb-2">Strong Security</h5>
          <p className="text-muted">
            Secure systems, protected APIs, and safe data handling built to industry standards.
          </p>
        </div>
      </div>

      {/* Responsiveness */}
      <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
        <div className="why-card h-100">
          <div className="icon mb-3">⚡</div>
          <h5 className="fw-bold mb-2">Fast & Responsive</h5>
          <p className="text-muted">
            Smooth performance across all devices with modern responsive design.
          </p>
        </div>
      </div>

      {/* Scalability */}
      <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="500">
        <div className="why-card h-100">
          <div className="icon mb-3">📈</div>
          <h5 className="fw-bold mb-2">Scalable Solutions</h5>
          <p className="text-muted">
            Systems designed to grow with your business without rebuilding from scratch.
          </p>
        </div>
      </div>

      {/* Graphic Designing */}
      <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="700">
        <div className="why-card h-100">
          <div className="icon mb-3">🎨</div>
          <h5 className="fw-bold mb-2">Creative Graphic Design</h5>
          <p className="text-muted">
            Eye-catching designs, modern UI/UX, branding visuals, and marketing graphics that convert visitors.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>



      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-5" data-aos="fade-up">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">What Clients Say</h2>

          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="card shadow text-center">
                <div className="card-body">
                  <p className="fst-italic">
                    "Amazing service! My business grew after launching my site."
                  </p>
                  <h6 className="fw-bold mt-3">— Happy Client</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-5 bg-light" data-aos="fade-up">
  <div className="container">
    <h2 className="text-center fw-bold mb-4">Let’s Talk</h2>
    <p className="text-center mb-5">
      Tell us about your project and we’ll get back to you.
    </p>

    <div className="row justify-content-center">
      <div className="col-md-6">
        <form className="card shadow p-4">

          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe your project"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Send Message
          </button>

        </form>
      </div>
    </div>
  </div>
</section>

    </>
  );
};

export default Home;
