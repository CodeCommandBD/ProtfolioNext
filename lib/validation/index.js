import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Validation middleware using Zod schemas
 * Wraps route handlers to validate request body
 *
 * @param {ZodSchema} schema - Zod validation schema
 * @returns {Function} Middleware function
 *
 * @example
 * export const POST = requireAuth(
 *   validateRequest(bioSchema)(
 *     async (request, context, session, validatedData) => {
 *       // validatedData is guaranteed to match schema
 *       return NextResponse.json({ success: true });
 *     }
 *   )
 * );
 */
export function validateRequest(schema) {
  return (handler) => {
    return async (request, context, session) => {
      try {
        const body = await request.json();
        const validatedData = schema.parse(body);

        // Pass validated data to handler
        return handler(request, context, session, validatedData);
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              error: "Validation failed",
              details: error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
                code: e.code,
              })),
            },
            { status: 400 }
          );
        }

        // Re-throw non-validation errors
        throw error;
      }
    };
  };
}

/**
 * Optional: Validate query parameters
 * @param {ZodSchema} schema - Zod schema for query params
 * @returns {Function} Middleware function
 */
export function validateQuery(schema) {
  return (handler) => {
    return async (request, context, session) => {
      try {
        const { searchParams } = new URL(request.url);
        const query = Object.fromEntries(searchParams);
        const validatedQuery = schema.parse(query);

        return handler(request, context, session, validatedQuery);
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            {
              error: "Invalid query parameters",
              details: error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
              })),
            },
            { status: 400 }
          );
        }
        throw error;
      }
    };
  };
}
