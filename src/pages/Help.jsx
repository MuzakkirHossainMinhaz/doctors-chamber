import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Browse the services page, choose a service, and complete the booking flow with your preferred date and time.",
  },
  {
    question: "Where can I see my payment history?",
    answer:
      "Open the billing page from the account menu to review payment records and booking receipts.",
  },
  {
    question: "How do I contact the clinic?",
    answer:
      "Use the contact page for inquiries or the chat page for support conversations with staff.",
  },
];

const Help = () => (
  <Container className="my-5">
    <div
      className="rounded-3 p-5 mb-4"
      style={{ backgroundColor: "var(--color-gray-50)" }}
    >
      <h1 className="display-5 fw-bold text-center">Help & Support</h1>
      <p className="lead text-muted text-center mb-0">
        Find common answers, support channels, and quick actions.
      </p>
    </div>

    <Row className="g-4">
      <Col lg={8}>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Frequently Asked Questions</h5>
          </Card.Header>
          <Card.Body>
            {faqs.map((faq) => (
              <div key={faq.question} className="mb-4">
                <h6>{faq.question}</h6>
                <p className="text-muted mb-0">{faq.answer}</p>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Quick Actions</h5>
          </Card.Header>
          <Card.Body className="d-grid gap-3">
            <Button as={Link} to="/contact" variant="outline-primary">
              Contact Us
            </Button>
            <Button as={Link} to="/chat" variant="outline-primary">
              Open Support Chat
            </Button>
            <Button as={Link} to="/services" variant="outline-primary">
              Browse Services
            </Button>
            <Button as={Link} to="/settings" variant="outline-primary">
              Manage Settings
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Help;
