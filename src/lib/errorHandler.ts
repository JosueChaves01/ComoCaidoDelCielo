/**
 * Centralized Error Handler Service
 * Provides a unified way to log errors and potentially notify the user.
 */

export interface ErrorLogOptions {
  context?: string;
  silent?: boolean;
  severity?: "low" | "medium" | "high" | "critical";
}

class ErrorHandler {
  /**
   * Log an error with context and severity
   */
  public log(error: any, options: ErrorLogOptions = {}) {
    const { context = "Global", silent = false, severity = "medium" } = options;
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const timestamp = new Date().toISOString();

    // Log to console (in development)
    console.group(`[Error Handler] ${context} - ${severity.toUpperCase()}`);
    console.error(`Timestamp: ${timestamp}`);
    console.error(`Message: ${errorMessage}`);
    if (error?.stack) console.error(`Stack: ${error.stack}`);
    if (error?.details) console.error(`Details: ${error.details}`);
    console.groupEnd();

    // Here we could add integration with Sentry, Logtail, etc.
    // if (severity === 'critical') { sendToSentry(error); }

    if (!silent) {
      // If we had a toast library (like react-hot-toast), we would call it here
      // toast.error(`Error: ${errorMessage}`);
    }
  }

  /**
   * Specifically for Supabase errors which often have a 'details' or 'hint' field
   */
  public handleSupabaseError(error: any, context: string) {
    if (!error) return;
    
    this.log(error, {
      context: `Supabase:${context}`,
      severity: "high",
      silent: false
    });
  }

  /**
   * Specifically for n8n/Network errors
   */
  public handleNetworkError(error: any, context: string) {
    this.log(error, {
      context: `Network:${context}`,
      severity: "high",
      silent: false
    });
  }
}

export const errorHandler = new ErrorHandler();
