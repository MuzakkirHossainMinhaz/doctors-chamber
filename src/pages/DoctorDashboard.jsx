import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { db } from "../firebase.init";

const DoctorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [bookingsSnapshot, contactsSnapshot, messagesSnapshot] =
          await Promise.all([
            getDocs(
              query(
                collection(db, "bookings"),
                orderBy("createdAt", "desc"),
                limit(20),
              ),
            ),
            getDocs(
              query(
                collection(db, "contactMessages"),
                orderBy("createdAt", "desc"),
                limit(10),
              ),
            ),
            getDocs(
              query(
                collection(db, "chatMessages"),
                orderBy("createdAt", "desc"),
                limit(30),
              ),
            ),
          ]);

        setBookings(
          bookingsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        );
        setContacts(
          contactsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        );
        setMessages(
          messagesSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        );
      } catch (error) {
        console.error("Failed to load doctor dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toLocaleDateString();
    return {
      pendingBookings: bookings.filter((booking) => booking.status === "pending")
        .length,
      confirmedBookings: bookings.filter(
        (booking) => booking.status === "confirmed",
      ).length,
      todayAppointments: bookings.filter((booking) => {
        const dateValue = booking.date?.toDate?.() || new Date(booking.date);
        return (
          !Number.isNaN(dateValue.getTime()) &&
          dateValue.toLocaleDateString() === today
        );
      }).length,
      unreadContacts: contacts.filter((contact) => contact.status === "new")
        .length,
    };
  }, [bookings, contacts]);

  const recentConversations = useMemo(() => {
    const conversationMap = new Map();

    messages.forEach((message) => {
      const conversationId = message.conversationId || message.senderId;
      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, message);
      }
    });

    return Array.from(conversationMap.values()).slice(0, 5);
  }, [messages]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading doctor dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div
        className="rounded-3 p-5 mb-4 text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <h1 className="display-5 fw-bold text-center">Doctor Dashboard</h1>
        <p className="lead text-center mb-0">
          Manage appointments, patient requests, and support conversations in
          one place.
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.pendingBookings}</h3>
              <p className="text-muted mb-0">Pending Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.confirmedBookings}</h3>
              <p className="text-muted mb-0">Confirmed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.todayAppointments}</h3>
              <p className="text-muted mb-0">Today</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.unreadContacts}</h3>
              <p className="text-muted mb-0">New Contacts</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={7}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Latest Appointments</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 8).map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.patientName}</td>
                        <td>{booking.serviceName}</td>
                        <td>
                          {booking.date?.toDate?.()?.toLocaleDateString?.() ||
                            "N/A"}
                        </td>
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
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Recent Contact Requests</h5>
            </Card.Header>
            <Card.Body>
              {contacts.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  No contact requests yet.
                </Alert>
              ) : (
                contacts.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{contact.name}</strong>
                      <Badge
                        bg={
                          contact.status === "new" ? "warning" : "secondary"
                        }
                      >
                        {contact.status || "new"}
                      </Badge>
                    </div>
                    <div className="text-muted small">
                      {contact.subject || "General inquiry"}
                    </div>
                    <div className="small">{contact.email}</div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Support Inbox</h5>
            </Card.Header>
            <Card.Body>
              {recentConversations.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  No support conversations yet.
                </Alert>
              ) : (
                recentConversations.map((message) => (
                  <div key={message.id} className="border-bottom pb-3 mb-3">
                    <strong>{message.senderName}</strong>
                    <div className="small text-muted">{message.senderEmail}</div>
                    <div className="small mt-1">{message.text}</div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
