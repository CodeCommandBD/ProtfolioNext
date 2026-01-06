import { NextResponse } from "next/server";

/**
 * Centralized error handler for API routes
 * Logs full error server-side but returns safe messages to client
 *
 * @param {Error} error - The error object
 * @param {string} context - Context string for logging (e.g., "GET /api/bio")
 * @returns {NextResponse} JSON error response
 */
export function handleError(error, context = "API") {
  // Log full error server-side for debugging
  console.error(`[${context}] Error:`, {
    message: error.message,
    name: error.name,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });

  // Mongoose validation error
  if (error.name === "ValidationError") {
    return NextResponse.json(
      {
        error: "Invalid input data",
        details: Object.values(error.errors).map((e) => e.message),
      },
      { status: 400 }
    );
  }

  // Mongoose cast error (invalid ID format)
  if (error.name === "CastError") {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  // Duplicate key error
  if (error.code === 11000) {
    return NextResponse.json(
      { error: "Duplicate entry - resource already exists" },
      { status: 409 }
    );
  }

  // Generic error - don't leak implementation details
  return NextResponse.json(
    { error: "An error occurred processing your request" },
    { status: 500 }
  );
}

/**
 * Success response helper
 * @param {any} data - Response data
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}
