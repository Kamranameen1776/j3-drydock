/*
 * Used to throw exceptions from the application layer
 * This type of exceptions should not be spawned to the client
 *
 * An Application Exception describes an error rooted in a technical issue,
 * such as an application that is not responding.
 */
export class ApplicationException extends Error {}
