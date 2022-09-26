type ErrorWithMessage = {
  message: string
}

/**
 * "If the error is an object with a message property that is a string, then it is an
 * ErrorWithMessage."
 *
 * The above function is a type guard. It's a function that takes an unknown value and returns a
 * boolean. If the boolean is true, then the unknown value is of the type that the type guard is
 * checking for
 * @param {unknown} error - unknown
 * @returns A function that takes an unknown value and returns a boolean.
 */
function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

/**
 * It takes an unknown value and returns an ErrorWithMessage
 * @param {unknown} maybeError - unknown
 * @returns An ErrorWithMessage object.
 */
function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

/**
 * It returns the message property of the error object
 * @param {unknown} error - unknown
 * @returns The error message of the error.
 */
export default function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}
