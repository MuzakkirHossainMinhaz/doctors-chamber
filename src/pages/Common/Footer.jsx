import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppIcon from "../../components/AppIcon";
import { fetchServicesFromFirestore } from "../../utils/serviceData";
import "./Footer.css";

const Footer = () => {
  const [footerServices, setFooterServices] = useState([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    const loadFooterServices = async () => {
      try {
        const services = await fetchServicesFromFirestore({ activeOnly: true });
        setFooterServices(services.slice(0, 4));
      } catch (error) {
        console.error("Error loading footer services:", error);
      }
    };

    loadFooterServices();
  }, []);

  return (
    <footer className="site-footer">
      <Container>
        <Row className="g-4">
          <Col lg={4} md={6}>
            <div className="d-inline-flex align-items-center gap-3 mb-3">
              <span className="footer-brand-mark rounded-4">
                <img
                  src="/logo.png"
                  alt="Doctor's Chamber Logo"
                  height="34"
                  width="34"
                />
              </span>
              <div className="lh-sm">
                <span
                  className="d-block text-uppercase"
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    fontSize: "0.8rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  Care Platform
                </span>
                <strong
                  className="d-block text-white"
                  style={{ fontSize: "1.1rem" }}
                >
                  Doctor&apos;s Chamber
                </strong>
              </div>
            </div>

            <p
              className="mb-4"
              style={{ maxWidth: "24rem", color: "rgba(255,255,255,0.78)" }}
            >
              A healthcare service platform for discovery, verified booking,
              patient communication, and staff-side operational follow-through.
            </p>

            <div className="footer-cta rounded-4">
              <AppIcon name="bi-shield-check" />
              <div>
                <strong className="d-block text-white">
                  Protected patient flows
                </strong>
                <small>
                  Email verification, role gating, and booking controls.
                </small>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <a href="/" aria-label="Doctor's Chamber on Facebook">
                <AppIcon name="bi-facebook" className="fs-5" />
              </a>
              <a href="/" aria-label="Doctor's Chamber on Twitter">
                <AppIcon name="bi-twitter" className="fs-5" />
              </a>
              <a href="/" aria-label="Doctor's Chamber on LinkedIn">
                <AppIcon name="bi-linkedin" className="fs-5" />
              </a>
              <a href="/" aria-label="Doctor's Chamber on Instagram">
                <AppIcon name="bi-instagram" className="fs-5" />
              </a>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h6 className="footer-heading text-white text-uppercase fw-bold">
              Quick Links
            </h6>
            <ul className="footer-list list-unstyled">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/blogs">Blogs</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="footer-heading text-white text-uppercase fw-bold">
              Live Services
            </h6>
            <ul className="footer-list list-unstyled">
              {footerServices.length > 0 ? (
                footerServices.map((service) => (
                  <li key={service.id}>
                    <Link to="/services">{service.name}</Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/services">Browse available services</Link>
                </li>
              )}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="footer-heading text-white text-uppercase fw-bold">
              Contact Info
            </h6>
            <div className="d-grid gap-3">
              <div className="footer-info-item">
                <span className="footer-info-icon rounded-circle">
                  <AppIcon name="bi-geo-alt" />
                </span>
                <div>
                  <strong className="d-block text-white">Visit</strong>
                  <small>123 Medical Center, Healthcare City</small>
                </div>
              </div>

              <div className="footer-info-item">
                <span className="footer-info-icon rounded-circle">
                  <AppIcon name="bi-telephone" />
                </span>
                <div>
                  <strong className="d-block text-white">Call</strong>
                  <small>+1 (555) 123-4567</small>
                </div>
              </div>

              <div className="footer-info-item">
                <span className="footer-info-icon rounded-circle">
                  <AppIcon name="bi-envelope" />
                </span>
                <div>
                  <strong className="d-block text-white">Email</strong>
                  <small>info@doctorschamber.com</small>
                </div>
              </div>

              <div className="footer-info-item">
                <span className="footer-info-icon rounded-circle">
                  <AppIcon name="bi-clock" />
                </span>
                <div>
                  <strong className="d-block text-white">Hours</strong>
                  <small>Mon-Fri: 9:00 AM - 5:00 PM</small>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <div className="d-flex flex-wrap justify-content-between gap-3">
          <p className="mb-0">
            &copy; {year} Doctor&apos;s Chamber. All rights reserved.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/contact">Patient Support</Link>
            <Link to="/services">Book a Service</Link>
            <Link to="/blogs">Health Articles</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
