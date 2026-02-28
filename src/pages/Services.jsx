import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import VerificationGuard from "../components/VerificationGuard";
import { db } from "../firebase.init";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const servicesQuery = query(
        collection(db, "services"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc"),
      );
      const servicesSnapshot = await getDocs(servicesQuery);
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory,
      );
    }

    setFilteredServices(filtered);
  };

  const categories = [
    "all",
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading services...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark mb-3">Our Services</h1>
        <p className="lead text-muted">
          Comprehensive healthcare services tailored to your needs
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-inbox me-2"></i>
          {services.length === 0
            ? "No services available at the moment."
            : "No services found matching your criteria."}
        </Alert>
      ) : (
        <Row className="g-4">
          {filteredServices.map((service) => (
            <Col key={service.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={
                      service.image ||
                      `https://picsum.photos/seed/${service.name}/400/250.jpg`
                    }
                    alt={service.name}
                    className="card-img-top h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <Badge bg="primary" className="rounded-pill">
                      {service.category || "General"}
                    </Badge>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="h5 mb-3">{service.name}</Card.Title>
                  <Card.Text className="text-muted mb-3">
                    {service.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      {service.duration || "30"} mins
                    </div>
                    <div className="text-success fw-semibold">
                      <i className="bi bi-currency-dollar me-1"></i>$
                      {service.price || "50"}
                    </div>
                  </div>
                  <div className="d-grid">
                    <VerificationGuard
                      action="book appointments"
                      showInlineWarning={true}
                    >
                      <Button
                        as={Link}
                        to={`/checkout/${service.id}`}
                        variant="primary"
                        className="w-100"
                      >
                        <i className="bi bi-calendar-plus me-2"></i>
                        Book Appointment
                      </Button>
                    </VerificationGuard>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Featured Services Section */}
      {services.length > 0 && (
        <div className="mt-5 p-4 bg-light rounded-3">
          <h2 className="text-center mb-4">Why Choose Our Services?</h2>
          <Row className="g-4">
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 bg-transparent">
                <Card.Body className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-shield-check fs-4"></i>
                  </div>
                  <h5 className="mb-3">Expert Care</h5>
                  <p className="text-muted">
                    Professional healthcare providers with extensive experience
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 bg-transparent">
                <Card.Body className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-info text-white rounded-circle mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-clock-history fs-4"></i>
                  </div>
                  <h5 className="mb-3">Flexible Scheduling</h5>
                  <p className="text-muted">
                    Book appointments at your convenience with easy online
                    booking
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 bg-transparent">
                <Card.Body className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i className="bi bi-heart-pulse fs-4"></i>
                  </div>
                  <h5 className="mb-3">Personalized Care</h5>
                  <p className="text-muted">
                    Tailored treatment plans to meet your specific health needs
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Services;
