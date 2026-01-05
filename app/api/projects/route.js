import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";

// GET all projects
export async function GET() {
  try {
    await dbConnect();

    const projects = await Project.find().sort({ order: 1 });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST create new project (protected route)
export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    const project = await Project.create(data);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
