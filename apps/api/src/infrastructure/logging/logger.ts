type LogContext = Record<string, unknown>

/**
 * One object per call, so Workers Logs indexes each field. Never log a beacon
 * or a request header: the point of the API is to keep nothing about a visitor.
 */
export const logger = {
  error: (message: string, context?: LogContext): void => {
    console.error({ message, ...context })
  },
  info: (message: string, context?: LogContext): void => {
    console.info({ message, ...context })
  },
  warn: (message: string, context?: LogContext): void => {
    console.warn({ message, ...context })
  }
}
