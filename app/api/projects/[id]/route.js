export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Project from "@/lib/db/models/Project";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { projectSchema } from "@/lib/validation/projects";
import { handleError } from "@/lib/errorHandler";

// GET single project
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return handleError(error, "GET /api/projects/[id]");
  }
}

// PUT update project (protected route)
const updateProjectHandler = requireAuth(
  validateRequest(projectSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const { id } = context.params;

        const project = await Project.findByIdAndUpdate(id, validatedData, {
          new: true,
          runValidators: true,
        });

        if (!project) {
          return NextResponse.json(
            { error: "Project not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(project);
      } catch (error) {
        return handleError(error, "PUT /api/projects/[id]");
      }
    }
  )
);

export async function PUT(request, context) {
  return updateProjectHandler(request, context);
}

// DELETE project (protected route)
const deleteProjectHandler = requireAuth(async (request, context) => {
  try {
    await dbConnect();
    const { id } = context.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return handleError(error, "DELETE /api/projects/[id]");
  }
});

export async function DELETE(request, context) {
  return deleteProjectHandler(request, context);
}
