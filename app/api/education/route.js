import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Education from "@/lib/db/models/Education";

// GET all education records
export async function GET() {
  try {
    await dbConnect();

    const education = await Education.find().sort({ order: 1 });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 }
    );
  }
}

// POST create new education (protected route)
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    const education = await Education.create(data);

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    );
  }
}
