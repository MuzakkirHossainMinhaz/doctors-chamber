import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import useEmailVerification from "../hooks/useEmailVerification";

const VerificationGuard = ({
  children,
  action = "perform this action",
  showInlineWarning = false,
  customMessage = null,
}) => {
  const {
    loading,
    verificationLoading,
    timeRemaining,
    isPendingVerification,
    isSpam,
    isSuspended,
    canPerformAction,
    sendVerificationEmail,
    checkEmailVerified,
    getVerificationMessage,
    getVerificationBadgeVariant,
  } = useEmailVerification();

  // Show loading state
  if (loading) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md="auto">
            <div className="text-center">
              <Spinner animation="border" variant="primary" className="me-2" />
              <span className="text-muted">Verifying account status...</span>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // User can perform action
  if (canPerformAction()) {
    return children;
  }

  // Show appropriate warning based on status
  const renderWarning = () => {
    if (isPendingVerification()) {
      return (
        <Alert variant="warning" className="verification-alert">
          <Container>
            <Row className="align-items-center mb-3">
              <Col md="auto">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-3 fs-4"></i>
                  <div>
                    <h4 className="mb-2">Email Verification Required</h4>
                    <Badge
                      bg={getVerificationBadgeVariant()}
                      className="ms-auto rounded-pill"
                    >
                      Pending Verification
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <p className="mb-3">
                  You must verify your email address before you can {action}.
                  {customMessage || getVerificationMessage()}
                </p>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <div className="d-flex gap-3 justify-content-center">
                  <Button
                    variant="primary"
                    onClick={sendVerificationEmail}
                    disabled={verificationLoading}
                    className="rounded-pill"
                  >
                    {verificationLoading ? (
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
                        <i className="bi bi-envelope me-2"></i>
                        Resend Verification Email
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline-primary"
                    onClick={checkEmailVerified}
                    disabled={verificationLoading}
                    className="rounded-pill"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    I've Verified My Email
                  </Button>
                </div>
              </Col>
            </Row>

            {timeRemaining > 0 && (
              <Row>
                <Col md="12">
                  <Alert variant="info" className="mt-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-clock me-2"></i>
                      <span>
                        Time remaining: {Math.floor(timeRemaining)} hours to
                        complete verification
                      </span>
                    </div>
                  </Alert>
                </Col>
              </Row>
            )}
          </Container>
        </Alert>
      );
    }

    if (isSpam()) {
      return (
        <Alert variant="danger" className="verification-alert">
          <Container>
            <Row className="align-items-center mb-3">
              <Col md="auto">
                <div className="d-flex align-items-center">
                  <i className="bi bi-shield-exclamation me-3 fs-4"></i>
                  <div>
                    <h4 className="mb-2">Account Suspended</h4>
                    <Badge bg="danger" className="ms-auto rounded-pill">
                      Spam
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <p className="mb-3">
                  Your account has been automatically marked as spam because you
                  didn't verify your email within the required time limit.
                </p>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <Card className="border-0" style={{ backgroundColor: 'var(--color-gray-50)' }}>
                  <Card.Body className="p-4">
                    <h5 className="mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      To resolve this issue:
                    </h5>
                    <ol className="mb-0 ps-3">
                      <li className="mb-2">Contact our support team</li>
                      <li className="mb-2">Request account reactivation</li>
                      <li className="mb-0">Complete email verification</li>
                    </ol>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <div className="text-center mt-3">
                  <Button variant="outline-danger" className="rounded-pill">
                    <i className="bi bi-envelope me-2"></i>
                    Contact Support
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </Alert>
      );
    }

    if (isSuspended()) {
      return (
        <Alert variant="dark" className="verification-alert">
          <Container>
            <Row className="align-items-center mb-3">
              <Col md="auto">
                <div className="d-flex align-items-center">
                  <i className="bi bi-lock me-3 fs-4"></i>
                  <div>
                    <h4 className="mb-2">Account Suspended</h4>
                    <Badge bg="dark" className="ms-auto rounded-pill">
                      Suspended
                    </Badge>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <p className="mb-3">
                  Your account has been suspended. Please contact support for
                  more information.
                </p>
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <div className="text-center mt-3">
                  <Button variant="outline-secondary" className="rounded-pill">
                    <i className="bi bi-envelope me-2"></i>
                    Contact Support
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </Alert>
      );
    }

    return (
      <Alert variant="info" className="verification-alert">
        <Container>
          <Row className="align-items-center">
            <Col md="auto">
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle me-3 fs-4"></i>
                <div>
                  <h4 className="mb-2">Account Verification Required</h4>
                  <span>Account verification required to {action}.</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Alert>
    );
  };

  // Inline warning mode (for forms, buttons, etc.)
  if (showInlineWarning) {
    return (
      <div className="verification-guard-inline p-3">
        <Alert variant="warning" className="mb-0">
          {renderWarning()}
        </Alert>
      </div>
    );
  }

  // Modal mode (for blocking entire pages)
  return (
    <Modal
      show={true}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
      className="verification-modal"
    >
      <Modal.Header className="verification-modal-header">
        <Modal.Title>
          <i className="bi bi-shield-check me-2"></i>
          Account Verification Required
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>{renderWarning()}</Container>
      </Modal.Body>
    </Modal>
  );
};

export default VerificationGuard;
