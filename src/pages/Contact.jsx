import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container className="my-5">
        <Alert variant="success" className="text-center">
          <Alert.Heading>
            <i className="bi bi-check-circle me-2"></i>
            Message Sent Successfully!
          </Alert.Heading>
          <p>
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <Button variant="success" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="bg-light rounded-3 p-5 mb-5">
        <h1 className="display-4 fw-bold text-dark mb-3 text-center">
          Contact Us
        </h1>
        <p className="lead text-muted text-center">
          Get in touch with us for appointments, inquiries, or emergencies
        </p>
      </div>

      <Row className="g-4">
        {/* Contact Information */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-3"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-geo-alt fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-2">Address</h5>
                    <p className="text-muted">
                      123 Healthcare Avenue
                      <br />
                      Medical District, MD 12345
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-3"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-telephone fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-2">Phone</h5>
                    <p className="text-muted">
                      Main: (555) 123-4567
                      <br />
                      Emergency: (555) 911-HELP
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-3"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-envelope fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-2">Email</h5>
                    <p className="text-muted">
                      info@doctorschamber.com
                      <br />
                      emergency@doctorschamber.com
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-3"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <i className="bi bi-clock fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-2">Hours</h5>
                    <p className="text-muted">
                      Mon-Fri: 8:00 AM - 8:00 PM
                      <br />
                      Sat: 9:00 AM - 6:00 PM
                      <br />
                      Sun: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <Card className="mt-4 border-0 bg-danger text-white">
                <Card.Body className="text-center p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-telephone-fill fs-3"></i>
                  </div>
                  <h5 className="mb-2">Emergency?</h5>
                  <p className="mb-3">
                    For medical emergencies, call us immediately
                  </p>
                  <Button variant="light" size="lg" className="rounded-pill">
                    <i className="bi bi-telephone-fill me-2"></i>
                    Call (555) 911-HELP
                  </Button>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>

        {/* Contact Form */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0 p-4">
              <h4 className="mb-2 text-center">Send us a Message</h4>
              <p className="text-muted text-center mb-0">
                Fill out the form below and we'll respond as soon as possible
              </p>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject *</Form.Label>
                      <Form.Select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="appointment">Book Appointment</option>
                        <option value="inquiry">General Inquiry</option>
                        <option value="emergency">Emergency</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                  />
                </Form.Group>

                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="rounded-pill px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Quick Links */}
          <Card className="mt-4 border-0 bg-light">
            <Card.Body className="p-4">
              <h5 className="mb-3 text-center">Quick Links</h5>
              <Row className="g-3">
                <Col md={4} className="mb-3">
                  <Button
                    variant="outline-primary"
                    className="w-100 rounded-pill"
                  >
                    <i className="bi bi-calendar-plus me-2"></i>
                    Book Appointment
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button
                    variant="outline-primary"
                    className="w-100 rounded-pill"
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    FAQ
                  </Button>
                </Col>
                <Col md={4} className="mb-3">
                  <Button
                    variant="outline-primary"
                    className="w-100 rounded-pill"
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Live Chat
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
