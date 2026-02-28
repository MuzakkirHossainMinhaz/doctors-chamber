import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";

const PaymentFormContent = ({ service, bookingData, onPaymentSuccess }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: bookingData.patientName,
          email: bookingData.email,
        },
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      // Simulate payment processing for demo
      setTimeout(() => {
        setSucceeded(true);
        setProcessing(false);
        onPaymentSuccess({
          paymentMethodId: paymentMethod.id,
          amount: service.price,
          service: service,
          bookingData: bookingData,
        });
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  if (succeeded) {
    return (
      <Alert variant="success" className="text-center">
        <i className="bi bi-check-circle-fill me-2"></i>
        <h5>Payment Successful!</h5>
        <p>Your booking has been confirmed.</p>
      </Alert>
    );
  }

  return (
    <Card className="h-100">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Payment Information</h5>
      </Card.Header>
      <Card.Body>
        <div className="bg-light rounded-3 p-3 mb-4">
          <h6 className="mb-3">Booking Summary</h6>
          <div className="d-flex justify-content-between mb-2">
            <span>Service:</span>
            <strong>{service?.name}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Date:</span>
            <strong>{bookingData.date?.toLocaleDateString()}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Time:</span>
            <strong>{bookingData.time}</strong>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <span>Total Amount:</span>
            <strong className="text-success">${service?.price}</strong>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Card Details</Form.Label>
            <div className="border rounded-3 p-3 bg-white">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </Form.Group>

          {error && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="success"
            className="w-100 rounded-pill"
            disabled={!stripe || processing}
          >
            {processing ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              <>
                <i className="bi bi-lock me-2"></i>
                Pay ${service?.price}
              </>
            )}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <small className="text-muted">
            <i className="bi bi-shield-check me-1"></i>
            Your payment information is secure and encrypted
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

const PaymentForm = ({ service, bookingData, onPaymentSuccess }) => {
  return (
    <PaymentFormContent
      service={service}
      bookingData={bookingData}
      onPaymentSuccess={onPaymentSuccess}
    />
  );
};

export default PaymentForm;
