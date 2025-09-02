import React from "react";
import { AlertCircle, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AppError,
  FormErrors,
  getErrorMessage,
  getFieldError,
} from "@/lib/error-handling";

interface ErrorDisplayProps {
  error?: AppError | string | null;
  className?: string;
  onDismiss?: () => void;
  variant?: "default" | "destructive" | "warning";
}

export function ErrorDisplay({
  error,
  className,
  onDismiss,
  variant = "default",
}: ErrorDisplayProps) {
  if (!error) return null;

  const message = getErrorMessage(error);
  if (!message) return null;

  const variantClasses = {
    default: "bg-white border-red-200 text-red-800 shadow-lg",
    destructive: "bg-white border-red-300 text-red-900 shadow-lg",
    warning: "bg-white border-yellow-200 text-yellow-800 shadow-lg",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border rounded-lg",
        variantClasses[variant],
        className
      )}
    >
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface FieldErrorProps {
  error?: string | null;
  className?: string;
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p
      className={cn(
        "text-sm text-red-600 font-medium flex items-center gap-1 mt-1",
        className
      )}
    >
      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
      {error}
    </p>
  );
}

interface FormErrorsDisplayProps {
  errors: FormErrors;
  className?: string;
  onDismiss?: () => void;
}

export function FormErrorsDisplay({
  errors,
  className,
  onDismiss,
}: FormErrorsDisplayProps) {
  const errorEntries = Object.entries(errors).filter(([_, message]) => message);

  if (errorEntries.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {errorEntries.map(([field, message]) => (
        <div
          key={field}
          className="flex items-start gap-2 p-3 bg-white border border-red-200 rounded-lg shadow-sm"
        >
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-800">
              <span className="font-medium capitalize">
                {field.replace(/([A-Z])/g, " $1").trim()}:
              </span>{" "}
              {message}
            </p>
          </div>
        </div>
      ))}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Dismiss all errors
        </button>
      )}
    </div>
  );
}

interface LoadingErrorProps {
  error?: AppError | string | null;
  onRetry?: () => void;
  className?: string;
}

export function LoadingError({ error, onRetry, className }: LoadingErrorProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">{getErrorMessage(error)}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}
    >
      {Icon && <Icon className="h-12 w-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-4 max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface SuccessMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
  variant?: "default" | "success" | "info";
}

export function SuccessMessage({ 
  message, 
  className, 
  onDismiss, 
  variant = "default" 
}: SuccessMessageProps) {
  const variantClasses = {
    default: "bg-white border-green-200 text-green-800 shadow-lg",
    success: "bg-white border-green-300 text-green-900 shadow-lg",
    info: "bg-white border-blue-200 text-blue-800 shadow-lg",
  };

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 border rounded-lg",
      variantClasses[variant],
      className
    )}>
      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
