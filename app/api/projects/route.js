export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { projectSchema } from "@/lib/validation/projects";
import { handleError } from "@/lib/errorHandler";

// GET all projects
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find().sort({ order: 1 });
    return NextResponse.json(projects);
  } catch (error) {
    return handleError(error, "GET /api/projects");
  }
}

// POST create new project (protected route)
const createProjectHandler = requireAuth(
  validateRequest(projectSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const project = await Project.create(validatedData);
        return NextResponse.json(project, { status: 201 });
      } catch (error) {
        return handleError(error, "POST /api/projects");
      }
    }
  )
);

export async function POST(request, context) {
  return createProjectHandler(request, context);
}
