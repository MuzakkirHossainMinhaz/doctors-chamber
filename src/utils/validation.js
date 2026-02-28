// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (supports multiple formats)
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;

  const phoneRegex = /^[\d\s\-\.\(\)]+$/;
  const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, "");

  return (
    phoneRegex.test(phone) && cleanPhone.length >= 10 && cleanPhone.length <= 15
  );
};

// Required field validation
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

// Password validation (strong password requirements)
export const validatePassword = (password) => {
  if (!password || typeof password !== "string") return false;

  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Booking data validation
export const validateBookingData = (bookingData) => {
  if (!bookingData || typeof bookingData !== "object") return false;

  const requiredFields = ["patientName", "email", "phone", "date", "time"];

  for (const field of requiredFields) {
    if (!validateRequired(bookingData[field])) {
      return false;
    }
  }

  if (!validateEmail(bookingData.email)) return false;
  if (!validatePhone(bookingData.phone)) return false;
  if (!isValidDate(bookingData.date)) return false;
  if (!isValidTime(bookingData.time)) return false;

  return true;
};

// Input sanitization
export const sanitizeInput = (input) => {
  if (!input) return "";

  if (typeof input !== "string") return String(input);

  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
};

// Phone number formatting
export const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== "string") return "";

  const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, "");

  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith("1")) {
    return `+${cleanPhone.slice(0, 1)} (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
  }

  return phone; // Return original if can't format
};

// Date validation
export const isValidDate = (date) => {
  if (!date) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate);
};

// Time validation
export const isValidTime = (time) => {
  if (!time || typeof time !== "string") return false;

  // Support formats: "09:00 AM", "9:00 AM", "14:30", "2:30 PM"
  const timeRegex = /^([0-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)?$/i;
  if (!timeRegex.test(time)) return false;

  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const minute = parseInt(minutes.split(" ")[0]);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

// Credit card validation (basic)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== "string") return false;

  const cleanCard = cardNumber.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(cleanCard)) return false;
  if (cleanCard.length < 13 || cleanCard.length > 19) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleanCard.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCard[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// CVV validation
export const validateCVV = (cvv) => {
  if (!cvv || typeof cvv !== "string") return false;

  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

// Expiry date validation
export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate || typeof expiryDate !== "string") return false;

  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) return false;

  const [month, year] = expiryDate.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year);
  const expMonth = parseInt(month);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

// Name validation
export const validateName = (name) => {
  if (!name || typeof name !== "string") return false;

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  const trimmedName = name.trim();

  return (
    nameRegex.test(trimmedName) &&
    trimmedName.length >= 2 &&
    trimmedName.length <= 50
  );
};

// URL validation
export const validateURL = (url) => {
  if (!url || typeof url !== "string") return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File validation
export const validateFile = (
  file,
  allowedTypes = [],
  maxSize = 5 * 1024 * 1024,
) => {
  if (!file || !(file instanceof File)) return false;

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return false;
  }

  if (file.size > maxSize) {
    return false;
  }

  return true;
};

// Age validation
export const validateAge = (birthDate, minAge = 18, maxAge = 120) => {
  if (!isValidDate(birthDate)) return false;

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= minAge && age <= maxAge;
};

// Numeric validation
export const validateNumber = (value, min = null, max = null) => {
  if (value === null || value === undefined || value === "") return false;

  const num = parseFloat(value);

  if (isNaN(num)) return false;

  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;

  return true;
};

// Select option validation
export const validateSelect = (value, allowedValues = []) => {
  if (!validateRequired(value)) return false;

  return allowedValues.length === 0 || allowedValues.includes(value);
};

// Checkbox validation
export const validateCheckbox = (checked, required = false) => {
  if (required && !checked) return false;
  return true;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    let fieldIsValid = true;

    for (const rule of rules) {
      const ruleResult = rule(value, formData);

      if (typeof ruleResult === "boolean") {
        fieldIsValid = fieldIsValid && ruleResult;
      } else if (typeof ruleResult === "string") {
        fieldIsValid = false;
        errors[field] = ruleResult;
        break;
      }
    }

    if (!fieldIsValid && !errors[field]) {
      errors[field] = `${field} is invalid`;
    }

    isValid = isValid && fieldIsValid;
  }

  return { isValid, errors };
};

// Common validation rules
export const validationRules = {
  required: (value) => validateRequired(value) || "This field is required",
  email: (value) =>
    validateEmail(value) || "Please enter a valid email address",
  phone: (value) => validatePhone(value) || "Please enter a valid phone number",
  password: (value) =>
    validatePassword(value) ||
    "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  name: (value) => validateName(value) || "Please enter a valid name",
  creditCard: (value) =>
    validateCreditCard(value) || "Please enter a valid credit card number",
  cvv: (value) => validateCVV(value) || "Please enter a valid CVV",
  expiryDate: (value) =>
    validateExpiryDate(value) || "Please enter a valid expiry date (MM/YY)",
  url: (value) => validateURL(value) || "Please enter a valid URL",
  number: (value, formData, min, max) =>
    validateNumber(value, min, max) ||
    `Please enter a valid number${min ? ` (min: ${min})` : ""}${max ? ` (max: ${max})` : ""}`,
  select: (value, formData, allowedValues) =>
    validateSelect(value, allowedValues) || "Please select a valid option",
  minLength: (min) => (value) => {
    if (!validateRequired(value)) return true;
    return value.length >= min || `Minimum length is ${min} characters`;
  },
  maxLength: (max) => (value) => {
    if (!validateRequired(value)) return true;
    return value.length <= max || `Maximum length is ${max} characters`;
  },
};
