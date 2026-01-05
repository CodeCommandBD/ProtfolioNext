import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Skill from "@/lib/db/models/Skill";

// GET all skills
export async function GET() {
  try {
    await dbConnect();

    const skills = await Skill.find().sort({ order: 1 });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST create new skill category (protected route)
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    const skill = await Skill.create(data);

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
