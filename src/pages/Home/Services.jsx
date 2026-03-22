import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchServicesFromFirestore } from "../../utils/serviceData";
import Service from "./Service.jsx";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoading(true);

    const loadServices = async () => {
      try {
        const firestoreServices = await fetchServicesFromFirestore({
          activeOnly: true,
        });
        setServices(firestoreServices);
        setLoadFailed(false);
      } catch (error) {
        console.error("Error loading Firestore services:", error);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
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
      className="home-services-section position-relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-gray-50)' }}
    >
      <Container className="services-shell">
        <div className="text-center mb-5 mx-auto" style={{ maxWidth: "44rem" }}>
          <div className="d-inline-flex align-items-center bg-white rounded-pill shadow-sm mb-4 px-4 py-2">
            <span className="me-2" style={{ color: 'var(--color-primary)' }}>
              <i className="bi bi-heart-pulse fs-4"></i>
            </span>
            <span className="fw-semibold">Our Services</span>
          </div>

          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--color-secondary)' }}>
            Comprehensive Healthcare Services
          </h1>
          <p className="lead text-muted">
            We provide a wide range of medical services with modern equipment
            and experienced professionals to ensure your health and well-being.
          </p>
        </div>

        {!loading && services.length > 0 && (
          <div className="text-center mb-4">
            <div className="services-filter-bar d-inline-flex flex-wrap justify-content-center gap-2 p-3 bg-white shadow-sm">
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
            <div className="spinner-border mb-3" style={{ color: 'var(--color-primary)' }}></div>
            <p>Loading services...</p>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {filteredServices.map((service) => (
                <Col key={service.id} lg={4} md={6} className="mb-4">
                  <Service service={service} />
                </Col>
              ))}
            </Row>

            {filteredServices.length === 0 && (
              <div className="services-empty-state text-center mx-auto">
                <i className={`bi ${loadFailed ? "bi-wifi-off" : "bi-inbox"} fs-1 mb-3`}></i>
                <h3>{loadFailed ? "We could not load live services" : "No services found yet"}</h3>
                <p className="text-muted mb-0">
                  {loadFailed
                    ? "Firestore data is unavailable right now. Patients should still be able to reach the care team directly."
                    : "There are no active services published yet. Add active service records in Firestore to populate this section."}
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                  <Button
                    as={Link}
                    to="/contact"
                    variant="primary"
                    className="rounded-pill"
                  >
                    <i className="bi bi-telephone me-2"></i>
                    Contact Care Team
                  </Button>
                  <Button
                    as={Link}
                    to="/signin"
                    variant="outline-primary"
                    className="rounded-pill"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Button>
                </div>
              </div>
            )}

            <div className="services-cta text-center rounded-4">
              <div className="d-flex flex-wrap justify-content-center gap-3 mb-3">
                <span className="services-cta-badge rounded-pill">
                  <i className="bi bi-database-check"></i>
                  Live Firestore-backed services
                </span>
                <span className="services-cta-badge rounded-pill">
                  <i className="bi bi-person-check"></i>
                  Verified booking flow
                </span>
              </div>
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
                  to="/services"
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
