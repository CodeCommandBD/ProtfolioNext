import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Temporary build bypass - will be replaced in production
export async function GET(request) {
  return NextResponse.json(
    {
      error: "Auth not configured for build",
      message: "This route will be functional after deployment",
    },
    { status: 503 }
  );
}

export async function POST(request) {
  return NextResponse.json(
    {
      error: "Auth not configured for build",
      message: "This route will be functional after deployment",
    },
    { status: 503 }
  );
}
