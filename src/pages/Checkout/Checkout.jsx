import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Spinner,
} from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../firebase.init";
import { normalizeService } from "../../utils/serviceData";
import BookingCalendar from "./BookingCalendar";
import PaymentForm from "./PaymentForm";

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef');

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    patientName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceDoc = await getDoc(doc(db, "services", id));
        if (!serviceDoc.exists()) {
          toast.error("Service not found");
          navigate("/home");
          return;
        }

        const firestoreService = normalizeService({
          id: serviceDoc.id,
          ...serviceDoc.data(),
        });

        setService(firestoreService);
        setUnavailableDates(
          firestoreService.unavailableDates
            .map((value) => {
              if (value instanceof Date) return value;
              if (typeof value?.toDate === "function") return value.toDate();
              return null;
            })
            .filter(Boolean),
        );
      } catch (error) {
        toast.error("Failed to load service details");
        console.error(error);
      }
    };

    fetchService();
  }, [id, navigate]);

  useEffect(() => {
    if (user) {
      setBookingData((prev) => ({
        ...prev,
        patientName: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateBookingData = () => {
    if (!bookingData.patientName.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!bookingData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!bookingData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return false;
    }
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return false;
    }
    return true;
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const paymentRecord = {
        userId: user.uid,
        serviceId: service.id,
        serviceName: service.name,
        amount: paymentData.amount,
        paymentMethodId: paymentData.paymentMethodId,
        paymentMethodType: paymentData.paymentMethodType,
        status: "completed",
        createdAt: new Date(),
      };

      const paymentRef = await addDoc(collection(db, "payments"), paymentRecord);

      const booking = {
        userId: user.uid,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        patientName: bookingData.patientName,
        email: bookingData.email,
        phone: bookingData.phone,
        date: selectedDate,
        time: selectedTime,
        notes: bookingData.notes,
        paymentMethodId: paymentData.paymentMethodId,
        paymentId: paymentRef.id,
        status: "confirmed",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "bookings"), booking);

      await addDoc(collection(db, "notifications"), {
        userId: user.uid,
        type: "booking",
        message: `Your ${service.name} appointment has been confirmed.`,
        createdAt: new Date(),
        read: false,
      });

      await addDoc(collection(db, "notifications"), {
        userId: user.uid,
        type: "payment",
        message: `Payment recorded for ${service.name}.`,
        createdAt: new Date(),
        read: false,
      });

      setBookingConfirmed(true);
      toast.success("Booking confirmed successfully!");

      // Reset form after 3 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (error) {
      toast.error("Failed to confirm booking");
      console.error(error);
    }
  };

  const proceedToPayment = () => {
    if (validateBookingData()) {
      setBookingStep(2);
    }
  };

  const availableTimeSlots = service?.timeSlots ?? [];

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading checkout...</p>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <Container className="my-5">
        <Alert variant="success" className="text-center">
          <i className="bi bi-check-circle-fill display-1 mb-3"></i>
          <h3>Booking Confirmed!</h3>
          <p>Your appointment has been successfully booked.</p>
          <p>You will be redirected to your profile shortly...</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="rounded-3 p-5 mb-5" style={{ backgroundColor: 'var(--color-gray-50)' }}>
        <h1 className="display-5 fw-bold text-center">Complete Your Booking</h1>
        <p className="lead text-muted text-center">
          Schedule your appointment in 3 simple steps
        </p>
      </div>

      <Row>
        <Col lg={8} className="mx-auto">
          {/* Progress Indicator */}
          <div className="bg-white rounded-3 p-4 mb-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div
                className={`text-center ${bookingStep >= 1 ? "" : "text-muted"}`}
                style={{ color: bookingStep >= 1 ? 'var(--color-primary)' : '' }}
              >
                <div
                  className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: "40px", height: "40px", backgroundColor: 'var(--color-primary)' }}
                >
                  <strong>1</strong>
                </div>
                <div className="fw-semibold">Schedule</div>
              </div>
              <div className="flex-grow-1 text-center">
                <div
                  className={`border-top ${bookingStep >= 2 ? "border-primary" : "border-muted"} pt-2`}
                ></div>
              </div>
              <div
                className={`text-center ${bookingStep >= 2 ? "" : "text-muted"}`}
                style={{ color: bookingStep >= 2 ? 'var(--color-primary)' : '' }}
              >
                <div
                  className="text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: "40px", height: "40px", backgroundColor: 'var(--color-primary)' }}
                >
                  <strong>2</strong>
                </div>
                <div className="fw-semibold">Payment</div>
              </div>
            </div>
          </div>

          {bookingStep === 1 && (
            <Row className="g-4">
              <Col md={6}>
                <BookingCalendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  unavailableDates={unavailableDates}
                />
              </Col>
              <Col md={6}>
                <Card className="h-100">
                  <Card.Header className="text-white" style={{ backgroundColor: 'var(--color-success)' }}>
                    <h5 className="mb-0">Patient Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="patientName"
                          value={bookingData.patientName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={bookingData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={bookingData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Additional Notes</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="notes"
                          value={bookingData.notes}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="Any special requirements or notes..."
                        />
                      </Form.Group>

                      {selectedDate && (
                        <div className="rounded-3 p-3 mb-4" style={{ backgroundColor: 'var(--color-gray-50)' }}>
                          <h6 className="mb-3">Select Time Slot</h6>
                          {availableTimeSlots.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                              {availableTimeSlots.map((time) => (
                                <Button
                                  key={time}
                                  variant={
                                    selectedTime === time
                                      ? "primary"
                                      : "outline-primary"
                                  }
                                  size="sm"
                                  onClick={() => handleTimeSelect(time)}
                                >
                                  {time}
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <Alert variant="warning" className="mb-0">
                              No time slots are configured for this service yet.
                            </Alert>
                          )}
                        </div>
                      )}

                      <Button
                        variant="success"
                        className="w-100 rounded-pill"
                        onClick={proceedToPayment}
                        disabled={
                          !selectedDate ||
                          !selectedTime ||
                          availableTimeSlots.length === 0
                        }
                      >
                        Proceed to Payment
                        <i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {bookingStep === 2 && service && (
            <PaymentForm
              service={service}
              bookingData={bookingData}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
