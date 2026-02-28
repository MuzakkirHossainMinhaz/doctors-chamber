import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center align-items-center mb-5">
        <Col md={4} className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
            style={{ width: "120px", height: "120px" }}
          >
            <i className="bi bi-hospital fs-2"></i>
          </div>
          <h3 className="h4 fw-bold">Doctor's Chamber</h3>
          <Badge bg="success" className="rounded-pill">
            Healthcare Platform
          </Badge>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={4} md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bi bi-heart-pulse fs-3"></i>
              </div>
              <Card.Title className="h5">Our Mission</Card.Title>
              <Card.Text className="text-muted">
                To provide comprehensive healthcare services with modern
                technology and compassionate care, ensuring the well-being of
                every patient through expert medical professionals and
                state-of-the-art facilities.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-info text-white rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bi bi-shield-check fs-3"></i>
              </div>
              <Card.Title className="h5">Our Vision</Card.Title>
              <Card.Text className="text-muted">
                To be the leading healthcare platform that combines cutting-edge
                technology with personalized patient care, making quality
                healthcare accessible to everyone, anytime and anywhere.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-warning text-white rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bi bi-award fs-3"></i>
              </div>
              <Card.Title className="h5">Our Values</Card.Title>
              <Card.Text className="text-muted">
                Compassion, Excellence, Innovation, and Integrity guide
                everything we do, ensuring every patient receives the highest
                quality care with respect and dignity.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={12} className="text-center">
          <Card className="border-0 bg-light">
            <Card.Body className="p-5">
              <h2 className="h3 mb-4">About Doctor's Chamber</h2>
              <p className="lead text-muted mb-4">
                A comprehensive healthcare service booking platform designed to
                connect patients with qualified medical professionals, providing
                seamless appointment scheduling, secure payment processing, and
                personalized healthcare management.
              </p>

              <Row className="g-4 text-start">
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold text-primary">
                    <i className="bi bi-check-circle me-2"></i>
                    Expert Medical Professionals
                  </h5>
                  <p className="text-muted">
                    Access to experienced doctors and specialists across various
                    medical fields, all vetted for quality and expertise.
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold text-success">
                    <i className="bi bi-calendar-check me-2"></i>
                    Easy Appointment Booking
                  </h5>
                  <p className="text-muted">
                    User-friendly interface for scheduling appointments, with
                    real-time availability updates and automated reminders.
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold text-info">
                    <i className="bi bi-credit-card me-2"></i>
                    Secure Payment Processing
                  </h5>
                  <p className="text-muted">
                    Integrated Stripe payment system with multiple payment
                    options and secure transaction processing.
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold text-warning">
                    <i className="bi bi-chat-dots me-2"></i>
                    Real-time Communication
                  </h5>
                  <p className="text-muted">
                    Built-in messaging system for direct communication between
                    patients and healthcare providers.
                  </p>
                </Col>
              </Row>

              <div className="text-center mt-5">
                <Button
                  as={Link}
                  to="/services"
                  variant="primary"
                  size="lg"
                  className="rounded-pill me-3"
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Explore Our Services
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill"
                >
                  <i className="bi bi-telephone me-2"></i>
                  Contact Us
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={12}>
          <Card className="border-0 bg-primary text-white">
            <Card.Body className="text-center p-5">
              <h3 className="h3 mb-4">Get Started Today</h3>
              <p className="lead mb-4">
                Join thousands of satisfied patients who trust Doctor's Chamber
                for their healthcare needs.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button
                  as={Link}
                  to="/register"
                  variant="light"
                  size="lg"
                  className="rounded-pill"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </Button>
                <Button
                  as={Link}
                  to="/signin"
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill"
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
