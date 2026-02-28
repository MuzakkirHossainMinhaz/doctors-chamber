import { Col, Container, Row, Spinner } from "react-bootstrap";

const LoadingSpinner = ({
  message = "Loading Doctor's Chamber services...",
  size = "lg",
  showLogo = true,
}) => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md="auto">
          <div className="text-center">
            {showLogo && (
              <div className="mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-hospital fs-3"></i>
                </div>
                <h4 className="mb-3">Doctor's Chamber</h4>
                <p className="text-muted">Healthcare Management System</p>
              </div>
            )}
            <Spinner
              animation="border"
              variant="primary"
              size={size}
              role="status"
              aria-live="polite"
            />
            <p className="mt-3 text-muted">{message}</p>
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Please wait while we prepare your healthcare experience
              </small>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;
