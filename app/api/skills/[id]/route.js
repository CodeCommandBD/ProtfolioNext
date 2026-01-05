import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Skill from "@/lib/db/models/Skill";

// GET single skill
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error fetching skill:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    );
  }
}

// PUT update skill (protected route)
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const data = await request.json();

    const skill = await Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// DELETE skill (protected route)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
