import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container className="my-5">
      <div className="text-center">
        <div className="bg-light rounded-3 p-5 shadow-sm">
          <h1 className="display-1 fw-bold text-danger mb-4">404</h1>
          <div className="d-flex justify-content-center mb-4">
            <img
              className="img-fluid rounded-3"
              style={{ maxWidth: "300px" }}
              src="https://i.ibb.co/hf2q9ys/error.gif"
              alt="404 Error"
            />
          </div>
          <h2 className="mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button
              as={Link}
              to="/"
              variant="primary"
              className="rounded-pill px-4"
            >
              <i className="bi bi-house me-2"></i>
              Go Home
            </Button>
            <Button
              as={Link}
              to="/contact"
              variant="outline-primary"
              className="rounded-pill px-4"
            >
              <i className="bi bi-telephone me-2"></i>
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
