export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Experience from "@/lib/db/models/Experience";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { experienceSchema } from "@/lib/validation/experience";
import { handleError } from "@/lib/errorHandler";

// GET single experience
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    return handleError(error, "GET /api/experience/[id]");
  }
}

// PUT update experience (protected route)
const updateExperienceHandler = requireAuth(
  validateRequest(experienceSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const { id } = context.params;

        const experience = await Experience.findByIdAndUpdate(
          id,
          validatedData,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!experience) {
          return NextResponse.json(
            { error: "Experience not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(experience);
      } catch (error) {
        return handleError(error, "PUT /api/experience/[id]");
      }
    }
  )
);

export async function PUT(request, context) {
  return updateExperienceHandler(request, context);
}

// DELETE experience (protected route)
const deleteExperienceHandler = requireAuth(async (request, context) => {
  try {
    await dbConnect();
    const { id } = context.params;

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    return handleError(error, "DELETE /api/experience/[id]");
  }
});

export async function DELETE(request, context) {
  return deleteExperienceHandler(request, context);
}
