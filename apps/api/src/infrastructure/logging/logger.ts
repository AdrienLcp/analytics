type LogContext = Record<string, unknown>

const format = (message: string, context?: LogContext): string =>
  context === undefined ? message : `${message} ${JSON.stringify(context)}`

/** Never log a beacon or a request header: the point of the API is to keep nothing about a visitor. */
export const logger = {
  error: (message: string, context?: LogContext): void => {
    console.error(format(message, context))
  },
  info: (message: string, context?: LogContext): void => {
    console.info(format(message, context))
  },
  warn: (message: string, context?: LogContext): void => {
    console.warn(format(message, context))
  }
}
