import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer className="py-5 mt-5" style={{ backgroundColor: 'var(--color-secondary)' }}>
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                src="/logo.png"
                alt="Doctor's Chamber Logo"
                height="40"
                width="40"
                className="rounded-3 shadow-sm"
              />
              <h5 className="text-white mb-0 fw-bold">Doctor's Chamber</h5>
            </div>
            <p className="text-white-75">
              Providing comprehensive healthcare services with modern medical expertise and compassionate care for over 15 years.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white-50 text-decoration-none transition-smooth">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white-50 text-decoration-none transition-smooth">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-white-50 text-decoration-none transition-smooth">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a href="#" className="text-white-50 text-decoration-none transition-smooth">
                <i className="bi bi-instagram fs-5"></i>
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-white mb-3 fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-white-75 text-decoration-none transition-smooth">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-white-75 text-decoration-none transition-smooth">
                  Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/blogs" className="text-white-75 text-decoration-none transition-smooth">
                  Blogs
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white-75 text-decoration-none transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-white mb-3 fw-semibold">Services</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                      <Link to="/services" className="text-white-75 text-decoration-none transition-smooth">
                  Medical Check-ups
                </Link>
              </li>
              <li className="mb-2">
                      <Link to="/services" className="text-white-75 text-decoration-none transition-smooth">
                  Nutrition Advice
                </Link>
              </li>
              <li className="mb-2">
                      <Link to="/services" className="text-white-75 text-decoration-none transition-smooth">
                  Emergency Care
                </Link>
              </li>
              <li className="mb-2">
                      <Link to="/services" className="text-white-75 text-decoration-none transition-smooth">
                  Counselling
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-white mb-3 fw-semibold">Contact Info</h6>
            <div className="text-white-75">
              <p className="mb-2">
                <i className="bi bi-geo-alt me-2" style={{ color: 'var(--color-accent)' }}></i>
                123 Medical Center, Healthcare City
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone me-2" style={{ color: 'var(--color-accent)' }}></i>
                +1 (555) 123-4567
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope me-2" style={{ color: 'var(--color-accent)' }}></i>
                info@doctorschamber.com
              </p>
              <p className="mb-0">
                <i className="bi bi-clock me-2" style={{ color: 'var(--color-accent)' }}></i>
                Mon-Fri: 9:00 AM - 5:00 PM
              </p>
            </div>
          </Col>
        </Row>

        <hr className="border-white-25 my-4" />

        <Row>
          <Col className="text-center">
            <p className="text-white-50 mb-0">
              © {year} Doctor's Chamber. All rights reserved. | 
              <Link to="/privacy" className="text-white-50 text-decoration-none ms-1">Privacy Policy</Link> | 
              <Link to="/terms" className="text-white-50 text-decoration-none ms-1">Terms of Service</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
