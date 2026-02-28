import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { Navigate, useLocation } from "react-router-dom";
import useAuthRole from "../hooks/useAuthRole";

const ProtectedRoute = ({
  children,
  requiredRole,
  requiredRoles = [],
  fallbackPath = "/signin",
  adminOnly = false,
}) => {
  const { user, userRole, loading, isAdmin } = useAuthRole();
  const location = useLocation();

  // Check if user is authenticated
  if (!user && !loading) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md="auto">
              <div className="text-center">
                <div className="mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3"
                    style={{ width: "60px", height: "60px", backgroundColor: 'var(--color-primary)' }}
                  >
                    <i className="bi bi-hospital fs-4"></i>
                  </div>
                  <h4 className="mb-3">Doctor's Chamber</h4>
                  <p className="text-muted">
                    Verifying your healthcare access...
                  </p>
                </div>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">
                  Please wait while we verify your credentials
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Check role-based access
  let hasAccess = false;

  if (adminOnly) {
    hasAccess = isAdmin();
  } else if (requiredRole) {
    hasAccess = userRole === requiredRole;
  } else if (requiredRoles.length > 0) {
    hasAccess = requiredRoles.includes(userRole);
  } else {
    // If no specific role required, just check authentication
    hasAccess = !!user;
  }

  if (!hasAccess && !loading) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>
            <i className="bi bi-shield-exclamation me-2"></i>
            Access Denied - Doctor's Chamber
          </Alert.Heading>
          <p className="mb-3">
            You don't have permission to access this healthcare service.
            {userRole && (
              <span>
                {" "}
                Your current role: <strong>{userRole}</strong>
              </span>
            )}
          </p>
          <hr />
          <p className="mb-3">
            <strong>Required Access Level:</strong>{" "}
            {requiredRole || "Healthcare Provider"}
          </p>
          <p className="mb-0">
            Please contact your healthcare administrator if you believe this is
            an error.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Button variant="outline-primary" href="/home">
              <i className="bi bi-house me-2"></i>
              Return Home
            </Button>
            <Button variant="outline-secondary" href="/signin">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Sign In Again
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // User has access, render children
  return children;
};

export default ProtectedRoute;
