import type { Context, ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

import type { ApiErrorResponse } from '@analytics/protocol/site-stats'

import { logger } from '@/infrastructure/logging/logger'

export const invalidInputBody: ApiErrorResponse = {
  code: 'invalid_input',
  message: 'The request does not match the contract'
}

export const notFoundBody: ApiErrorResponse = {
  code: 'not_found',
  message: 'No route behind this address'
}

const internalErrorBody: ApiErrorResponse = {
  code: 'internal_error',
  message: 'Unexpected error'
}

/** The hook every `zValidator` takes, so each refused input answers the same body. */
export const invalidInput = (result: { success: boolean }, context: Context) =>
  result.success ? undefined : context.json(invalidInputBody, 400)

/** The one place an unhandled error is logged: a malformed or oversized request keeps its status. */
export const answerUnexpected: ErrorHandler = (error, context) => {
  if (error instanceof HTTPException) {
    const body: ApiErrorResponse = {
      code: invalidInputBody.code,
      message: error.message
    }
    return context.json(body, error.status)
  }

  logger.error('Unhandled error', {
    error: String(error),
    path: context.req.path
  })
  return context.json(internalErrorBody, 500)
}
