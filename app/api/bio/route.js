import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Bio from "@/lib/db/models/Bio";

// GET bio data
export async function GET() {
  try {
    await dbConnect();

    let bio = await Bio.findOne();

    // If no bio exists, return default structure
    if (!bio) {
      return NextResponse.json({
        name: "",
        roles: [],
        description: "",
        github: "",
        resume: "",
        linkedin: "",
        twitter: "",
        insta: "",
        facebook: "",
        profileImage: "",
      });
    }

    return NextResponse.json(bio);
  } catch (error) {
    console.error("Error fetching bio:", error);
    return NextResponse.json(
      { error: "Failed to fetch bio data" },
      { status: 500 }
    );
  }
}

// PUT update bio data (protected route - will add auth later)
export async function PUT(request) {
  try {
    await dbConnect();

    const data = await request.json();

    // Find existing bio or create new one
    let bio = await Bio.findOne();

    if (bio) {
      // Update existing
      bio = await Bio.findByIdAndUpdate(bio._id, data, {
        new: true,
        runValidators: true,
      });
    } else {
      // Create new
      bio = await Bio.create(data);
    }

    return NextResponse.json(bio);
  } catch (error) {
    console.error("Error updating bio:", error);
    return NextResponse.json(
      { error: "Failed to update bio data" },
      { status: 500 }
    );
  }
}
