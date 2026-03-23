import { Badge, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppIcon from "../../components/AppIcon";

const Service = ({ service }) => {
  const { id, name, img, image, price, description, duration, category, icon } =
    service;
  const navigate = useNavigate();
  const displayImage = image || img;

  const navigateToCheckout = (serviceId) => {
    navigate(`/checkout/${serviceId}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      General: "primary",
      Emergency: "danger",
      Surgery: "warning",
      Consultation: "info",
      Diagnostic: "success",
    };
    return colors[category] || "secondary";
  };

  return (
    <Card className="h-100 shadow-sm border-0 animate-fade-in-up">
      <div className="position-relative overflow-hidden">
        {displayImage ? (
          <Card.Img
            variant="top"
            src={displayImage}
            className="h-100 object-fit-cover"
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              minHeight: "240px",
              background:
                "linear-gradient(135deg, var(--color-secondary-light), var(--color-accent-light))",
            }}
          >
            <AppIcon
              name={icon || "bi-heart-pulse"}
              className="text-white fs-1"
            />
          </div>
        )}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient bg-opacity-50">
          <div className="position-absolute top-50 start-50 translate-middle">
            <AppIcon
              name={icon || "bi-heart-pulse"}
              className="text-white fs-3"
            />
          </div>
          <Badge
            bg={getCategoryColor(category)}
            className="position-absolute top-0 end-0 m-2"
          >
            {category}
          </Badge>
        </div>
      </div>

      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <Card.Title className="h5 mb-0">{name}</Card.Title>
          <div className="d-flex align-items-center gap-2">
            <div className="fw-bold" style={{ color: 'var(--color-primary)' }}>${price}</div>
            {duration && (
              <span className="text-muted">
                <AppIcon name="bi-clock" className="me-1" />
                {duration}
              </span>
            )}
          </div>
        </div>

        <Card.Text className="text-muted mb-4">{description}</Card.Text>

        <div className="d-flex gap-3 mb-4">
          <div className="d-flex align-items-center">
            <AppIcon
              name="bi-check-circle"
              className="me-2"
              style={{ color: "var(--color-success)" }}
            />
            <span>Expert Doctors</span>
          </div>
          <div className="d-flex align-items-center">
            <AppIcon
              name="bi-shield-check"
              className="me-2"
              style={{ color: "var(--color-success)" }}
            />
            <span>Safe & Secure</span>
          </div>
          <div className="d-flex align-items-center">
            <AppIcon
              name="bi-award"
              className="me-2"
              style={{ color: "var(--color-success)" }}
            />
            <span>Certified Care</span>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-0 p-3">
        <div className="d-flex gap-2">
          <Button
            onClick={() => navigateToCheckout(id)}
            variant="primary"
            size="lg"
            className="flex-fill"
          >
            <AppIcon name="bi-calendar-plus" className="me-2" />
            Book Now
          </Button>
          <Button variant="outline-primary" size="lg" className="flex-fill">
            <AppIcon name="bi-info-circle" className="me-2" />
            Details
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default Service;
