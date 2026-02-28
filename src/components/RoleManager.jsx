import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { db } from "../firebase.init";
import useAuthRole from "../hooks/useAuthRole";

const RoleManager = () => {
  const { isAdmin, canManageUsers, updateUserRole } = useAuthRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAdmin || !canManageUsers) return;
    fetchUsers();
  }, [isAdmin, canManageUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      toast.success("Users loaded successfully");
    } catch (error) {
      toast.error("Failed to fetch users from Doctor's Chamber database");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "patient");
    setShowRoleModal(true);
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole(selectedUser.id, newRole);

      // Update local state
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, role: newRole, updatedAt: new Date().toISOString() }
            : u,
        ),
      );

      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole("");

      toast.success(
        `Role updated to ${newRole} for ${selectedUser.displayName} in Doctor's Chamber`,
      );
    } catch (error) {
      toast.error(error.message || "Failed to update role in Doctor's Chamber");
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
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

  const getRoleDescription = (role) => {
    switch (role) {
      case "admin":
        return "Full system access including user management and settings";
      case "doctor":
        return "Can manage services, appointments, and view patient analytics";
      case "patient":
        return "Can book appointments and manage personal health records";
      default:
        return "Limited access - contact administrator";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isAdmin || !canManageUsers) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>
            <i className="bi bi-shield-exclamation me-2"></i>
            Access Denied - Doctor's Chamber
          </Alert.Heading>
          <p className="mb-0">
            You don't have permission to manage user roles in Doctor's Chamber.
            {userRole && (
              <span>
                {" "}
                Your current role: <strong>{userRole}</strong>
              </span>
            )}
          </p>
          <hr />
          <p className="mb-0">
            Please contact your healthcare administrator if you believe this is
            an error.
          </p>
          <div className="mt-3">
            <Button variant="outline-primary" href="/home">
              <i className="bi bi-house me-2"></i>
              Return to Dashboard
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">
                <i className="bi bi-people-gear me-2"></i>
                User Role Management
              </h3>
              <p className="text-muted mb-0 mt-2">
                Manage user roles for Doctor's Chamber healthcare platform. All
                new users default to patient role for security.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" onClick={fetchUsers}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => (window.location.href = "/dashboard")}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0">
                <i className="bi bi-search me-2"></i>
                Search Healthcare Users
              </h5>
              <Badge bg="info" className="rounded-pill">
                {filteredUsers.length} of {users.length} users
              </Badge>
            </div>
            <Form.Control
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-lg"
            />
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">
                Loading Doctor's Chamber users...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover className="users-table">
                <thead>
                  <tr>
                    <th>
                      <i className="bi bi-person me-2"></i>
                      Healthcare User
                    </th>
                    <th>
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </th>
                    <th>
                      <i className="bi bi-shield-check me-2"></i>
                      Current Role
                    </th>
                    <th>
                      <i className="bi bi-calendar-check me-2"></i>
                      Member Since
                    </th>
                    <th>
                      <i className="bi bi-gear me-2"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar-small me-3">
                            <img
                              src={
                                user.photoURL ||
                                `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=3b82f6&color=fff&size=32`
                              }
                              alt={user.displayName}
                              className="rounded-circle"
                            />
                          </div>
                          <div className="user-details">
                            <div className="fw-semibold">
                              {user.displayName || "N/A"}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              {user.phone && (
                                <small className="text-muted">
                                  <i className="bi bi-telephone me-1"></i>
                                  {user.phone}
                                </small>
                              )}
                              <small className="text-muted">
                                <i className="bi bi-envelope me-1"></i>
                                {user.email}
                              </small>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Badge
                            bg={getRoleBadgeVariant(user.role)}
                            className="rounded-pill"
                          >
                            {user.role || "patient"}
                          </Badge>
                          <small className="text-muted">
                            {getRoleDescription(user.role)}
                          </small>
                        </div>
                      </td>
                      <td>
                        {user.createdAt?.toDate?.()?.toLocaleDateString() ||
                          "N/A"}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleRoleChange(user)}
                          disabled={user.id === user?.id}
                          className="rounded-pill"
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Change Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="bi bi-search display-4 text-muted"></i>
              <p className="text-muted mt-3">
                {searchTerm
                  ? "No users found matching your search."
                  : "No users found."}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Role Change Modal */}
      <Modal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-person-gear me-2"></i>
            Change User Role
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <img
                  src={
                    selectedUser.photoURL ||
                    `https://ui-avatars.com/api/?name=${selectedUser.displayName || "User"}&background=3b82f6&color=fff&size=48`
                  }
                  alt={selectedUser.displayName}
                  className="rounded-circle"
                />
              </div>
              <div>
                <h5 className="mb-1">{selectedUser.displayName}</h5>
                <p className="text-muted mb-0">{selectedUser.email}</p>
              </div>
            </div>
          )}

          <Form onSubmit={handleRoleUpdate}>
            <Form.Group className="mb-4">
              <Form.Label>Assign New Role</Form.Label>
              <Form.Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Administrator</option>
              </Form.Select>
              <Form.Text className="text-muted">
                <strong>Role Permissions:</strong>
                <ul className="mt-2 mb-0">
                  <li>
                    <strong>Patient:</strong> Can book appointments and manage
                    profile
                  </li>
                  <li>
                    <strong>Doctor:</strong> Can manage services, bookings, and
                    view analytics
                  </li>
                  <li>
                    <strong>Administrator:</strong> Full system access including
                    user management
                  </li>
                </ul>
              </Form.Text>
            </Form.Group>

            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Note:</strong> Role changes will take effect immediately
              after the user refreshes their page or logs in again.
            </Alert>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <i className="bi bi-check-circle me-2"></i>
                Update Role
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RoleManager;
