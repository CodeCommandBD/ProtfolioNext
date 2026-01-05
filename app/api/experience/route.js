import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Experience from "@/lib/db/models/Experience";

// GET all experiences
export async function GET() {
  try {
    await dbConnect();

    const experiences = await Experience.find().sort({ order: 1 });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST create new experience (protected route)
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    const experience = await Experience.create(data);

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
