// Service categories
export const CATEGORIES = [
  "health",
  "nutrition",
  "mental-health",
  "medical-tech",
  "lifestyle",
  "emergency",
];

// Available services
export const SERVICES = [
  {
    id: "medical-checkup",
    name: "Medical and Health Check-ups",
    price: 12,
    category: "health",
    description: "Comprehensive health examination and screening",
    duration: 30,
    icon: "bi-stethoscope",
  },
  {
    id: "nutrition-advice",
    name: "Health and Nutrition Advice",
    price: 9,
    category: "nutrition",
    description: "Personalized nutrition guidance and counseling",
    duration: 45,
    icon: "bi-apple",
  },
  {
    id: "surgery",
    name: "Surgery",
    price: 40,
    category: "health",
    description: "Surgical procedures and consultations",
    duration: 60,
    icon: "bi-heart-pulse",
  },
  {
    id: "emergency-services",
    name: "Emergency Services",
    price: 10,
    category: "emergency",
    description: "Emergency medical care and treatment",
    duration: 20,
    icon: "bi-ambulance",
  },
  {
    id: "counselling",
    name: "Counselling",
    price: 17,
    category: "mental-health",
    description: "Mental health and counseling services",
    duration: 50,
    icon: "bi-heart",
  },
  {
    id: "diagnosis-treatment",
    name: "Diagnosis and Treatment",
    price: 25,
    category: "health",
    description: "Medical diagnosis and treatment plans",
    duration: 40,
    icon: "bi-clipboard2-pulse",
  },
];

// Booking statuses
export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no-show",
];

// Notification types
export const NOTIFICATION_TYPES = [
  "booking",
  "payment",
  "appointment",
  "system",
  "chat",
  "profile",
];

// Payment statuses
export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "cancelled",
];

// User roles
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  STAFF: "STAFF",
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: "https://doctors-chamber.web.app",
  BOOKINGS: "/api/bookings",
  SERVICES: "/api/services",
  USERS: "/api/users",
  PAYMENTS: "/api/payments",
  NOTIFICATIONS: "/api/notifications",
  CHAT: "/api/chat",
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network error occurred. Please check your internet connection.",
  AUTHENTICATION_ERROR: "Authentication failed. Please sign in again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  BOOKING_ERROR: "Failed to create booking. Please try again.",
  PAYMENT_ERROR:
    "Payment failed. Please try again or use a different payment method.",
  SERVICE_ERROR: "Service unavailable. Please try again later.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  FILE_TOO_LARGE: "File size exceeds the maximum allowed limit.",
  INVALID_FILE_TYPE: "File type is not supported.",
  DUPLICATE_BOOKING: "You already have a booking for this time slot.",
  SLOT_UNAVAILABLE: "This time slot is no longer available.",
  EXPIRED_SESSION: "Your session has expired. Please sign in again.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_CONFIRMED:
    "Booking confirmed successfully! Check your email for details.",
  PAYMENT_SUCCESSFUL: "Payment processed successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  SERVICE_CREATED: "Service created successfully!",
  SERVICE_UPDATED: "Service updated successfully!",
  SERVICE_DELETED: "Service deleted successfully!",
  USER_REGISTERED:
    "Registration successful! Please check your email to verify your account.",
  PASSWORD_RESET: "Password reset email sent successfully!",
  EMAIL_VERIFIED: "Email verified successfully!",
  MESSAGE_SENT: "Message sent successfully!",
  FEEDBACK_SUBMITTED: "Thank you for your feedback!",
  FILE_UPLOADED: "File uploaded successfully!",
  SETTINGS_SAVED: "Settings saved successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
};

// Time slots for appointments
export const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

// Available dates (next 30 days from today)
export const getAvailableDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date);
    }
  }

  return dates;
};

// Payment methods
export const PAYMENT_METHODS = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: "bi-credit-card",
    description: "Pay with Visa, Mastercard, or American Express",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "bi-paypal",
    description: "Pay with your PayPal account",
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: "bi-apple",
    description: "Pay with Apple Pay",
  },
  {
    id: "google-pay",
    name: "Google Pay",
    icon: "bi-google",
    description: "Pay with Google Pay",
  },
];

// File upload settings
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXTENSIONS: [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".txt",
    ".doc",
    ".docx",
  ],
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZES: [5, 10, 20, 50],
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: "#198754",
  SECONDARY: "#20c997",
  SUCCESS: "#28a745",
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8",
  LIGHT: "#f8f9fa",
  DARK: "#343a40",
};

// Social media links
export const SOCIAL_MEDIA = {
  FACEBOOK: "https://www.facebook.com/doctorschamber",
  TWITTER: "https://www.twitter.com/doctorschamber",
  INSTAGRAM: "https://www.instagram.com/doctorschamber",
  LINKEDIN: "https://www.linkedin.com/company/doctorschamber",
  YOUTUBE: "https://www.youtube.com/doctorschamber",
};

// Contact information
export const CONTACT_INFO = {
  PHONE: "+1-234-567-8900",
  EMAIL: "info@doctorschamber.com",
  ADDRESS: "123 Healthcare Avenue, Medical City, HC 12345, USA",
  HOURS: {
    MONDAY_FRI: "9:00 AM - 5:00 PM",
    SATURDAY: "9:00 AM - 1:00 PM",
    SUNDAY: "Closed",
  },
};

// Emergency contact
export const EMERGENCY_CONTACT = {
  PHONE: "911",
  EMAIL: "emergency@doctorschamber.com",
  HOSPITAL: "Medical City Emergency Room",
};

// Insurance providers
export const INSURANCE_PROVIDERS = [
  "Blue Cross Blue Shield",
  "Aetna",
  "UnitedHealthcare",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "Medicare",
  "Medicaid",
];

// Medical specialties
export const MEDICAL_SPECIALTIES = [
  "General Practice",
  "Internal Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Urology",
];

// Lab test types
export const LAB_TEST_TYPES = [
  "Blood Test",
  "Urine Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "ECG/EKG",
  "Biopsy",
  "Allergy Test",
  "Genetic Test",
];

// Medication types
export const MEDICATION_TYPES = [
  "Prescription",
  "Over-the-Counter",
  "Supplements",
  "Vaccines",
  "Topical",
  "Injectable",
  "Inhaler",
  "Eye Drops",
  "Ear Drops",
  "Nasal Spray",
];

// Appointment types
export const APPOINTMENT_TYPES = [
  "In-Person",
  "Video Call",
  "Phone Call",
  "Home Visit",
  "Emergency",
  "Follow-up",
  "Consultation",
  "Procedure",
  "Test",
  "Vaccination",
];

// Severity levels
export const SEVERITY_LEVELS = [
  "Low",
  "Medium",
  "High",
  "Critical",
  "Emergency",
];

// Priority levels
export const PRIORITY_LEVELS = ["Low", "Normal", "High", "Urgent", "Emergency"];

// Status colors
export const STATUS_COLORS = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
  "no-show": "secondary",
};

// Currency settings
export const CURRENCY = {
  CODE: "USD",
  SYMBOL: "$",
  LOCALE: "en-US",
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMMM d, yyyy",
  SHORT: "MM/dd/yyyy",
  LONG: "EEEE, MMMM d, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMMM d, yyyy h:mm a",
};

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\.\(\)]+$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s'-]+$/,
  CREDIT_CARD: /^\d{13,19}$/,
  CVV: /^\d{3,4}$/,
  EXPIRY_DATE: /^(0[1-9]|1[0-2])\/\d{2}$/,
};

// Default values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
};
