import { Alert, Badge, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import AppIcon from "./AppIcon";
import useEmailVerification from "../hooks/useEmailVerification";

const VerificationStatus = ({ showFullAlert = false, compact = false }) => {
  const {
    accountStatus,
    loading,
    timeRemaining,
    isPendingVerification,
    getVerificationMessage,
    getVerificationBadgeVariant,
  } = useEmailVerification();

  if (loading) {
    return compact ? (
      <Badge bg="secondary" className="verification-status-badge rounded-pill">
        <AppIcon name="bi-hourglass-split" className="me-1" />
        Checking...
      </Badge>
    ) : (
      <Alert variant="info" className="verification-status-alert">
        <div className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Checking verification status...</span>
        </div>
      </Alert>
    );
  }

  const getStatusIcon = () => {
    switch (accountStatus) {
      case "verified":
        return "bi-patch-check-fill";
      case "pending_verification":
        return "bi-clock-history";
      case "spam":
        return "bi-shield-exclamation";
      case "suspended":
        return "bi-lock-fill";
      default:
        return "bi-question-circle";
    }
  };

  const getStatusText = () => {
    switch (accountStatus) {
      case "verified":
        return "Verified";
      case "pending_verification":
        return `Pending (${Math.floor(timeRemaining || 0)}h)`;
      case "spam":
        return "Spam";
      case "suspended":
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  if (showFullAlert) {
    return (
      <Container className="my-4">
        <Alert
          variant={getVerificationBadgeVariant()}
          className="verification-status-alert"
        >
          <Row className="align-items-center">
            <Col md="auto">
              <div className="d-flex align-items-center">
                <AppIcon name={getStatusIcon()} className="me-3 fs-4" />
                <div>
                  <h4 className="mb-2">Account Status: {getStatusText()}</h4>
                  <p className="mb-0">{getVerificationMessage()}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Alert>
      </Container>
    );
  }

  if (compact) {
    return (
      <Badge
        bg={getVerificationBadgeVariant()}
        className="verification-status-badge rounded-pill me-2"
      >
        <AppIcon name={getStatusIcon()} className="me-1" />
        {getStatusText()}
      </Badge>
    );
  }

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md="auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center">
                <div className="mb-3">
                  <Badge
                    bg={getVerificationBadgeVariant()}
                    className="verification-status-badge rounded-pill p-3"
                  >
                    <AppIcon
                      name={getStatusIcon()}
                      className="me-2 fs-4"
                    />
                    <span className="fs-5">{getStatusText()}</span>
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-muted mb-0">{getVerificationMessage()}</p>
                </div>

                {isPendingVerification() && (
                  <Alert variant="warning" className="mt-3">
                    <div className="d-flex align-items-center">
                      <AppIcon name="bi-clock" className="me-2" />
                      <span>
                        {Math.floor(timeRemaining || 0)} hours remaining to
                        complete verification
                      </span>
                    </div>
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerificationStatus;
