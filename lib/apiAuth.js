import { NextResponse } from "next/server";

/**
 * Authentication middleware for API routes
 * Uses dynamic imports to prevent build-time issues
 */
export function requireAuth(handler) {
  return async (request, context) => {
    try {
      // Dynamic imports to avoid build-time static analysis
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/authOptions");

      const session = await getServerSession(authOptions);

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized - Authentication required" },
          { status: 401 }
        );
      }

      return handler(request, context, session);
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      );
    }
  };
}
