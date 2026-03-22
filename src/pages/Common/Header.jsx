import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useSignOut } from "react-firebase-hooks/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotifications } from "../../components/NotificationSystem";
import VerificationStatus from "../../components/VerificationStatus";
import useAuthRole from "../../hooks/useAuthRole";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [signOut] = useSignOut();
  const {
    user,
    userRole,
    loading,
    isAdmin,
    isDoctor,
    isPatient,
    canAccessAdminDashboard,
  } = useAuthRole();
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getRoleBadgeVariant = () => {
    switch (userRole) {
      case "admin":
        return "danger";
      case "doctor":
        return "primary";
      case "patient":
        return "success";
      default:
        return "secondary";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return "bi-shield-check";
      case "doctor":
        return "bi-hospital";
      case "patient":
        return "bi-person-heart";
      default:
        return "bi-person";
    }
  };

  if (loading) {
    return (
      <Navbar className="bg-white shadow-sm">
        <Container>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" style={{ color: 'var(--color-primary)' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <>
      <Navbar
        expand="lg"
        className={`bg-white shadow-sm ${scrolled ? "sticky-top" : ""}`}
        expanded={mobileMenuOpen}
        onToggle={(expanded) => setMobileMenuOpen(expanded)}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center gap-3 transition-smooth"
          >
            <img
              src="/logo.png"
              alt="Doctor's Chamber Logo"
              height="40"
              width="40"
              className="rounded-3 shadow-sm"
            />
            <span className="fw-bold" style={{ color: 'var(--color-secondary)' }}>
              Doctor's Chamber
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <span className="navbar-toggler-icon border-0 bg-white p-2"></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={`${isActivePath("/") ? "active" : ""} transition-smooth`}
              >
                <i className="bi bi-house me-2"></i>
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/services"
                className={`${isActivePath("/services") ? "active" : ""} transition-smooth`}
              >
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Services
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/blogs"
                className={`${isActivePath("/blogs") ? "active" : ""} transition-smooth`}
              >
                <i className="bi bi-journal-text me-2"></i>
                Blogs
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/contact"
                className={`${isActivePath("/contact") ? "active" : ""} transition-smooth`}
              >
                <i className="bi bi-telephone me-2"></i>
                Contact
              </Nav.Link>

              {/* Admin/Doctor Links */}
              {canAccessAdminDashboard() && (
                <Nav.Link
                  as={Link}
                  to="/admin"
                  className={`${isActivePath("/admin") ? "active" : ""} transition-smooth`}
                >
                  <i className="bi bi-gear me-2"></i>
                  Admin
                </Nav.Link>
              )}

              {isDoctor() && !isAdmin() && (
                <Nav.Link
                  as={Link}
                  to="/doctor-dashboard"
                  className={`${isActivePath("/doctor-dashboard") ? "active" : ""} transition-smooth`}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Nav.Link>
              )}

              {/* User Menu */}
              {user ? (
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle overflow-hidden"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=3b82f6&color=fff&size=32`
                          }
                          alt="User Avatar"
                          className="img-fluid"
                        />
                      </div>
                      <div className="ms-2">
                        <span className="fw-semibold">
                          {user.displayName || "User"}
                        </span>
                        <Badge bg={getRoleBadgeVariant()} className="ms-2">
                          <i className={`bi ${getRoleIcon()} me-1`}></i>
                          {userRole}
                        </Badge>
                      </div>
                    </div>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item className="dropdown-header p-3 border-bottom" style={{ backgroundColor: 'var(--color-gray-50)' }}>
                    <div className="d-flex align-items-center gap-3 p-2">
                      <div
                        className="rounded-circle overflow-hidden"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <img
                          src={
                            user.photoURL ||
                            `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=3b82f6&color=fff&size=40`
                          }
                          alt="User Avatar"
                          className="img-fluid"
                        />
                      </div>
                      <div>
                        <div className="fw-semibold">
                          {user.displayName || "User"}
                        </div>
                        <div className="text-muted small">{user.email}</div>
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <Badge
                            bg={getRoleBadgeVariant()}
                            className="rounded-pill"
                          >
                            <i className={`bi ${getRoleIcon()} me-1`}></i>
                            {userRole}
                          </Badge>
                          <VerificationStatus compact={true} />
                        </div>
                      </div>
                    </div>
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    className="dropdown-item text-decoration-none"
                  >
                    <i className="bi bi-person me-2"></i>
                    My Profile
                  </NavDropdown.Item>

                  {isPatient() && (
                    <NavDropdown.Item
                      as={Link}
                      to="/my-bookings"
                      className="dropdown-item text-decoration-none"
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      My Bookings
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Item
                    as={Link}
                    to="/chat"
                    className="dropdown-item text-decoration-none"
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Messages
                    {unreadCount > 0 && (
                      <Badge bg="danger" className="ms-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </NavDropdown.Item>

                  {(isAdmin() || isDoctor()) && (
                    <NavDropdown.Item
                      as={Link}
                      to="/analytics"
                      className="dropdown-item text-decoration-none"
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Analytics
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    as={Link}
                    to="/settings"
                    className="dropdown-item text-decoration-none"
                  >
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/help"
                    className="dropdown-item text-decoration-none"
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    Help & Support
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    onClick={handleSignOut}
                    className="dropdown-item text-danger"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/signin"
                    variant="outline-primary"
                    className="rounded-pill"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    className="rounded-pill"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
