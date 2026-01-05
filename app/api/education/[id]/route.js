import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Education from "@/lib/db/models/Education";

// GET single education
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const education = await Education.findById(id);

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 }
    );
  }
}

// PUT update education (protected route)
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const data = await request.json();

    const education = await Education.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { error: "Failed to update education" },
      { status: 500 }
    );
  }
}

// DELETE education (protected route)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 }
    );
  }
}
