import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AppIcon from "../components/AppIcon";
import { auth, db } from "../firebase.init";

const MyBookings = () => {
  const [user, loading] = useAuthState(auth);
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoadingData(true);
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(bookingsQuery);
      setBookings(
        snapshot.docs.map((bookingDoc) => ({
          id: bookingDoc.id,
          ...bookingDoc.data(),
        })),
      );
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoadingData(false);
    }
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter((booking) => {
      const dateValue = booking.date?.toDate?.() || new Date(booking.date);
      return booking.status === "confirmed" && dateValue >= new Date();
    }).length;
    const pending = bookings.filter(
      (booking) => booking.status === "pending",
    ).length;
    const spent = bookings.reduce(
      (sum, booking) => sum + (booking.servicePrice || 0),
      0,
    );

    return { total, upcoming, pending, spent };
  }, [bookings]);

  const handleCancelBooking = async (bookingId) => {
    setUpdatingId(bookingId);
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "cancelled",
        updatedAt: new Date(),
      });

      await addDoc(collection(db, "notifications"), {
        userId: user.uid,
        type: "appointment",
        message: "Your appointment status was updated to cancelled.",
        createdAt: new Date(),
        read: false,
      });

      toast.success("Booking cancelled.");
      fetchBookings();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking.");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    const normalized = dateValue?.toDate?.() || new Date(dateValue);
    return Number.isNaN(normalized.getTime())
      ? "N/A"
      : normalized.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const variantMap = {
      confirmed: "success",
      pending: "warning",
      cancelled: "danger",
      completed: "primary",
    };

    return (
      <Badge bg={variantMap[status] || "secondary"}>
        {status || "unknown"}
      </Badge>
    );
  };

  if (loading || loadingData) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div
        className="rounded-3 p-5 mb-4"
        style={{ backgroundColor: "var(--color-gray-50)" }}
      >
        <h1 className="display-5 fw-bold text-center">My Bookings</h1>
        <p className="lead text-muted text-center mb-0">
          Track upcoming appointments, payment history, and booking status.
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.total}</h3>
              <p className="text-muted mb-0">Total Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.upcoming}</h3>
              <p className="text-muted mb-0">Upcoming</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>{stats.pending}</h3>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center">
              <h3>${stats.spent}</h3>
              <p className="text-muted mb-0">Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {bookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          <AppIcon name="bi-calendar-x" className="me-2" />
          You have no bookings yet.
          <div className="mt-3">
            <Button as={Link} to="/services" variant="primary">
              Browse Services
            </Button>
          </div>
        </Alert>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white">
            <h5 className="mb-0">Appointment History</h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
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
                      <td>{booking.serviceName || booking.service || "N/A"}</td>
                      <td>{formatDate(booking.date)}</td>
                      <td>{booking.time || "N/A"}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td>${booking.servicePrice || 0}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            as={Link}
                            to={`/checkout/${booking.serviceId}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            Rebook
                          </Button>
                          {["pending", "confirmed"].includes(booking.status) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              disabled={updatingId === booking.id}
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyBookings;
