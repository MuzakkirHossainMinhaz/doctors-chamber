import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppIcon from "../components/AppIcon";

const About = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center align-items-center mb-5">
        <Col md={4} className="text-center mb-4">
          <div className="mb-3">
            <img
              src="/logo.png"
              alt="Doctor's Chamber Logo"
              height="120"
              width="120"
              className="rounded-3 shadow-sm"
            />
          </div>
          <h3 className="h4 fw-bold" style={{ color: 'var(--color-secondary)' }}>Doctor's Chamber</h3>
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
                className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3 transition-smooth"
                style={{ width: "60px", height: "60px", backgroundColor: 'var(--color-primary)' }}
              >
                <AppIcon name="bi-heart-pulse" className="fs-3" />
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
                className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3 transition-smooth"
                style={{ width: "60px", height: "60px", backgroundColor: 'var(--color-accent)' }}
              >
                <AppIcon name="bi-shield-check" className="fs-3" />
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
                className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3 transition-smooth"
                style={{ width: "60px", height: "60px", backgroundColor: 'var(--color-warning)' }}
              >
                <AppIcon name="bi-award" className="fs-3" />
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
          <Card className="border-0" style={{ backgroundColor: 'var(--color-gray-50)' }}>
            <Card.Body className="p-5">
              <h2 className="h3 mb-4" style={{ color: 'var(--color-secondary)' }}>About Doctor's Chamber</h2>
              <p className="lead text-muted mb-4">
                A comprehensive healthcare service booking platform designed to
                connect patients with qualified medical professionals, providing
                seamless appointment scheduling, secure payment processing, and
                personalized healthcare management.
              </p>

              <Row className="g-4 text-start">
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold" style={{ color: 'var(--color-primary)' }}>
                    <AppIcon name="bi-check-circle" className="me-2" />
                    Expert Medical Professionals
                  </h5>
                  <p className="text-muted">
                    Access to experienced doctors and specialists across various
                    medical fields, all vetted for quality and expertise.
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold" style={{ color: 'var(--color-success)' }}>
                    <AppIcon name="bi-calendar-check" className="me-2" />
                    Easy Appointment Booking
                  </h5>
                  <p className="text-muted">
                    User-friendly interface for scheduling appointments, with
                    real-time availability updates and automated reminders.
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold" style={{ color: 'var(--color-accent)' }}>
                    <AppIcon name="bi-credit-card" className="me-2" />
                    Secure Payment Processing
                  </h5>
                  <p className="text-muted">
                    Integrated Stripe payment system with multiple payment
                    options and secure transaction processing.
                  </p>
                </Col>
                <Col md={6} className="mb-3">
                  <h5 className="fw-semibold" style={{ color: 'var(--color-warning)' }}>
                    <AppIcon name="bi-chat-dots" className="me-2" />
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
                  <AppIcon name="bi-grid-3x3-gap" className="me-2" />
                  Explore Our Services
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-primary"
                  size="lg"
                  className="rounded-pill"
                >
                  <AppIcon name="bi-telephone" className="me-2" />
                  Contact Us
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={12}>
          <Card className="border-0 transition-smooth" style={{ backgroundColor: 'var(--color-primary)' }}>
            <Card.Body className="text-center p-5 text-white">
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
                  <AppIcon name="bi-person-plus" className="me-2" />
                  Create Account
                </Button>
                <Button
                  as={Link}
                  to="/signin"
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill"
                >
                  <AppIcon name="bi-box-arrow-in-right" className="me-2" />
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
