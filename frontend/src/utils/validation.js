// Frontend validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return 'Name can only contain letters and spaces';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please provide a valid phone number';
  }
  return null;
};

export const validateZipCode = (zipcode) => {
  if (!zipcode) {
    return 'ZIP code is required';
  }
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipcode)) {
    return 'Please provide a valid ZIP code (e.g., 12345 or 12345-6789)';
  }
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateLength = (value, fieldName, min, max) => {
  if (!value) return null;
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters long`;
  }
  if (max && value.length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  return null;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Validate form data
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  const passwordError = validateRequired(formData.password, 'Password');
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) {
    errors.name = nameError;
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateOrderForm = (formData) => {
  const errors = {};
  
  const firstNameError = validateName(formData.firstName);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }
  
  const lastNameError = validateName(formData.lastName);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  const streetError = validateLength(formData.street, 'Street address', 5, 200);
  if (streetError) {
    errors.street = streetError;
  }
  
  const cityError = validateLength(formData.city, 'City', 2, 50);
  if (cityError) {
    errors.city = cityError;
  }
  
  const stateError = validateLength(formData.state, 'State', 2, 50);
  if (stateError) {
    errors.state = stateError;
  }
  
  const zipcodeError = validateZipCode(formData.zipcode);
  if (zipcodeError) {
    errors.zipcode = zipcodeError;
  }
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateContactForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) {
    errors.name = nameError;
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  const messageError = validateLength(formData.message, 'Message', 10, 1000);
  if (messageError) {
    errors.message = messageError;
  }
  
  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      errors.phone = phoneError;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
