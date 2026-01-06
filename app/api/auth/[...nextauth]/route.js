// Custom NextAuth handler wrapper to prevent build-time static analysis issues
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let cachedHandler = null;

async function getAuthHandler() {
  if (cachedHandler) return cachedHandler;

  // Dynamic import to prevent build-time execution
  const NextAuth = (await import("next-auth")).default;
  const { authOptions } = await import("@/lib/authOptions");

  cachedHandler = NextAuth(authOptions);
  return cachedHandler;
}

export async function GET(req, ctx) {
  const handler = await getAuthHandler();
  return handler(req, ctx);
}

export async function POST(req, ctx) {
  const handler = await getAuthHandler();
  return handler(req, ctx);
}
