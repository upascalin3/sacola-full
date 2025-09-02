export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  field?: string;
  details?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: ValidationError[];
}

export class AppError extends Error {
  public code?: string;
  public statusCode?: number;
  public field?: string;
  public details?: string;

  constructor(message: string, options?: Partial<AppError>) {
    super(message);
    this.name = "AppError";
    this.code = options?.code;
    this.statusCode = options?.statusCode;
    this.field = options?.field;
    this.details = options?.details;
  }
}

export class ValidationError extends AppError {
  constructor(field: string, message: string) {
    super(message, { field, code: "VALIDATION_ERROR" });
    this.name = "ValidationError";
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, { statusCode, code: "API_ERROR" });
    this.name = "ApiError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network connection failed") {
    super(message, { code: "NETWORK_ERROR" });
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, { code: "AUTH_ERROR", statusCode: 401 });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, { code: "FORBIDDEN_ERROR", statusCode: 403 });
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, { code: "NOT_FOUND_ERROR", statusCode: 404 });
    this.name = "NotFoundError";
  }
}

export class ServerError extends AppError {
  constructor(message: string = "Server error occurred") {
    super(message, { code: "SERVER_ERROR", statusCode: 500 });
    this.name = "ServerError";
  }
}

// Error handling utilities
export function handleApiError(error: any): AppError {
  // Handle axios errors
  if (error?.response) {
    const { status, data } = error.response;
    const message = data?.message || error.message || "Request failed";

    switch (status) {
      case 400:
        return new AppError(message, { statusCode: 400, code: "BAD_REQUEST" });
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 404:
        return new NotFoundError(message);
      case 422:
        return new ValidationError("form", message);
      case 500:
        return new ServerError(message);
      default:
        return new AppError(message, { statusCode: status });
    }
  }

  // Handle network errors
  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error")
  ) {
    return new NetworkError();
  }

  // Handle validation errors
  if (error?.code === "VALIDATION_ERROR") {
    return error;
  }

  // Handle unknown errors
  return new AppError(error?.message || "An unexpected error occurred");
}

export function handleValidationErrors(errors: ValidationError[]): FormErrors {
  const formErrors: FormErrors = {};
  errors.forEach((error) => {
    formErrors[error.field] = error.message;
  });
  return formErrors;
}

export function getErrorMessage(error: AppError | string | null): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  return error.message;
}

export function isFieldError(error: AppError | null, field: string): boolean {
  return error?.field === field;
}

export function getFieldError(errors: FormErrors, field: string): string {
  return errors[field] || "";
}

// Error message constants for consistent messaging
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password must be at least 6 characters",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_DATE: "Please enter a valid date",
  INVALID_NUMBER: "Please enter a valid number",
  NETWORK_ERROR:
    "Network connection failed. Please check your internet connection.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  LOGIN_FAILED: "Login failed. Please check your credentials and try again.",
  CREATE_FAILED: "Failed to create entry. Please try again.",
  UPDATE_FAILED: "Failed to update entry. Please try again.",
  DELETE_FAILED: "Failed to delete entry. Please try again.",
  LOAD_FAILED: "Failed to load data. Please try again.",
} as const;

// Success message constants for consistent messaging
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...',
  LOGOUT_SUCCESS: 'Logged out successfully',
  CREATE_SUCCESS: 'Entry created successfully',
  UPDATE_SUCCESS: 'Entry updated successfully',
  DELETE_SUCCESS: 'Entry deleted successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  DATA_SAVED: 'Data saved successfully',
  OPERATION_COMPLETED: 'Operation completed successfully',
} as const;

// Form validation helpers
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return ERROR_MESSAGES.INVALID_PASSWORD;
  }
  return null;
}

export function validateDate(date: string): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return ERROR_MESSAGES.INVALID_DATE;
  }
  return null;
}

export function validateNumber(value: any): string | null {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) {
    return ERROR_MESSAGES.INVALID_NUMBER;
  }
  return null;
}
