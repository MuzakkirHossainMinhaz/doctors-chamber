import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const PaymentFormContent = ({
  service,
  selectedDate,
  selectedTime,
  bookingData,
  onPaymentSuccess,
}) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const bookingSummaryDate = useMemo(
    () => (selectedDate ? new Date(selectedDate).toLocaleDateString() : "Not selected"),
    [selectedDate],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not finished loading.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: bookingData.patientName,
          email: bookingData.email,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      await onPaymentSuccess({
        paymentMethodId: paymentMethod.id,
        paymentMethodType: paymentMethod.type,
        amount: service.price,
      });
    } catch (submissionError) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const cardOptions = {
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

  return (
    <Card className="h-100">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Payment Information</h5>
      </Card.Header>
      <Card.Body>
        <div
          className="rounded-3 p-3 mb-4"
          style={{ backgroundColor: "var(--color-gray-50)" }}
        >
          <h6 className="mb-3">Booking Summary</h6>
          <div className="d-flex justify-content-between mb-2">
            <span>Service:</span>
            <strong>{service?.name}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Date:</span>
            <strong>{bookingSummaryDate}</strong>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Time:</span>
            <strong>{selectedTime || "Not selected"}</strong>
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
              <CardElement options={cardOptions} />
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
                Save Payment Method and Confirm Booking
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

const PaymentForm = (props) => {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <Alert variant="warning">
        Stripe is not configured. Add `VITE_STRIPE_PUBLISHABLE_KEY` to enable card entry.
      </Alert>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
};

export default PaymentForm;
