import { useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingCalendar = ({
  onDateSelect,
  selectedDate,
  unavailableDates = [],
}) => {
  const [highlightedDates, setHighlightedDates] = useState([]);

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates and weekends
    if (date < today || date.getDay() === 0 || date.getDay() === 6) {
      return true;
    }

    // Disable unavailable dates
    return unavailableDates.some(
      (unavailableDate) =>
        date.toDateString() === unavailableDate.toDateString(),
    );
  };

  const handleDateChange = (date) => {
    if (date && !isDateDisabled(date)) {
      onDateSelect(date);
    }
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  return (
    <Card className="h-100">
      <Card.Header className="bg-success text-white">
        <h5 className="mb-0">Select Appointment Date</h5>
      </Card.Header>
      <Card.Body>
        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle me-2"></i>
          Available on weekdays only. Weekends are closed.
        </Alert>

        <div className="calendar-container">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            minDate={new Date()}
            filterDate={(date) => !isDateDisabled(date)}
            calendarClassName="border-0 shadow-sm"
            dayClassName={(date) => {
              if (isDateDisabled(date)) return "bg-light text-muted";
              if (
                selectedDate &&
                date.toDateString() === selectedDate.toDateString()
              ) {
                return "bg-primary text-white";
              }
              return "bg-white";
            }}
          />
        </div>

        {selectedDate && (
          <div className="rounded-3 p-3 mt-4" style={{ backgroundColor: 'var(--color-gray-50)' }}>
            <h6 className="mb-3">Available Time Slots</h6>
            <div className="d-flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant="outline-success"
                  size="sm"
                  className="rounded-pill"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookingCalendar;
