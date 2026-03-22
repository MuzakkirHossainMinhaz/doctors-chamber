import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import auth from "../firebase.init";
import SocialLink from "./Signin/SocialLink";

const Signin = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignIn = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    await signInWithEmailAndPassword(email, password);
  };

  if (user) {
    navigate(from, { replace: true });
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src="/logo.png"
                    alt="Doctor's Chamber Logo"
                    height="60"
                    width="60"
                    className="rounded-3 shadow-sm"
                  />
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--color-secondary)' }}>
                  Welcome Back
                </h2>
                <p className="text-muted">
                  Sign in to your Doctor's Chamber account
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error.message}
                </Alert>
              )}

              <Form onSubmit={handleSignIn}>
                <Form.Group className="mb-4">
                  <Form.Label className="fs-5 fw-semibold">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    className="form-control-lg"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fs-5 fw-semibold">Password</Form.Label>
                  <Form.Control
                    className="form-control-lg"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check
                    type="checkbox"
                    id="remember-me"
                    label="Remember me"
                    className="text-muted"
                  />
                  <Link
                    to="/help"
                    className="text-decoration-none"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Need help?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 rounded-pill"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center my-4">
                <small className="text-muted">Or continue with</small>
              </div>

              <SocialLink />

              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signin;
