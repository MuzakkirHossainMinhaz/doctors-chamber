import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Service from "./Service.jsx";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch("Services.json")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading services:", error);
        setLoading(false);
      });
  }, []);

  const categories = [
    "all",
    ...new Set(services.map((service) => service.category)),
  ];

  const filteredServices =
    filter === "all"
      ? services
      : services.filter((service) => service.category === filter);

  return (
    <section
      id="services"
      className="py-5 bg-light position-relative overflow-hidden"
    >
      <Container>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center bg-white rounded-pill shadow-sm mb-4 px-4 py-2">
            <span className="text-primary me-2">
              <i className="bi bi-heart-pulse fs-4"></i>
            </span>
            <span className="fw-semibold">Our Services</span>
          </div>

          <h1 className="display-5 fw-bold text-dark mb-3">
            Comprehensive Healthcare Services
          </h1>
          <p className="lead text-muted">
            We provide a wide range of medical services with modern equipment
            and experienced professionals to ensure your health and well-being.
          </p>
        </div>

        {!loading && services.length > 0 && (
          <div className="mb-5">
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "primary" : "outline-primary"}
                  onClick={() => setFilter(category)}
                  className="rounded-pill"
                >
                  {category === "all" ? "All Services" : category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3"></div>
            <p>Loading services...</p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {filteredServices.map((service, index) => (
                <Col key={service.id} lg={4} md={6} className="mb-4">
                  <Service service={service} />
                </Col>
              ))}
            </Row>

            {filteredServices.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                <h3>No services found</h3>
                <p>Try selecting a different category.</p>
              </div>
            )}

            <div className="text-center mt-5 p-4 bg-white rounded-3 shadow-sm">
              <div className="mb-3">
                <h3>Need a personalized consultation?</h3>
                <p>
                  Book an appointment with our expert doctors for tailored
                  medical advice.
                </p>
              </div>
              <div className="d-flex justify-content-center gap-3">
                <Button
                  as={Link}
                  to="/checkout"
                  variant="primary"
                  size="lg"
                  className="rounded-pill"
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  Book Appointment
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
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default Services;
