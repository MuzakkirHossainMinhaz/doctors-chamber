import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Card, Container, Spinner, Table } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase.init";
import useAuthRole from "../hooks/useAuthRole";

const Billing = () => {
  const [user, loading] = useAuthState(auth);
  const { isAdmin, isDoctor } = useAuthRole();
  const [payments, setPayments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadPayments = async () => {
      setLoadingData(true);
      try {
        const paymentsQuery =
          isAdmin() || isDoctor()
            ? query(collection(db, "payments"), orderBy("createdAt", "desc"))
            : query(
                collection(db, "payments"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
              );
        const snapshot = await getDocs(paymentsQuery);
        setPayments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      } catch (error) {
        console.error("Failed to load billing data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadPayments();
  }, [user, isAdmin, isDoctor]);

  const totals = useMemo(
    () => ({
      total: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
      completed: payments.filter((payment) => payment.status === "completed")
        .length,
    }),
    [payments],
  );

  if (loading || loadingData) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading billing data...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div
        className="rounded-3 p-5 mb-4"
        style={{ backgroundColor: "var(--color-gray-50)" }}
      >
        <h1 className="display-5 fw-bold text-center">Billing</h1>
        <p className="lead text-muted text-center mb-0">
          Review payment records, statuses, and receipts.
        </p>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Badge bg="success" className="px-3 py-2">
          Completed Payments: {totals.completed}
        </Badge>
        <Badge bg="primary" className="px-3 py-2">
          Total Value: ${totals.total}
        </Badge>
      </div>

      {payments.length === 0 ? (
        <Alert variant="info" className="text-center">
          No payment records found.
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.serviceName || "N/A"}</td>
                      <td>${payment.amount || 0}</td>
                      <td>
                        <Badge
                          bg={
                            payment.status === "completed"
                              ? "success"
                              : "warning"
                          }
                        >
                          {payment.status || "pending"}
                        </Badge>
                      </td>
                      <td>{payment.paymentMethodType || "card"}</td>
                      <td>
                        {payment.createdAt?.toDate?.()?.toLocaleDateString?.() ||
                          "N/A"}
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

export default Billing;
