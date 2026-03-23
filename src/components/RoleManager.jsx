import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
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
import AppIcon from "./AppIcon";
import { db } from "../firebase.init";
import useAuthRole from "../hooks/useAuthRole";

const RoleManager = ({ users: initialUsers = [], bookings = [], onRefresh = null }) => {
  const { isAdmin, canManageUsers, updateUserRole, userRole } = useAuthRole();
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    if (initialUsers.length > 0 || !isAdmin() || !canManageUsers()) return;
    fetchUsers();
  }, [initialUsers, isAdmin, canManageUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, users],
  );

  const handleRoleUpdate = async (event) => {
    event.preventDefault();
    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole(selectedUser.id, newRole);
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === selectedUser.id
            ? { ...currentUser, role: newRole, updatedAt: new Date() }
            : currentUser,
        ),
      );
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole("");
      toast.success(`Role updated to ${newRole} for ${selectedUser.displayName || selectedUser.email}.`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update role.");
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

  if (!isAdmin() || !canManageUsers()) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>
            <AppIcon name="bi-shield-exclamation" className="me-2" />
            Access Denied
          </Alert.Heading>
          <p className="mb-0">
            You don't have permission to manage roles.
            {userRole && (
              <span>
                {" "}
                Current role: <strong>{userRole}</strong>
              </span>
            )}
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-0 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">
              <AppIcon name="bi-people-gear" className="me-2" />
              User Role Management
            </h3>
            <p className="text-muted mb-0 mt-2">
              Assign patient, doctor, or admin access.
            </p>
          </div>
          <Button variant="outline-primary" size="sm" onClick={fetchUsers}>
            <AppIcon name="bi-arrow-clockwise" className="me-2" />
            Refresh
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">
              <AppIcon name="bi-search" className="me-2" />
              Search Users
            </h5>
            <Badge bg="info" className="rounded-pill">
              {filteredUsers.length} of {users.length} users
            </Badge>
          </div>
          <Form.Control
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="form-control-lg"
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading users...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Total Bookings</th>
                  <th>Total Spent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const userBookings = bookings.filter(
                    (booking) => booking.userId === user.id,
                  );
                  const totalSpent = userBookings.reduce(
                    (sum, booking) => sum + (booking.servicePrice || 0),
                    0,
                  );

                  return (
                    <tr key={user.id}>
                      <td>{user.displayName || "N/A"}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.role)} className="rounded-pill">
                          {user.role || "patient"}
                        </Badge>
                      </td>
                      <td>{userBookings.length}</td>
                      <td>${totalSpent}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewRole(user.role || "patient");
                            setShowRoleModal(true);
                          }}
                        >
                          Change Role
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>

      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRoleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Control
                readOnly
                value={selectedUser?.displayName || selectedUser?.email || ""}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assign New Role</Form.Label>
              <Form.Select
                value={newRole}
                onChange={(event) => setNewRole(event.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Administrator</option>
              </Form.Select>
            </Form.Group>
            <Form.Text className="text-muted d-block mb-3">
              Patient: profile and appointment access.
            </Form.Text>
            <Form.Text className="text-muted d-block mb-3">
              Doctor: services, bookings, chat, and analytics access.
            </Form.Text>
            <Form.Text className="text-muted d-block mb-4">
              Administrator: full platform access.
            </Form.Text>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Role
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default RoleManager;
