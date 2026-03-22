import { collection, getDocs } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { db } from "../firebase.init";

const Analytics = () => {
  const [data, setData] = useState({
    bookings: [],
    payments: [],
    users: [],
    services: [],
    contactMessages: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [bookings, payments, users, services, contactMessages] =
          await Promise.all([
            getDocs(collection(db, "bookings")),
            getDocs(collection(db, "payments")),
            getDocs(collection(db, "users")),
            getDocs(collection(db, "services")),
            getDocs(collection(db, "contactMessages")),
          ]);

        setData({
          bookings: bookings.docs.map((item) => ({ id: item.id, ...item.data() })),
          payments: payments.docs.map((item) => ({ id: item.id, ...item.data() })),
          users: users.docs.map((item) => ({ id: item.id, ...item.data() })),
          services: services.docs.map((item) => ({ id: item.id, ...item.data() })),
          contactMessages: contactMessages.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          })),
        });
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const metrics = useMemo(() => {
    const revenue = data.payments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const statusCounts = data.bookings.reduce((acc, booking) => {
      const key = booking.status || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const serviceCounts = data.bookings.reduce((acc, booking) => {
      const key = booking.serviceName || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      revenue,
      statusCounts,
      serviceCounts,
    };
  }, [data]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading analytics...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div
        className="rounded-3 p-5 mb-4"
        style={{ backgroundColor: "var(--color-gray-50)" }}
      >
        <h1 className="display-5 fw-bold text-center">Analytics Dashboard</h1>
        <p className="lead text-muted text-center mb-0">
          Live operational metrics for bookings, payments, services, and inbound
          demand.
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3>{data.users.length}</h3>
              <p className="text-muted mb-0">Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3>{data.bookings.length}</h3>
              <p className="text-muted mb-0">Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3>${metrics.revenue}</h3>
              <p className="text-muted mb-0">Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h3>{data.contactMessages.length}</h3>
              <p className="text-muted mb-0">Contact Leads</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Booking Status Breakdown</h5>
            </Card.Header>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics.statusCounts).map(([status, count]) => (
                    <tr key={status}>
                      <td>{status}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Top Requested Services</h5>
            </Card.Header>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics.serviceCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([serviceName, count]) => (
                      <tr key={serviceName}>
                        <td>{serviceName}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
