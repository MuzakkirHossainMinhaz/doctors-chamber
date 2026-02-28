import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import toast from "react-hot-toast";
import RoleManager from "../../components/RoleManager/RoleManager";
import { db } from "../firebase.init";
import useAuthRole from "../hooks/useAuthRole";

const Admin = () => {
  const {
    user,
    userRole,
    loading,
    isAdmin,
    canAccessAdminDashboard,
    canManageServices,
    canManageBookings,
    canManageUsers,
  } = useAuthRole();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "general",
  });

  useEffect(() => {
    if (!user || !canAccessAdminDashboard()) return;

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    fetchDashboardData();
  }, [user, isAdmin, canAccessAdminDashboard]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      // Fetch users
      const usersQuery = query(collection(db, "users"), limit(50));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);

      // Fetch bookings
      const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc"),
        limit(100),
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);

      // Fetch services
      const servicesSnapshot = await getDocs(collection(db, "services"));
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(servicesData);

      // Calculate stats
      const statsData = {
        totalUsers: usersData.length,
        totalBookings: bookingsData.length,
        totalRevenue: bookingsData.reduce(
          (sum, booking) => sum + (booking.servicePrice || 0),
          0,
        ),
        pendingBookings: bookingsData.filter((b) => b.status === "pending")
          .length,
        confirmedBookings: bookingsData.filter((b) => b.status === "confirmed")
          .length,
        totalServices: servicesData.length,
      };
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to fetch admin data");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    if (!canManageServices()) {
      toast.error("You do not have permission to manage services.");
      return;
    }

    try {
      const serviceData = {
        ...serviceForm,
        price: parseFloat(serviceForm.price),
        doctorId: user.uid, // Associate service with the doctor
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingService) {
        await updateDoc(doc(db, "services", editingService.id), serviceData);
        toast.success("Service updated successfully");
      } else {
        await addDoc(collection(db, "services"), serviceData);
        toast.success("Service added successfully");
      }

      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({
        name: "",
        price: "",
        description: "",
        category: "general",
      });
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to save service");
      console.error(error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!canManageServices()) {
      toast.error("You do not have permission to delete services.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, "services", serviceId));
        toast.success("Service deleted successfully");
        fetchDashboardData();
      } catch (error) {
        toast.error("Failed to delete service");
        console.error(error);
      }
    }
  };

  const handleEditService = (service) => {
    if (!canManageServices()) {
      toast.error("You do not have permission to edit services.");
      return;
    }

    setEditingService(service);
    setServiceForm({
      name: service.name,
      price: service.price,
      description: service.description,
      category: service.category || "general",
    });
    setShowServiceModal(true);
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    if (!canManageBookings()) {
      toast.error("You do not have permission to manage bookings.");
      return;
    }

    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      toast.success(`Booking ${newStatus} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!canAccessAdminDashboard()) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-shield-exclamation me-2"></i>
          <h4>Access Denied</h4>
          <p>You don't have permission to access the admin dashboard.</p>
          <p className="mb-0">
            <small>
              Current role: <strong>{userRole || "Unknown"}</strong>
            </small>
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="bg-primary text-white rounded-3 p-5 mb-4">
        <h1 className="display-5 fw-bold text-center">Admin Dashboard</h1>
        <p className="lead text-center">
          Manage your healthcare service platform
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Badge bg="light" text="dark" className="me-2">
            Role: {userRole}
          </Badge>
          <Badge bg="success">Logged in as: {user?.email}</Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        <Button
          variant={activeTab === "dashboard" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("dashboard")}
          className="rounded-pill"
        >
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </Button>

        {canManageServices() && (
          <Button
            variant={activeTab === "services" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("services")}
            className="rounded-pill"
          >
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Services
          </Button>
        )}

        {canManageBookings() && (
          <Button
            variant={activeTab === "bookings" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("bookings")}
            className="rounded-pill"
          >
            <i className="bi bi-calendar-check me-2"></i>
            Bookings
          </Button>
        )}

        {canManageUsers() && (
          <Button
            variant={activeTab === "users" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("users")}
            className="rounded-pill"
          >
            <i className="bi bi-people me-2"></i>
            Users
          </Button>
        )}
      </div>

      {loadingData ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading data...</p>
        </div>
      ) : (
        <>
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <Row>
              <Col md={3} className="mb-4">
                <Card className="h-100 shadow-sm border-0 bg-white">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-people display-4 text-primary"></i>
                    <h3 className="mt-3">{stats.totalUsers}</h3>
                    <p className="text-muted">Total Users</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="h-100 shadow-sm border-0 bg-white">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-calendar-check display-4 text-success"></i>
                    <h3 className="mt-3">{stats.totalBookings}</h3>
                    <p className="text-muted">Total Bookings</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="h-100 shadow-sm border-0 bg-white">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-currency-dollar display-4 text-warning"></i>
                    <h3 className="mt-3">${stats.totalRevenue}</h3>
                    <p className="text-muted">Total Revenue</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="h-100 shadow-sm border-0 bg-white">
                  <Card.Body className="text-center p-4">
                    <i className="bi bi-grid-3x3-gap display-4 text-info"></i>
                    <h3 className="mt-3">{stats.totalServices}</h3>
                    <p className="text-muted">Services</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Bookings</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Service</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.patientName}</td>
                            <td>{booking.serviceName}</td>
                            <td>
                              {booking.date?.toDate?.()?.toLocaleDateString() ||
                                "N/A"}
                            </td>
                            <td>{booking.time}</td>
                            <td>
                              <Badge
                                bg={
                                  booking.status === "confirmed"
                                    ? "success"
                                    : "warning"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </td>
                            <td>${booking.servicePrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Services Tab */}
          {activeTab === "services" && canManageServices() && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Service Management</h5>
                <Button
                  variant="primary"
                  onClick={() => setShowServiceModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Service
                </Button>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.name}</td>
                        <td>${service.price}</td>
                        <td>{service.category}</td>
                        <td>{service.description}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditService(service)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && canManageBookings() && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Booking Management</h5>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.patientName}</td>
                        <td>{booking.email}</td>
                        <td>{booking.phone}</td>
                        <td>{booking.serviceName}</td>
                        <td>
                          {booking.date?.toDate?.()?.toLocaleDateString() ||
                            "N/A"}
                        </td>
                        <td>{booking.time}</td>
                        <td>
                          <Badge
                            bg={
                              booking.status === "confirmed"
                                ? "success"
                                : "warning"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td>${booking.servicePrice}</td>
                        <td>
                          {booking.status === "pending" && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                handleBookingStatusUpdate(
                                  booking.id,
                                  "confirmed",
                                )
                              }
                            >
                              Confirm
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Roles Tab */}
          {activeTab === "roles" && canManageUsers() && <RoleManager />}

          {/* Users Tab */}
          {activeTab === "users" && canManageUsers() && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">User Management</h5>
              </Card.Header>
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Total Bookings</th>
                      <th>Total Spent</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const userBookings = bookings.filter(
                        (b) => b.userId === user.id,
                      );
                      const totalSpent = userBookings.reduce(
                        (sum, b) => sum + (b.servicePrice || 0),
                        0,
                      );
                      return (
                        <tr key={user.id}>
                          <td>{user.displayName || "N/A"}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge
                              bg={
                                user.role === "admin"
                                  ? "danger"
                                  : user.role === "doctor"
                                    ? "primary"
                                    : "secondary"
                              }
                            >
                              {user.role || "patient"}
                            </Badge>
                          </td>
                          <td>{user.phone || "N/A"}</td>
                          <td>{userBookings.length}</td>
                          <td>${totalSpent}</td>
                          <td>
                            {user.createdAt?.toDate?.()?.toLocaleDateString() ||
                              "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* Service Modal */}
      {canManageServices() && (
        <Modal
          show={showServiceModal}
          onHide={() => setShowServiceModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingService ? "Edit Service" : "Add New Service"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleServiceSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={serviceForm.price}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, price: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={serviceForm.category}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, category: e.target.value })
                  }
                >
                  <option value="general">General</option>
                  <option value="emergency">Emergency</option>
                  <option value="surgery">Surgery</option>
                  <option value="counselling">Counselling</option>
                  <option value="diagnosis">Diagnosis</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowServiceModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingService ? "Update" : "Add"} Service
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default Admin;
