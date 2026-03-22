import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Banner.css";

const Banner = ({ services = [] }) => {
  const activeServiceCount = services.length;
  const featuredCategories = [
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ].slice(0, 3);
  const heroStatusLabel =
    activeServiceCount > 0
      ? `${activeServiceCount} live services synced from Firestore`
      : "Platform-ready care discovery and booking";

  const heroPillars = [
    {
      icon: "bi-shield-check",
      title: "Verified access",
      text: "Account-state checks and protected booking keep patient actions gated correctly.",
    },
    {
      icon: "bi-calendar2-check",
      title: "Live scheduling",
      text: "Service records drive booking availability instead of static frontend placeholders.",
    },
    {
      icon: "bi-chat-dots",
      title: "Patient engagement",
      text: "Messaging, notifications, and follow-up flows stay connected to the same platform.",
    },
  ];

  return (
    <section className="hero-shell position-relative overflow-hidden">
      <div className="hero-orb hero-orb-coral"></div>
      <div className="hero-orb hero-orb-blue"></div>
      <div className="hero-grid"></div>

      <Container className="position-relative hero-content">
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <div className="hero-copy">
              <div className="hero-chip">
                <i className="bi bi-heart-pulse-fill"></i>
                <span>{heroStatusLabel}</span>
              </div>

              <h1 className="hero-title">
                Book care through a homepage that feels
                <span> trustworthy, structured, and actually useful.</span>
              </h1>

              <p className="hero-lead">
                The hero now behaves like a product surface, not a slideshow.
                Patients can understand the flow immediately, see live service
                coverage, and move into booking or support without visual noise.
              </p>

              <div className="hero-actions">
                <Button
                  as={Link}
                  to="/services"
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-4"
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Browse Services
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill px-4"
                >
                  <i className="bi bi-telephone me-2"></i>
                  Contact Care Team
                </Button>
              </div>

              <div className="hero-metrics">
                <div className="hero-metric">
                  <strong>{activeServiceCount || "0"}</strong>
                  <span>Live services from Firestore</span>
                </div>
                <div className="hero-metric">
                  <strong>3</strong>
                  <span>Core patient workflow stages</span>
                </div>
                <div className="hero-metric">
                  <strong>24/7</strong>
                  <span>Digital access to requests and support</span>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={5}>
            <div className="hero-panel">
              <div className="hero-panel-top">
                <div>
                  <p className="hero-panel-label">Platform focus</p>
                  <h2>Patient-facing care, backed by staff workflows</h2>
                </div>
                <div className="hero-panel-badge">
                  <i className="bi bi-hospital"></i>
                </div>
              </div>

              <div className="hero-category-row">
                {featuredCategories.length > 0 ? (
                  featuredCategories.map((category) => (
                    <span key={category} className="hero-category-chip">
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="hero-category-chip">Service data loading</span>
                )}
              </div>

              <div className="hero-track">
                <div className="hero-track-node is-active">
                  <span>1</span>
                  <div>
                    <strong>Discover</strong>
                    <p>Explore active services and care categories.</p>
                  </div>
                </div>
                <div className="hero-track-node is-active">
                  <span>2</span>
                  <div>
                    <strong>Book</strong>
                    <p>Select dates and Firestore-backed time slots.</p>
                  </div>
                </div>
                <div className="hero-track-node">
                  <span>3</span>
                  <div>
                    <strong>Follow through</strong>
                    <p>Notifications, payments, and staff-side workflows continue the flow.</p>
                  </div>
                </div>
              </div>

              <div className="hero-pillar-list">
                {heroPillars.map((pillar) => (
                  <div key={pillar.title} className="hero-pillar-card">
                    <i className={`bi ${pillar.icon}`}></i>
                    <div>
                      <strong>{pillar.title}</strong>
                      <p>{pillar.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Banner;
