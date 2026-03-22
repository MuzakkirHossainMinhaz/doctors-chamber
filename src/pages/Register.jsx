import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import auth, { db } from "../firebase.init";
import SocialLink from "./Signin/SocialLink";

const Register = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    const name = event.target.fullName.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await createUserWithEmailAndPassword(email, password);
    if (result?.user) {
      await updateProfile(result.user, { displayName: name });
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email,
          displayName: name,
          role: "patient",
          accountStatus: "pending_verification",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true },
      );
      toast.success("Account created. Please verify your email.");
    }
  };

  if (user) {
    navigate("/home");
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
                  Create Account
                </h2>
                <p className="text-muted">
                  Join Doctor's Chamber for better healthcare
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error.message}
                </Alert>
              )}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-4">
                  <Form.Label className="fs-5 fw-semibold">
                    Full Name
                  </Form.Label>
                  <Form.Control
                    className="form-control-lg"
                    name="fullName"
                    required
                    type="text"
                    placeholder="Enter your full name"
                  />
                </Form.Group>

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
                    placeholder="Create a strong password"
                    required
                  />
                </Form.Group>

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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
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
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-decoration-none fw-semibold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Sign In
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

export default Register;
