import { updateProfile } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
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
  ProgressBar,
  Row,
  Spinner,
} from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import VerificationGuard from "../components/VerificationGuard";
import { auth, db } from "../firebase.init";
import useAuthRole from "../hooks/useAuthRole";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const { userRole } = useAuthRole();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsReminders: true,
    newsletter: false,
  });

  useEffect(() => {
    if (!user) return;
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      // Fetch user bookings
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);

      // Fetch user profile
      const profileRef = doc(db, "users", user.uid);
      const profileSnapshot = await getDoc(profileRef);

      if (!profileSnapshot.exists()) {
        // Create user profile if it doesn't exist
        const newProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          phone: "",
          address: "",
          emergencyContact: "",
          medicalHistory: "",
          dateOfBirth: "",
          gender: "",
          bloodType: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(profileRef, newProfile, { merge: true });
        setUserProfile(newProfile);
        setEditForm(newProfile);
      } else {
        const profileData = profileSnapshot.data();
        setUserProfile(profileData);
        setEditForm(profileData);
        if (profileData.preferences) {
          setPreferences(profileData.preferences);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: editForm.displayName,
      });

      // Update Firestore profile
      const updatedProfile = {
        ...editForm,
        preferences,
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });

      setUserProfile(updatedProfile);
      setShowEditModal(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setPreferences((prev) => ({
      ...prev,
      [preference]: value,
    }));
  };

  const getStatusBadge = (status) => {
    const variant =
      status === "confirmed"
        ? "success"
        : status === "cancelled"
          ? "danger"
          : "warning";
    return <Badge bg={variant}>{status}</Badge>;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toDate
      ? date.toDate().toLocaleDateString()
      : new Date(date).toLocaleDateString();
  };

  const calculateProfileCompletion = () => {
    const fields = [
      "displayName",
      "phone",
      "address",
      "emergencyContact",
      "dateOfBirth",
      "gender",
      "bloodType",
    ];
    const completedFields = fields.filter((field) => editForm[field]).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getUpcomingAppointments = () => {
    return bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.date) > new Date(),
    ).length;
  };

  const getTotalSpent = () => {
    return bookings.reduce(
      (sum, booking) => sum + (booking.servicePrice || 0),
      0,
    );
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading profile...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <VerificationGuard action="view and manage your profile">
      <Container className="my-5">
        {/* Profile Stats */}
        <div className="mb-4">
          <Row>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="mb-3" style={{ color: 'var(--color-primary)' }}>
                    <i className="bi bi-calendar-check fs-2"></i>
                  </div>
                  <h3 className="h4 mb-2">{bookings.length}</h3>
                  <p className="text-muted mb-0">Total Bookings</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="text-info mb-3">
                    <i className="bi bi-clock-history fs-2"></i>
                  </div>
                  <h3 className="h4 mb-2">{getUpcomingAppointments()}</h3>
                  <p className="text-muted mb-0">Upcoming</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="text-success mb-3">
                    <i className="bi bi-currency-dollar fs-2"></i>
                  </div>
                  <h3 className="h4 mb-2">${getTotalSpent()}</h3>
                  <p className="text-muted mb-0">Total Spent</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center">
                  <div className="text-warning mb-3">
                    <i className="bi bi-person-badge fs-2"></i>
                  </div>
                  <h3 className="h4 mb-2">{calculateProfileCompletion()}%</h3>
                  <p className="text-muted mb-0">Profile Complete</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Profile Content */}
        <Row className="mb-4">
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="mb-4">
                  <h6 className="mb-3">Profile Completion</h6>
                  <ProgressBar
                    now={calculateProfileCompletion()}
                    className="mb-2"
                  />
                  <small className="text-muted">
                    {calculateProfileCompletion()}% complete
                  </small>
                </div>

                <div className="mb-4">
                  <h6 className="mb-3">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() => setActiveTab("overview")}
                    >
                      <i className="bi bi-person me-2"></i>
                      Overview
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() => setActiveTab("appointments")}
                    >
                      <i className="bi bi-calendar me-2"></i>
                      Appointments
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() => setActiveTab("settings")}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="mb-3">Account Status</h6>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="success" className="rounded-pill">
                      <i className="bi bi-check-circle me-1"></i>
                      Active
                    </Badge>
                    <Badge bg="primary" className="rounded-pill">
                      <i className="bi bi-shield-check me-1"></i>
                      {userRole}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Profile Information</h5>
                  <VerificationGuard
                    action="edit your profile"
                    showInlineWarning={true}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowEditModal(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </Button>
                  </VerificationGuard>
                </div>
              </Card.Header>
              <Card.Body>
                {activeTab === "overview" && (
                  <div>
                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Full Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={userProfile?.displayName || "Not provided"}
                            readOnly
                            className="border-0"
                            style={{ backgroundColor: 'var(--color-gray-50)' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={user?.email || "Not provided"}
                            readOnly
                            className="border-0"
                            style={{ backgroundColor: 'var(--color-gray-50)' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            value={userProfile?.phone || "Not provided"}
                            readOnly
                            className="border-0"
                            style={{ backgroundColor: 'var(--color-gray-50)' }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Date of Birth
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={userProfile?.dateOfBirth || "Not provided"}
                            readOnly
                            className="border-0"
                            style={{ backgroundColor: 'var(--color-gray-50)' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={userProfile?.address || "Not provided"}
                            readOnly
                            className="border-0"
                            style={{ backgroundColor: 'var(--color-gray-50)' }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">
                            Medical History
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            value={
                              userProfile?.medicalHistory ||
                              "No medical history provided"
                            }
                            readOnly
                            className="border-0"
                            style={{ 
                              backgroundColor: 'var(--color-gray-50)',
                              minHeight: "100px" 
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {activeTab === "appointments" && (
                  <div>
                    <h6 className="mb-4">Recent Appointments</h6>
                    {bookings.length === 0 ? (
                      <Alert variant="info" className="text-center">
                        <i className="bi bi-calendar-x me-2"></i>
                        No appointments found. Book your first appointment!
                      </Alert>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Service</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.slice(0, 5).map((booking, index) => (
                              <tr key={index}>
                                <td>{booking.date}</td>
                                <td>{booking.service}</td>
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
                                <td>
                                  <Button variant="outline-primary" size="sm">
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div>
                    <h6 className="mb-4">Account Settings</h6>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Check
                            type="switch"
                            id="email-notifications"
                            label="Email Notifications"
                            defaultChecked={
                              userProfile?.emailNotifications || false
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <Form.Check
                            type="switch"
                            id="sms-notifications"
                            label="SMS Notifications"
                            defaultChecked={
                              userProfile?.smsNotifications || false
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <Form.Check
                            type="switch"
                            id="marketing-emails"
                            label="Marketing Emails"
                            defaultChecked={
                              userProfile?.marketingEmails || false
                            }
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Language
                          </label>
                          <Form.Select
                            defaultValue={userProfile?.language || "en"}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </Form.Select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Timezone
                          </label>
                          <Form.Select
                            defaultValue={userProfile?.timezone || "UTC"}
                          >
                            <option value="UTC">UTC</option>
                            <option value="EST">Eastern Time</option>
                            <option value="PST">Pacific Time</option>
                          </Form.Select>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Edit Profile Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleProfileUpdate}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={editForm.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  value={editForm.address}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Name and phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Medical History</Form.Label>
                <Form.Control
                  as="textarea"
                  name="medicalHistory"
                  value={editForm.medicalHistory}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any relevant medical conditions, allergies, or medications"
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </VerificationGuard>
  );
};

export default Profile;
