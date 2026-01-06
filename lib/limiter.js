const rateLimitMap = new Map();

export function rateLimit(request, limit = 5, windowMs = 60 * 1000) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    });
  }

  const ipData = rateLimitMap.get(ip);

  // Reset window if time passed
  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0;
    ipData.lastReset = Date.now();
  }

  // Increment
  ipData.count += 1;

  // Cleanup memory (optional simple strategy)
  if (rateLimitMap.size > 10000) {
    rateLimitMap.clear(); // Extreme cleanup to prevent memory leaks in serverless warm starts
  }

  if (ipData.count > limit) {
    return false; // Limit exceeded
  }

  return true; // OK
}
